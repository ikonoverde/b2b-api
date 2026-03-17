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
                ];
            })
            ->filter(fn (array $quote) => $quote['price'] > 0)
            ->sortBy('price')
            ->values()
            ->all();
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
