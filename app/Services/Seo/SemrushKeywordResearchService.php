<?php

namespace App\Services\Seo;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

class SemrushKeywordResearchService
{
    /**
     * @var array<string, string>
     */
    private const COUNTRY_DATABASES = [
        'MX' => 'mx',
        'US' => 'us',
        'ES' => 'es',
        'AR' => 'ar',
        'CO' => 'co',
        'CL' => 'cl',
        'PE' => 'pe',
        'UK' => 'uk',
        'BR' => 'br',
    ];

    private ?string $apiKey = null;

    private ?string $baseUrl = null;

    public function __construct(?string $apiKey = null, ?string $baseUrl = null)
    {
        $this->apiKey = $apiKey;
        $this->baseUrl = $baseUrl;
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function research(array $arguments): array
    {
        try {
            $database = $this->database($arguments['database'] ?? null, $arguments['country'] ?? null);
            $country = strtoupper((string) ($arguments['country'] ?? 'MX'));
            $month = $this->month($arguments['month'] ?? null);
            $limit = $this->limit($arguments['limit'] ?? null);
            $offset = $this->offset($arguments['offset'] ?? null);
            $sort = $this->sort($arguments['display_sort'] ?? null);

            $keywords = $this->keywords($arguments);

            $payload = [
                'provider' => 'semrush',
                'database' => $database,
                'country' => $country,
                'month' => $month,
                'seed' => [
                    'query' => is_string($arguments['query'] ?? null) ? trim($arguments['query']) : null,
                    'keywords' => $keywords,
                ],
            ];

            $keywordMetrics = $this->keywordMetrics($keywords, $country, $month, $limit);

            if ($keywordMetrics !== []) {
                $payload['keyword_metrics'] = $keywordMetrics;
            }

            $domain = $this->domain($arguments['domain'] ?? null);
            $competitors = $this->competitors($arguments['competitors'] ?? null, $domain !== null ? 0 : 1);

            $domainsToResearch = array_values(array_filter(array_merge($domain !== null ? [$domain] : [], $competitors)));

            if ($domainsToResearch !== []) {
                $payload['domain_research'] = $this->domainResearch(
                    $domainsToResearch,
                    $database,
                    $limit,
                    $offset,
                    $sort,
                );
            }

            return $payload;
        } catch (Throwable $exception) {
            return [
                'error' => true,
                'provider' => 'semrush',
                'message' => $exception->getMessage(),
                'exception' => $exception::class,
            ];
        }
    }

    /**
     * @param  list<string>  $keywords
     * @return list<array<string, mixed>>
     */
    private function keywordMetrics(array $keywords, string $country, string $month, int $limit): array
    {
        if ($keywords === []) {
            return [];
        }

        $endpoint = $this->request()->acceptJson();

        $rows = [];

        foreach (array_slice($keywords, 0, $limit) as $keyword) {
            $response = $endpoint->get('apis/v4/keywords/v1/metrics', [
                'keyword' => $keyword,
                'country' => $country,
                'month' => $month,
            ]);

            $body = $response->json();

            if (! is_array($body)) {
                continue;
            }

            if ($response->failed()) {
                $rows[] = [
                    'keyword' => $keyword,
                    'error' => true,
                    'status' => $response->status(),
                    'response' => $body,
                ];

                continue;
            }

            $rows[] = $this->keywordMetricRow($keyword, $body);
        }

        return $rows;
    }

    /**
     * @param  list<string>  $domains
     * @return list<array<string, mixed>>
     */
    private function domainResearch(array $domains, string $database, int $limit, int $offset, ?string $sort): array
    {
        $rows = [];

        foreach ($domains as $domain) {
            $response = $this->legacyRequest()->get('', array_filter([
                'type' => 'domain_organic',
                'domain' => $domain,
                'database' => $database,
                'export_columns' => 'Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr,Td',
                'display_limit' => $limit,
                'display_offset' => $offset,
                'display_sort' => $sort,
            ], fn (mixed $value): bool => $value !== null && $value !== ''));

            $body = $response->body();

            if ($response->failed()) {
                $rows[] = [
                    'domain' => $domain,
                    'database' => $database,
                    'error' => true,
                    'status' => $response->status(),
                    'response' => $body,
                ];

                continue;
            }

            $rows[] = [
                'domain' => $domain,
                'database' => $database,
                'rows' => $this->domainRows($body),
            ];
        }

        return $rows;
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function keywordMetricRow(string $keyword, array $payload): array
    {
        $meta = is_array($payload['meta'] ?? null) ? $payload['meta'] : [];
        $data = is_array($payload['data'] ?? null) ? $payload['data'] : [];

        return [
            'keyword' => $meta['keyword'] ?? $keyword,
            'country' => $meta['country'] ?? null,
            'month' => $meta['month'] ?? null,
            'request_id' => $meta['request_id'] ?? null,
            'search_volume' => $this->intOrNull($data['search_volume'] ?? null),
            'cpc' => $this->floatOrNull($data['cpc'] ?? null),
            'competitive_density' => $this->intOrNull($data['competitive_density'] ?? null),
            'keyword_difficulty' => $this->intOrNull($data['keyword_difficulty'] ?? null),
            'number_of_results' => $this->intOrNull($data['number_of_results'] ?? null),
            'intents' => $this->stringList($data['intents'] ?? null),
            'serp_features' => $this->stringList($data['serp_features'] ?? null),
            'trends' => $this->floatList($data['trends'] ?? null),
        ];
    }

    /**
     * @return list<array<string, mixed|null>>
     */
    private function domainRows(string $body): array
    {
        $lines = preg_split('/\r?\n/', trim($body)) ?: [];

        if ($lines === [] || count($lines) < 2) {
            return [];
        }

        $headers = str_getcsv((string) array_shift($lines), ';');
        $headers = array_map(fn (string $header): string => trim($header), $headers);

        $columnMap = [
            'Ph' => 'keyword',
            'Keyword' => 'keyword',
            'Po' => 'position',
            'Position' => 'position',
            'Pp' => 'previous_position',
            'Previous Position' => 'previous_position',
            'Pd' => 'position_difference',
            'Position Difference' => 'position_difference',
            'Nq' => 'search_volume',
            'Search Volume' => 'search_volume',
            'Cp' => 'cpc',
            'CPC' => 'cpc',
            'Ur' => 'url',
            'Url' => 'url',
            'Tr' => 'traffic_percent',
            'Traffic (%)' => 'traffic_percent',
            'Tc' => 'traffic_cost_percent',
            'Traffic Cost (%)' => 'traffic_cost_percent',
            'Co' => 'competition',
            'Competition' => 'competition',
            'Nr' => 'number_of_results',
            'Number of Results' => 'number_of_results',
            'Td' => 'trends',
            'Trends' => 'trends',
        ];

        $rows = [];

        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '') {
                continue;
            }

            $values = str_getcsv($line, ';');

            if (count($values) !== count($headers)) {
                continue;
            }

            $row = [];

            foreach ($headers as $index => $header) {
                $value = $values[$index] ?? null;
                $key = $columnMap[$header] ?? strtolower($header);

                $row[$key] = match ($key) {
                    'position', 'previous_position', 'position_difference', 'search_volume', 'number_of_results' => $this->intOrNull($value),
                    'cpc', 'competition', 'traffic_percent', 'traffic_cost_percent' => $this->floatOrNull($value),
                    'trends' => $this->floatList($value),
                    default => is_string($value) ? trim($value) : $value,
                };
            }

            $rows[] = $row;
        }

        return $rows;
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

        return array_values(array_map('strval', $keywords));
    }

    private function database(mixed $database, mixed $country): string
    {
        if (is_string($database) && trim($database) !== '') {
            return strtolower(trim($database));
        }

        $country = strtoupper(is_string($country) && trim($country) !== '' ? trim($country) : 'MX');

        return self::COUNTRY_DATABASES[$country] ?? throw new RuntimeException("Unsupported Semrush country code [{$country}]. Provide database instead.");
    }

    private function month(mixed $month): string
    {
        if (is_string($month) && preg_match('/^\d{4}-\d{2}$/', trim($month)) === 1) {
            return trim($month);
        }

        return Carbon::now()->format('Y-m');
    }

    private function limit(mixed $limit): int
    {
        return max(1, min(100, (int) ($limit ?: 10)));
    }

    private function offset(mixed $offset): int
    {
        return max(0, (int) ($offset ?: 0));
    }

    private function sort(mixed $sort): ?string
    {
        if (! is_string($sort)) {
            return null;
        }

        $sort = trim($sort);

        return $sort === '' ? null : $sort;
    }

    private function domain(mixed $domain): ?string
    {
        if (! is_string($domain)) {
            return null;
        }

        $domain = trim($domain);

        if ($domain === '') {
            return null;
        }

        $host = parse_url($domain, PHP_URL_HOST);

        if (is_string($host) && $host !== '') {
            return $host;
        }

        return trim(explode('/', $domain, 2)[0]);
    }

    /**
     * @return list<string>
     */
    private function competitors(mixed $competitors, int $preserve): array
    {
        if (! is_array($competitors)) {
            return [];
        }

        return collect($competitors)
            ->filter(fn (mixed $competitor): bool => is_string($competitor) && trim($competitor) !== '')
            ->map(fn (string $competitor): string => $this->domain($competitor) ?? '')
            ->filter(fn (string $competitor): bool => $competitor !== '')
            ->values()
            ->take(max(0, 5 - $preserve))
            ->all();
    }

    private function request(): PendingRequest
    {
        $key = $this->apiKey();

        return Http::baseUrl($this->baseUrl())
            ->withHeaders([
                'Authorization' => "Apikey {$key}",
            ])
            ->timeout(20);
    }

    private function legacyRequest(): PendingRequest
    {
        return $this->request()->withQueryParameters([
            'key' => $this->apiKey(),
        ]);
    }

    private function apiKey(): string
    {
        if (is_string($this->apiKey) && trim($this->apiKey) !== '') {
            return trim($this->apiKey);
        }

        $value = config('services.semrush.api_key');

        if (! is_string($value) || trim($value) === '') {
            throw new RuntimeException('Semrush API key is not configured.');
        }

        return trim($value);
    }

    private function baseUrl(): string
    {
        $baseUrl = $this->baseUrl ?? config('services.semrush.base_url', 'https://api.semrush.com');

        return rtrim($baseUrl, '/');
    }

    private function intOrNull(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) $value;
    }

    private function floatOrNull(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (float) $value;
    }

    /**
     * @return list<string>
     */
    private function stringList(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        return array_values(array_filter(array_map(
            fn (mixed $entry): string => is_string($entry) ? trim($entry) : '',
            $value,
        ), fn (string $entry): bool => $entry !== ''));
    }

    /**
     * @return list<float>
     */
    private function floatList(mixed $value): array
    {
        if (is_string($value)) {
            $value = explode(',', $value);
        }

        if (! is_array($value)) {
            return [];
        }

        return array_values(array_map(
            fn (mixed $entry): float => (float) $entry,
            $value,
        ));
    }
}
