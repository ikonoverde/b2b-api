<?php

namespace App\Services\Ads;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

class GoogleAdsKeywordPlannerService
{
    /**
     * @var array<string, string>
     */
    private const GEO_TARGETS = [
        'MX' => 'geoTargetConstants/2484',
        'US' => 'geoTargetConstants/2840',
    ];

    /**
     * @var array<string, string>
     */
    private const LANGUAGES = [
        'en' => 'languageConstants/1000',
        'es' => 'languageConstants/1003',
    ];

    public function __construct(
        private ?string $accessToken = null,
        private ?string $baseUrl = null,
        private ?string $apiVersion = null,
    ) {}

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function keywordIdeas(array $arguments): array
    {
        try {
            $keywords = $this->keywords($arguments);
            $customerId = $this->customerId($arguments['customer_id'] ?? null);
            $geoTarget = $this->geoTarget($arguments['geo_target_constant'] ?? null, $arguments['country'] ?? null);
            $language = $this->language($arguments['language_constant'] ?? null, $arguments['language'] ?? null);
            $limit = $this->limit($arguments['limit'] ?? null);

            $response = $this->request()->post("customers/{$customerId}:generateKeywordIdeas", array_filter([
                'language' => $language,
                'geoTargetConstants' => [$geoTarget],
                'keywordPlanNetwork' => 'GOOGLE_SEARCH_AND_PARTNERS',
                'keywordSeed' => [
                    'keywords' => $keywords,
                ],
                'pageSize' => $limit,
            ]));

            $payload = $response->json();

            if (! is_array($payload)) {
                return [
                    'error' => true,
                    'provider' => 'google_ads_keyword_planner',
                    'status' => $response->status(),
                    'message' => 'Google Ads returned a non-JSON response.',
                ];
            }

            if ($response->failed()) {
                return [
                    'error' => true,
                    'provider' => 'google_ads_keyword_planner',
                    'status' => $response->status(),
                    'response' => $payload,
                ];
            }

            return [
                'provider' => 'google_ads_keyword_planner',
                'customer_id' => $customerId,
                'geo_target_constant' => $geoTarget,
                'language_constant' => $language,
                'keyword_plan_network' => 'GOOGLE_SEARCH_AND_PARTNERS',
                'seed_keywords' => $keywords,
                'rows' => $this->rows($payload, $limit),
            ];
        } catch (Throwable $exception) {
            return [
                'error' => true,
                'provider' => 'google_ads_keyword_planner',
                'message' => $exception->getMessage(),
                'exception' => $exception::class,
            ];
        }
    }

    private function request(): PendingRequest
    {
        return Http::baseUrl(sprintf('%s/%s', rtrim($this->baseUrl ?? config('services.google_ads.base_url', 'https://googleads.googleapis.com'), '/'), $this->apiVersion ?? config('services.google_ads.api_version', 'v22')))
            ->withToken($this->token())
            ->withHeaders(array_filter([
                'developer-token' => config('services.google_ads.developer_token'),
                'login-customer-id' => config('services.google_ads.login_customer_id'),
            ]))
            ->acceptJson()
            ->timeout(20);
    }

    private function token(): string
    {
        if ($this->accessToken !== null) {
            return $this->accessToken;
        }

        $response = Http::asForm()
            ->acceptJson()
            ->timeout(15)
            ->post('https://oauth2.googleapis.com/token', [
                'client_id' => $this->requiredConfig('services.google_ads.client_id'),
                'client_secret' => $this->requiredConfig('services.google_ads.client_secret'),
                'refresh_token' => $this->requiredConfig('services.google_ads.refresh_token'),
                'grant_type' => 'refresh_token',
            ]);

        $payload = $response->json();

        if (! is_array($payload) || ! is_string($payload['access_token'] ?? null)) {
            throw new RuntimeException('Unable to fetch a Google Ads access token.');
        }

        return $this->accessToken = $payload['access_token'];
    }

    private function customerId(mixed $customerId): string
    {
        $customerId = is_string($customerId) || is_int($customerId)
            ? (string) $customerId
            : config('services.google_ads.customer_id');

        if (! is_string($customerId) || trim($customerId) === '') {
            throw new RuntimeException('Google Ads customer id is not configured.');
        }

        return preg_replace('/\D+/', '', $customerId) ?: throw new RuntimeException('Google Ads customer id is invalid.');
    }

    private function geoTarget(mixed $geoTargetConstant, mixed $country): string
    {
        if (is_string($geoTargetConstant) && trim($geoTargetConstant) !== '') {
            return trim($geoTargetConstant);
        }

        $country = strtoupper(is_string($country) && trim($country) !== '' ? trim($country) : 'MX');

        return self::GEO_TARGETS[$country] ?? throw new RuntimeException("Unsupported Google Ads country code [{$country}]. Provide geo_target_constant instead.");
    }

    private function language(mixed $languageConstant, mixed $language): string
    {
        if (is_string($languageConstant) && trim($languageConstant) !== '') {
            return trim($languageConstant);
        }

        $language = strtolower(is_string($language) && trim($language) !== '' ? trim($language) : 'es');

        return self::LANGUAGES[$language] ?? throw new RuntimeException("Unsupported Google Ads language code [{$language}]. Provide language_constant instead.");
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return list<string>
     */
    private function keywords(array $arguments): array
    {
        $keywords = collect($arguments['keywords'] ?? [])
            ->when(is_string($arguments['query'] ?? null), fn ($collection) => $collection->prepend($arguments['query']))
            ->filter(fn (mixed $keyword): bool => is_string($keyword) && trim($keyword) !== '')
            ->map(fn (string $keyword): string => trim($keyword))
            ->unique()
            ->take(20)
            ->values()
            ->all();

        if ($keywords === []) {
            throw new RuntimeException('At least one query or keyword seed is required.');
        }

        return $keywords;
    }

    private function limit(mixed $limit): int
    {
        return max(1, min(1000, (int) ($limit ?: 100)));
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return list<array<string, mixed>>
     */
    private function rows(array $payload, int $limit): array
    {
        return collect($payload['results'] ?? [])
            ->take($limit)
            ->map(function (mixed $result): array {
                $result = is_array($result) ? $result : [];
                $metrics = is_array($result['keywordIdeaMetrics'] ?? null) ? $result['keywordIdeaMetrics'] : [];

                return [
                    'keyword' => $result['text'] ?? null,
                    'avg_monthly_searches' => isset($metrics['avgMonthlySearches']) ? (int) $metrics['avgMonthlySearches'] : null,
                    'competition' => $metrics['competition'] ?? null,
                    'competition_index' => isset($metrics['competitionIndex']) ? (int) $metrics['competitionIndex'] : null,
                    'low_top_of_page_bid_micros' => isset($metrics['lowTopOfPageBidMicros']) ? (int) $metrics['lowTopOfPageBidMicros'] : null,
                    'high_top_of_page_bid_micros' => isset($metrics['highTopOfPageBidMicros']) ? (int) $metrics['highTopOfPageBidMicros'] : null,
                    'monthly_search_volumes' => $metrics['monthlySearchVolumes'] ?? [],
                ];
            })
            ->values()
            ->all();
    }

    private function requiredConfig(string $key): string
    {
        $value = config($key);

        if (! is_string($value) || trim($value) === '') {
            throw new RuntimeException("Required config [{$key}] is missing.");
        }

        return $value;
    }
}
