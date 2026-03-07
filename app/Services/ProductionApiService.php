<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProductionApiService
{
    private const CACHE_KEY_TOKEN = 'produccion_api_token';

    private const CACHE_KEY_FORMULAS = 'produccion_api_formulas';

    public function __construct(
        private string $baseUrl,
        private ?string $clientId,
        private ?string $clientSecret,
    ) {}

    public function getAccessToken(): ?string
    {
        $cached = Cache::get(self::CACHE_KEY_TOKEN);

        if ($cached !== null) {
            return $cached;
        }

        $response = Http::post("{$this->baseUrl}/oauth/token", [
            'grant_type' => 'client_credentials',
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
        ]);

        if ($response->failed()) {
            Log::error('ProductionApi: Failed to get access token', [
                'status' => $response->status(),
            ]);

            return null;
        }

        $token = $response->json('access_token');
        $expiresIn = $response->json('expires_in', 60 * 60 * 24);

        Cache::put(self::CACHE_KEY_TOKEN, $token, (int) ($expiresIn * 0.9));

        return $token;
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    public function getFormulas(): array
    {
        return Cache::remember(self::CACHE_KEY_FORMULAS, 60 * 30, function () {
            return $this->fetchFormulas();
        });
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    private function fetchFormulas(): array
    {
        $token = $this->getAccessToken();

        if (! $token) {
            return [];
        }

        $response = Http::withToken($token)->get("{$this->baseUrl}/api/formulas");

        if ($response->status() === 401) {
            Cache::forget(self::CACHE_KEY_TOKEN);
            $token = $this->getAccessToken();

            if ($token) {
                $response = Http::withToken($token)->get("{$this->baseUrl}/api/formulas");
            }
        }

        if ($response->failed()) {
            Log::error('ProductionApi: Failed to get formulas', [
                'status' => $response->status(),
            ]);

            return [];
        }

        return $response->json();
    }
}
