<?php

namespace App\Services\Seo;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

class SerpApiSearchInsightsService
{
    /**
     * @var array<string, string>
     */
    private const GOOGLE_DOMAINS = [
        'MX' => 'google.com.mx',
        'US' => 'google.com',
        'ES' => 'google.es',
        'AR' => 'google.com.ar',
        'CO' => 'google.com.co',
        'CL' => 'google.cl',
        'PE' => 'google.com.pe',
    ];

    /**
     * @var array<string, string>
     */
    private const LOCATIONS = [
        'MX' => 'Mexico',
        'US' => 'United States',
        'ES' => 'Spain',
        'AR' => 'Argentina',
        'CO' => 'Colombia',
        'CL' => 'Chile',
        'PE' => 'Peru',
    ];

    public function __construct(private ?string $apiKey = null, private ?string $baseUrl = null) {}

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function searchInsights(array $arguments): array
    {
        try {
            $query = $this->query($arguments);
            $country = strtoupper((string) ($arguments['country'] ?? 'MX'));
            $language = $this->language($arguments['language'] ?? null);
            $limit = $this->limit($arguments['limit'] ?? null);

            $response = $this->request()->get('search.json', array_filter([
                'engine' => 'google',
                'q' => $query,
                'google_domain' => $this->googleDomain($arguments['google_domain'] ?? null, $country),
                'gl' => strtolower($country),
                'hl' => $language,
                'location' => $this->location($arguments['location'] ?? null, $country),
                'device' => $this->device($arguments['device'] ?? null),
                'safe' => $this->safe($arguments['safe'] ?? null),
                'num' => $limit,
                'start' => $this->start($arguments['start'] ?? null),
            ], fn (mixed $value): bool => $value !== null && $value !== ''));

            $payload = $response->json();

            if (! is_array($payload)) {
                return [
                    'error' => true,
                    'provider' => 'serpapi',
                    'status' => $response->status(),
                    'message' => 'SerpApi returned a non-JSON response.',
                ];
            }

            if ($response->failed()) {
                return [
                    'error' => true,
                    'provider' => 'serpapi',
                    'status' => $response->status(),
                    'response' => $payload,
                ];
            }

            $organicResults = $this->organicResults($payload, $limit);
            $peopleAlsoAsk = $this->peopleAlsoAsk($payload);
            $relatedSearches = $this->relatedSearches($payload);

            return [
                'provider' => 'serpapi',
                'query' => $query,
                'country' => $country,
                'language' => $language,
                'location' => $payload['search_parameters']['location_used'] ?? $payload['search_parameters']['location_requested'] ?? null,
                'search_information' => $this->searchInformation($payload),
                'serp_features' => $this->serpFeatures($payload),
                'intent_analysis' => $this->intentAnalysis($query, $organicResults, $peopleAlsoAsk, $relatedSearches, $payload),
                'organic_results' => $organicResults,
                'organic_competitors' => $this->organicCompetitors($organicResults),
                'people_also_ask' => $peopleAlsoAsk,
                'related_searches' => $relatedSearches,
            ];
        } catch (Throwable $exception) {
            return [
                'error' => true,
                'provider' => 'serpapi',
                'message' => $exception->getMessage(),
                'exception' => $exception::class,
            ];
        }
    }

    private function request(): PendingRequest
    {
        return Http::baseUrl($this->baseUrl())
            ->withQueryParameters([
                'api_key' => $this->apiKey(),
            ])
            ->acceptJson()
            ->timeout(20);
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    private function query(array $arguments): string
    {
        if (is_string($arguments['query'] ?? null) && trim($arguments['query']) !== '') {
            return trim($arguments['query']);
        }

        $keyword = collect($arguments['keywords'] ?? [])
            ->first(fn (mixed $keyword): bool => is_string($keyword) && trim($keyword) !== '');

        if (is_string($keyword)) {
            return trim($keyword);
        }

        throw new RuntimeException('At least one query or keyword seed is required.');
    }

    private function googleDomain(mixed $googleDomain, string $country): string
    {
        if (is_string($googleDomain) && trim($googleDomain) !== '') {
            return trim($googleDomain);
        }

        return self::GOOGLE_DOMAINS[$country] ?? 'google.com';
    }

    private function location(mixed $location, string $country): string
    {
        if (is_string($location) && trim($location) !== '') {
            return trim($location);
        }

        return self::LOCATIONS[$country] ?? self::LOCATIONS['MX'];
    }

    private function language(mixed $language): string
    {
        if (is_string($language) && trim($language) !== '') {
            return strtolower(trim($language));
        }

        return 'es';
    }

    private function device(mixed $device): string
    {
        if (! is_string($device)) {
            return 'desktop';
        }

        $device = strtolower(trim($device));

        return in_array($device, ['desktop', 'mobile', 'tablet'], true) ? $device : 'desktop';
    }

    private function safe(mixed $safe): ?string
    {
        if (! is_string($safe)) {
            return null;
        }

        $safe = strtolower(trim($safe));

        return in_array($safe, ['active', 'off'], true) ? $safe : null;
    }

    private function limit(mixed $limit): int
    {
        return max(1, min(100, (int) ($limit ?: 10)));
    }

    private function start(mixed $start): int
    {
        return max(0, (int) ($start ?: 0));
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function searchInformation(array $payload): array
    {
        $information = is_array($payload['search_information'] ?? null) ? $payload['search_information'] : [];

        return [
            'total_results' => $this->intOrNull($information['total_results'] ?? null),
            'time_taken_displayed' => $information['time_taken_displayed'] ?? null,
            'organic_results_state' => $information['organic_results_state'] ?? null,
        ];
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return list<string>
     */
    private function serpFeatures(array $payload): array
    {
        $features = [];

        foreach ([
            'answer_box' => 'answer_box',
            'knowledge_graph' => 'knowledge_graph',
            'local_results' => 'local_pack',
            'shopping_results' => 'shopping_results',
            'inline_shopping_results' => 'shopping_results',
            'related_questions' => 'people_also_ask',
            'related_searches' => 'related_searches',
            'top_stories' => 'top_stories',
            'images_results' => 'image_pack',
            'video_results' => 'video_results',
        ] as $payloadKey => $feature) {
            if (! empty($payload[$payloadKey])) {
                $features[] = $feature;
            }
        }

        return array_values(array_unique($features));
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return list<array<string, mixed>>
     */
    private function organicResults(array $payload, int $limit): array
    {
        return collect($payload['organic_results'] ?? [])
            ->take($limit)
            ->map(function (mixed $result): array {
                $result = is_array($result) ? $result : [];
                $link = is_string($result['link'] ?? null) ? $result['link'] : null;

                return [
                    'position' => $this->intOrNull($result['position'] ?? null),
                    'title' => $result['title'] ?? null,
                    'link' => $link,
                    'domain' => $this->domain($link),
                    'displayed_link' => $result['displayed_link'] ?? null,
                    'snippet' => $result['snippet'] ?? null,
                    'source' => $result['source'] ?? null,
                    'rich_snippet' => $result['rich_snippet'] ?? null,
                    'sitelinks' => $result['sitelinks'] ?? null,
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @param  list<array<string, mixed>>  $organicResults
     * @return list<array{domain: string, top_position: int|null, result_count: int}>
     */
    private function organicCompetitors(array $organicResults): array
    {
        return collect($organicResults)
            ->filter(fn (array $result): bool => is_string($result['domain'] ?? null) && $result['domain'] !== '')
            ->groupBy('domain')
            ->map(fn ($results, string $domain): array => [
                'domain' => $domain,
                'top_position' => $results->min('position'),
                'result_count' => $results->count(),
            ])
            ->sortBy('top_position')
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return list<array<string, mixed>>
     */
    private function peopleAlsoAsk(array $payload): array
    {
        return collect($payload['related_questions'] ?? [])
            ->map(function (mixed $question): array {
                $question = is_array($question) ? $question : [];

                return [
                    'question' => $question['question'] ?? null,
                    'snippet' => $question['snippet'] ?? null,
                    'title' => $question['title'] ?? null,
                    'link' => $question['link'] ?? null,
                ];
            })
            ->filter(fn (array $question): bool => is_string($question['question'] ?? null) && $question['question'] !== '')
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return list<array{text: string|null, link: string|null}>
     */
    private function relatedSearches(array $payload): array
    {
        return collect($payload['related_searches'] ?? [])
            ->map(function (mixed $search): array {
                $search = is_array($search) ? $search : [];

                return [
                    'text' => $search['query'] ?? $search['text'] ?? null,
                    'link' => $search['link'] ?? null,
                ];
            })
            ->filter(fn (array $search): bool => is_string($search['text'] ?? null) && $search['text'] !== '')
            ->values()
            ->all();
    }

    /**
     * @param  list<array<string, mixed>>  $organicResults
     * @param  list<array<string, mixed>>  $peopleAlsoAsk
     * @param  list<array<string, mixed>>  $relatedSearches
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function intentAnalysis(string $query, array $organicResults, array $peopleAlsoAsk, array $relatedSearches, array $payload): array
    {
        $text = strtolower(implode(' ', array_filter([
            $query,
            ...array_column($organicResults, 'title'),
            ...array_column($organicResults, 'snippet'),
            ...array_column($peopleAlsoAsk, 'question'),
            ...array_column($relatedSearches, 'text'),
        ], fn (mixed $value): bool => is_string($value))));

        $scores = [
            'transactional' => $this->keywordScore($text, ['comprar', 'precio', 'precios', 'venta', 'mayoreo', 'proveedor', 'cotizar', 'tienda', 'envio', 'envío']) + (! empty($payload['shopping_results']) || ! empty($payload['inline_shopping_results']) ? 2 : 0),
            'commercial_investigation' => $this->keywordScore($text, ['mejor', 'mejores', 'comparativa', 'comparar', 'review', 'opiniones', 'marca', 'marcas']),
            'informational' => $this->keywordScore($text, ['como', 'cómo', 'que es', 'qué es', 'para que sirve', 'beneficios', 'guia', 'guía']) + count($peopleAlsoAsk),
            'local' => (! empty($payload['local_results']) ? 3 : 0) + $this->keywordScore($text, ['cerca', 'ubicacion', 'ubicación', 'mexico', 'méxico', 'guadalajara', 'monterrey', 'cdmx']),
            'branded' => $this->keywordScore($text, ['ikonoverde', 'ikono verde']),
        ];

        arsort($scores);

        return [
            'primary_intent' => array_key_first($scores),
            'scores' => $scores,
            'signals' => [
                'organic_result_count' => count($organicResults),
                'people_also_ask_count' => count($peopleAlsoAsk),
                'related_search_count' => count($relatedSearches),
                'has_shopping_results' => ! empty($payload['shopping_results']) || ! empty($payload['inline_shopping_results']),
                'has_local_results' => ! empty($payload['local_results']),
            ],
        ];
    }

    /**
     * @param  list<string>  $needles
     */
    private function keywordScore(string $text, array $needles): int
    {
        return collect($needles)
            ->filter(fn (string $needle): bool => str_contains($text, $needle))
            ->count();
    }

    private function apiKey(): string
    {
        if (is_string($this->apiKey) && trim($this->apiKey) !== '') {
            return trim($this->apiKey);
        }

        $value = config('services.serpapi.api_key');

        if (! is_string($value) || trim($value) === '') {
            throw new RuntimeException('SerpApi API key is not configured.');
        }

        return trim($value);
    }

    private function baseUrl(): string
    {
        return rtrim($this->baseUrl ?? config('services.serpapi.base_url', 'https://serpapi.com'), '/');
    }

    private function domain(?string $url): ?string
    {
        if ($url === null || trim($url) === '') {
            return null;
        }

        $host = parse_url($url, PHP_URL_HOST);

        if (! is_string($host) || $host === '') {
            return null;
        }

        return preg_replace('/^www\./', '', strtolower($host));
    }

    private function intOrNull(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) $value;
    }
}
