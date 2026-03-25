<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SkydropxService
{
    public function __construct(
        private string $baseUrl,
        private string $apiKey,
        private string $apiSecret,
    ) {}

    /**
     * @param  array{postal_code: string, city: string, state: string, neighborhood: string}  $destination
     * @param  array{weight: float, height: float, width: float, length: float}  $parcel
     * @return array<int, array{carrier: string, service: string, price: float, estimated_days: int, quote_id: string}>
     */
    public function getQuotes(array $destination, array $parcel): array
    {
        $cacheKey = sprintf(
            'skydropx_quotes:%s:%s',
            md5(json_encode($destination)),
            md5(json_encode($parcel)),
        );

        $cached = Cache::get($cacheKey);

        if ($cached !== null) {
            return $cached;
        }

        $quotes = $this->fetchQuotes($destination, $parcel);

        if (! empty($quotes)) {
            Cache::put($cacheKey, $quotes, 300);
        }

        return $quotes;
    }

    /**
     * @param  array{postal_code: string, city: string, state: string, neighborhood: string}  $destination
     * @param  array{weight: float, height: float, width: float, length: float}  $parcel
     * @return array<int, array{carrier: string, service: string, price: float, estimated_days: int, quote_id: string}>
     */
    private function fetchQuotes(array $destination, array $parcel): array
    {
        try {
            $response = $this->requestQuotation($destination, $parcel);

            if (! $response || $response->failed()) {
                return [];
            }

            $response = $this->pollUntilCompleted($response);

            return $response ? $this->normalizeResponse($response->json()) : [];
        } catch (\Throwable $e) {
            Log::error('Skydropx: Exception while fetching quotes', [
                'message' => $e->getMessage(),
            ]);

            return [];
        }
    }

    private function requestQuotation(array $destination, array $parcel): ?\Illuminate\Http\Client\Response
    {
        $token = $this->getOauthToken();

        if (! $token) {
            return null;
        }

        $payload = [
            'quotation' => [
                'address_from' => $this->addressFrom(),
                'address_to' => [
                    'country_code' => 'MX',
                    'postal_code' => $destination['postal_code'],
                    'area_level1' => $destination['state'],
                    'area_level2' => $destination['city'],
                    'area_level3' => $destination['neighborhood'],
                ],
                'parcels' => [
                    [
                        'length' => $parcel['length'],
                        'width' => $parcel['width'],
                        'height' => $parcel['height'],
                        'weight' => $parcel['weight'],
                    ],
                ],
                'requested_carriers' => [
                    'fedex',
                    'dhl',
                    'estafeta',
                    'paquetexpress',
                ],
            ],
        ];

        $response = Http::withToken($token)->timeout(10)->post("{$this->baseUrl}/quotations", $payload);

        if ($response->status() === 401) {
            Cache::forget('skydropx_access_token');
            $token = $this->getOauthToken();
            $response = $token
                ? Http::withToken($token)->timeout(10)->post("{$this->baseUrl}/quotations", $payload)
                : null;
        }

        if (! $response || $response->failed()) {
            Log::error('Skydropx: Failed to get quotes', [
                'status' => $response?->status(),
            ]);

            return null;
        }

        return $response;
    }

    private function pollUntilCompleted(\Illuminate\Http\Client\Response $response): ?\Illuminate\Http\Client\Response
    {
        $token = Cache::get('skydropx_access_token');
        $quoteId = $response->json('id');
        $maxAttempts = $response->json('is_completed') ? 0 : 15;

        for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
            sleep(1);
            $response = Http::withToken($token)->timeout(10)->get("{$this->baseUrl}/quotations/{$quoteId}");

            if ($response->failed() || $response->json('is_completed')) {
                break;
            }
        }

        if ($response->failed() || ! $response->json('is_completed')) {
            Log::warning('Skydropx: Quotation polling failed or timed out', ['quote_id' => $quoteId]);

            return null;
        }

        return $response;
    }

    private function getOauthToken(): ?string
    {
        $cached = Cache::get('skydropx_access_token');

        if ($cached !== null) {
            return $cached;
        }

        $token = $this->requestTokenViaRefresh();

        if ($token) {
            return $token;
        }

        return $this->requestTokenViaCredentials();
    }

    private function requestTokenViaCredentials(): ?string
    {
        $response = Http::post("{$this->baseUrl}/oauth/token", [
            'grant_type' => 'client_credentials',
            'client_id' => $this->apiKey,
            'client_secret' => $this->apiSecret,
        ]);

        if ($response->failed()) {
            Log::error('Skydropx: Failed to get access token via client_credentials', [
                'status' => $response->status(),
            ]);

            return null;
        }

        return $this->cacheTokenResponse($response->json());
    }

    private function requestTokenViaRefresh(): ?string
    {
        $refreshToken = Cache::get('skydropx_refresh_token');

        if (! $refreshToken) {
            return null;
        }

        $response = Http::post("{$this->baseUrl}/oauth/token", [
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
            'client_id' => $this->apiKey,
            'client_secret' => $this->apiSecret,
        ]);

        if ($response->failed()) {
            Cache::forget('skydropx_refresh_token');

            return null;
        }

        return $this->cacheTokenResponse($response->json());
    }

    private function cacheTokenResponse(array $data): ?string
    {
        $accessToken = $data['access_token'] ?? null;

        if (! $accessToken) {
            return null;
        }

        $expiresIn = (int) ($data['expires_in'] ?? 3600);
        Cache::put('skydropx_access_token', $accessToken, (int) ($expiresIn * 0.9));

        $refreshToken = $data['refresh_token'] ?? null;

        if ($refreshToken) {
            Cache::put('skydropx_refresh_token', $refreshToken, $expiresIn * 2);
        }

        return $accessToken;
    }

    /**
     * @return array<int, array{carrier: string, service: string, price: float, estimated_days: int, quote_id: string}>
     */
    private function normalizeResponse(array $data): array
    {
        return collect($data['rates'])
            ->filter(fn (array $rate) => ($rate['success'] ?? false) === true)
            ->map(function (array $rate) {
                return [
                    'carrier' => $rate['provider_display_name'] ?? 'Desconocido',
                    'service' => $rate['provider_service_name'] ?? 'Estándar',
                    'price' => (float) ($rate['total'] ?? 0),
                    'estimated_days' => (int) ($rate['days'] ?? 5),
                    'quote_id' => 'skydropx_'.($rate['id'] ?? uniqid()),
                    'skydropx_rate_id' => $rate['id'] ?? null,
                ];
            })
            ->filter(fn (array $quote) => $quote['price'] > 0)
            ->sortBy('price')
            ->values()
            ->all();
    }

    /**
     * Create a shipment by re-quoting and matching the carrier/service.
     *
     * @param  array{postal_code: string, city: string, state: string, neighborhood: string}  $addressTo
     * @param  array{weight: float, height: float, width: float, length: float}  $parcel
     * @return array{id: string, tracking_number: string|null, tracking_url: string|null, label_url: string|null}|null
     */
    public function createShipment(array $addressTo, array $parcel, string $carrierName, string $serviceName): ?array
    {
        try {
            $token = $this->getOauthToken();

            if (! $token) {
                return null;
            }

            $response = $this->requestQuotation($addressTo, $parcel);

            if (! $response || $response->failed()) {
                return null;
            }

            $response = $this->pollUntilCompleted($response);

            if (! $response) {
                return null;
            }

            $data = $response->json();
            $quotationId = $data['id'] ?? null;
            $matchedRate = $this->matchRate($data['rates'] ?? [], $carrierName, $serviceName);

            if (! $matchedRate || ! $quotationId) {
                Log::warning('Skydropx: No matching rate found for shipment', [
                    'carrier' => $carrierName,
                    'service' => $serviceName,
                ]);

                return null;
            }

            $origin = $this->fullAddressFrom();

            $shipmentPayload = [
                'shipment' => [
                    'quotation_id' => $quotationId,
                    'rate_id' => $matchedRate['id'],
                    'address_from' => $origin,
                    'address_to' => [
                        'country_code' => 'MX',
                        'postal_code' => $addressTo['postal_code'],
                        'area_level1' => $addressTo['state'],
                        'area_level2' => $addressTo['city'],
                        'area_level3' => $addressTo['neighborhood'],
                        'name' => $addressTo['name'] ?? '',
                        'street' => $addressTo['street'] ?? '',
                        'phone' => $addressTo['phone'] ?? '',
                        'email' => $addressTo['email'] ?? '',
                    ],
                    'parcels' => [
                        [
                            'length' => $parcel['length'],
                            'width' => $parcel['width'],
                            'height' => $parcel['height'],
                            'weight' => $parcel['weight'],
                        ],
                    ],
                ],
            ];

            $shipmentResponse = Http::withToken($token)
                ->timeout(15)
                ->post("{$this->baseUrl}/shipments", $shipmentPayload);

            if ($shipmentResponse->failed()) {
                Log::error('Skydropx: Failed to create shipment', [
                    'status' => $shipmentResponse->status(),
                    'body' => $shipmentResponse->body(),
                ]);

                return null;
            }

            $shipmentData = $shipmentResponse->json();

            return [
                'id' => (string) ($shipmentData['id'] ?? ''),
                'tracking_number' => $shipmentData['tracking_number'] ?? null,
                'tracking_url' => $shipmentData['tracking_url'] ?? null,
                'label_url' => $shipmentData['label_url'] ?? null,
            ];
        } catch (\Throwable $e) {
            Log::error('Skydropx: Exception creating shipment', [
                'message' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Retrieve a label URL for a shipment.
     */
    public function getLabel(string $shipmentId): ?string
    {
        try {
            $token = $this->getOauthToken();

            if (! $token) {
                return null;
            }

            $response = Http::withToken($token)
                ->timeout(10)
                ->get("{$this->baseUrl}/shipments/{$shipmentId}/labels");

            if ($response->failed()) {
                return null;
            }

            return $response->json('label_url') ?? $response->json('url');
        } catch (\Throwable $e) {
            Log::error('Skydropx: Exception fetching label', [
                'shipment_id' => $shipmentId,
                'message' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Full origin address for shipment creation (includes contact info).
     *
     * @return array<string, string>
     */
    public function fullAddressFrom(): array
    {
        $origin = config('shop.shipping_origin');

        return [
            'country_code' => 'MX',
            'postal_code' => $origin['postal_code'],
            'area_level1' => $origin['state'],
            'area_level2' => $origin['city'],
            'area_level3' => $origin['neighborhood'],
            'name' => $origin['name'],
            'street' => $origin['street'],
            'phone' => $origin['phone'],
            'email' => $origin['email'],
        ];
    }

    /**
     * Match a rate by carrier and service name (case-insensitive contains).
     *
     * @param  array<int, array<string, mixed>>  $rates
     * @return array<string, mixed>|null
     */
    private function matchRate(array $rates, string $carrierName, string $serviceName): ?array
    {
        $carrierLower = mb_strtolower($carrierName);
        $serviceLower = mb_strtolower($serviceName);

        $successRates = array_filter($rates, fn (array $rate) => ($rate['success'] ?? false) === true);

        foreach ($successRates as $rate) {
            $rateCarrier = mb_strtolower($rate['provider_display_name'] ?? '');
            $rateService = mb_strtolower($rate['provider_service_name'] ?? '');

            if (str_contains($rateCarrier, $carrierLower) && str_contains($rateService, $serviceLower)) {
                return $rate;
            }
        }

        return null;
    }

    private function addressFrom(): array
    {
        return [
            'country_code' => 'MX',
            'postal_code' => '97130',
            'area_level1' => 'Yucatán',
            'area_level2' => 'Mérida',
            'area_level3' => 'Altabrisa',
        ];
    }
}
