<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

readonly class OutscraperService
{
    public function __construct(
        private string $apiKey,
        private string $baseUrl,
    ) {}

    /**
     * Submit an async Google Maps search and return the Outscraper request id.
     *
     * @param  array<int, string>  $queries
     */
    public function startSearch(
        array $queries,
        string $language = 'es',
        string $region = 'MX',
        int $limit = 100,
    ): ?string {
        try {
            $response = $this->request()->post('/google-maps-search', [
                'query' => $queries,
                'language' => $language,
                'region' => $region,
                'limit' => $limit,
                'dropDuplicates' => true,
                'enrichment' => ['contacts_n_leads'],
                'async' => true,
            ]);
        } catch (Throwable $e) {
            Log::error('OutscraperService: Failed to start search', [
                'message' => $e->getMessage(),
            ]);

            return null;
        }

        if ($response->failed() || $response->json('error') === true) {
            Log::error('OutscraperService: Failed to start search', [
                'status' => $response->status(),
                'message' => $response->json('errorMessage'),
            ]);

            return null;
        }

        $result = $response->json();

        if (! is_array($result)) {
            return null;
        }

        return $result['id'] ?? null;
    }

    /**
     * Fetch the current status of a submitted request, returning normalized
     * status and (when Success) a flattened list of result items.
     *
     * @return array{status: string, items: array<int, array<string, mixed>>|null}|null
     */
    public function getRequestStatus(string $requestId): ?array
    {
        try {
            $response = $this->request()->get("/requests/{$requestId}");
        } catch (Throwable $e) {
            Log::error('OutscraperService: Failed to fetch request archive', [
                'request_id' => $requestId,
                'message' => $e->getMessage(),
            ]);

            return null;
        }

        if ($response->failed() || $response->json('error') === true) {
            Log::error('OutscraperService: Failed to fetch request archive', [
                'request_id' => $requestId,
                'status' => $response->status(),
                'message' => $response->json('errorMessage'),
            ]);

            return null;
        }

        $result = $response->json();

        if (! is_array($result)) {
            return null;
        }

        $status = $result['status'] ?? 'Pending';
        $items = null;

        if ($status === 'Success') {
            $items = $this->flattenData($result['data'] ?? []);
        }

        return [
            'status' => $status,
            'items' => $items,
        ];
    }

    /**
     * Outscraper returns data as a 2-D array (one sub-array per query). Flatten
     * it so callers can iterate a single list of business rows.
     *
     * @param  array<int, mixed>  $data
     * @return array<int, array<string, mixed>>
     */
    private function flattenData(array $data): array
    {
        if ($data === []) {
            return [];
        }

        $first = $data[array_key_first($data)];
        if (is_array($first) && array_is_list($first)) {
            return array_merge(...array_values($data));
        }

        return $data;
    }

    private function request(): PendingRequest
    {
        return Http::baseUrl($this->baseUrl)
            ->acceptJson()
            ->withHeaders([
                'X-API-KEY' => $this->apiKey,
            ])
            ->timeout(30);
    }
}
