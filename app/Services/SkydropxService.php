<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
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
     * @return array<string, mixed>|null
     *
     * @throws ConnectionException
     */
    public function getQuote(string $quoteId): ?array
    {
        $token = $this->getOauthToken();

        if (! $token) {
            return null;
        }

        $response = Http::withToken($token)
            ->timeout(10)
            ->get("{$this->baseUrl}/quotations/{$quoteId}");

        if ($response->status() === 401) {
            Cache::forget('skydropx_access_token');
            $token = $this->getOauthToken();
            $response = $token
                ? Http::withToken($token)->timeout(10)->get("{$this->baseUrl}/quotations/{$quoteId}")
                : null;
        }

        if (! $response || $response->failed()) {
            Log::error('Skydropx: Failed to get quotation', [
                'quote_id' => $quoteId,
                'status' => $response?->status(),
            ]);

            return null;
        }

        return $response->json();
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

    private function requestQuotation(array $destination, array $parcel): ?Response
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

    private function pollUntilCompleted(Response $response): ?Response
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
        $id = $data['id'] ?? null;

        return collect($data['rates'])
            ->filter(fn (array $rate) => ($rate['success'] ?? false) === true)
            ->map(function (array $rate) use ($id) {
                return [
                    'carrier' => $rate['provider_display_name'] ?? 'Desconocido',
                    'service' => $rate['provider_service_name'] ?? 'Estándar',
                    'price' => (float) ($rate['total'] ?? 0),
                    'estimated_days' => (int) ($rate['days'] ?? 5),
                    'quote_id' => $id,
                    'rate_id' => $rate['id'] ?? null,
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
    public function createShipment(array $addressTo, Order $order): ?array
    {
        try {
            $token = $this->getOauthToken();

            if (! $token) {
                return null;
            }

            $rateId = $order->shipping_rate_id;
            $origin = $this->fullAddressFrom();

            $shipmentPayload = [
                'shipment' => [
                    'rate_id' => $rateId,
                    'printing_format' => 'standard',
                    'address_from' => $origin,
                    'address_to' => [
                        'country_code' => 'MX',
                        'postal_code' => $addressTo['postal_code'],
                        'area_level1' => $addressTo['state'],
                        'area_level2' => $addressTo['city'],
                        'area_level3' => $addressTo['neighborhood'],
                        'name' => $addressTo['name'] ?? '',
                        'street1' => $addressTo['street'] ?? '',
                        'phone' => $addressTo['phone'] ?? '',
                        'email' => $addressTo['email'] ?? '',
                        'reference' => $addressTo['reference'] ?? 'Casa',
                    ],
                    'packages' => [[
                        'package_number' => '1',
                        'consignment_note' => '53102400',
                        'package_type' => '4G',
                    ]],
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
            $id = $shipmentData['data']['id'];
            $order->skydropx_shipment_id = $id;
            $order->save();

            $trackingInfo = $this->getTrackingInfo($shipmentResponse);

            return [
                'id' => (string) ($shipmentData['data']['id'] ?? ''),
                'tracking_number' => $trackingInfo['tracking_number'] ?? null,
                'tracking_url' => $trackingInfo['tracking_url'] ?? null,
                'label_url' => $trackingInfo['label_url'] ?? null,
            ];
        } catch (\Throwable $e) {
            Log::error('Skydropx: Exception creating shipment', [
                'message' => $e->getMessage(),
            ]);

            return null;
        }
    }

    public function getTracking(string $shipmentId): ?array
    {
        try {
            $token = $this->getOauthToken();

            if (! $token) {
                return null;
            }

            $shipmentResponse = Http::withToken($token)
                ->timeout(15)
                ->get("{$this->baseUrl}/shipments/{$shipmentId}");

            if ($shipmentResponse->failed()) {
                Log::error('Skydropx: Failed to get shipment tracking info', [
                    'status' => $shipmentResponse->status(),
                    'body' => $shipmentResponse->body(),
                ]);

                return null;
            }

            $trackingInfo = $this->getTrackingInfo($shipmentResponse);

            return [
                'id' => $shipmentId,
                'tracking_number' => $trackingInfo['tracking_number'] ?? null,
                'tracking_url' => $trackingInfo['tracking_url'] ?? null,
                'label_url' => $trackingInfo['label_url'] ?? null,
            ];
        } catch (\Throwable $e) {
            Log::error('Skydropx: Exception getting tracking info', [
                'message' => $e->getMessage(),
            ]);

            return null;
        }
    }

    private function getTrackingInfo(Response $response): ?array
    {
        $response = $this->pollUntilTracking($response);

        $data = $response->json('included');
        $package = collect($data)->firstWhere('type', 'package');

        if (! $package) {
            return null;
        }

        $data = $package['attributes'];

        return [
            'tracking_number' => $data['tracking_number'] ?? null,
            'tracking_url' => $data['tracking_url_provider'] ?? null,
            'label_url' => $data['label_url'] ?? null,
        ];
    }

    private function pollUntilTracking(Response $response): ?Response
    {
        $token = Cache::get('skydropx_access_token');

        $data = $response->json('data');
        $shipmentId = $data['id'];
        $maxAttempts = $data['attributes']['workflow_status'] === 'success' ? 0 : 15;

        for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
            sleep(1);
            $response = Http::withToken($token)->timeout(10)->get("{$this->baseUrl}/shipments/{$shipmentId}");
            $data = $response->json('data');

            if ($response->failed() || $data['attributes']['workflow_status'] === 'success') {
                break;
            }
        }

        if ($response->failed() || $data['attributes']['workflow_status'] !== 'success') {
            throw new \RuntimeException(
                "Skydropx: Tracking info polling failed or timed out for shipment {$shipmentId}"
            );
        }

        return $response;
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
            'street1' => $origin['street'],
            'phone' => $origin['phone'],
            'email' => $origin['email'],
            'reference' => $origin['reference'] ?? 'Casa',
        ];
    }

    private function addressFrom(): array
    {
        return [
            'country_code' => 'MX',
            'postal_code' => '97130',
            'area_level1' => 'Yucatán',
            'area_level2' => 'Conkal',
            'area_level3' => 'San Diego Cutz Dos',
        ];
    }
}
