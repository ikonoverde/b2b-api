<?php

namespace App\Services\Seo;

use App\Services\Keywords\ProviderConfig;
use Google\Client;
use Google\Service\SearchConsole;
use Google\Service\SearchConsole\ApiDataRow;
use Google\Service\SearchConsole\ApiDimensionFilter;
use Google\Service\SearchConsole\ApiDimensionFilterGroup;
use Google\Service\SearchConsole\SearchAnalyticsQueryRequest;
use Google\Service\SearchConsole\SearchAnalyticsQueryResponse;
use Illuminate\Support\Carbon;
use RuntimeException;
use Throwable;

class GoogleSearchConsoleService
{
    private ?SearchConsole $searchConsole = null;

    /**
     * @param  array<string, mixed>|null  $credentials
     */
    public function __construct(private ?array $credentials = null) {}

    /**
     * Config keys Search Console requires before the site URL can be queried.
     *
     * @return list<string>
     */
    public function requiredConfig(): array
    {
        return ['services.google_search_console.site_url'];
    }

    /**
     * Credentials may arrive as a file path or inline JSON, so either one satisfies the requirement.
     *
     * @return list<string>
     */
    public function missingConfig(): array
    {
        $missingSiteUrl = ProviderConfig::missing($this->requiredConfig());

        if ($missingSiteUrl !== []) {
            return $missingSiteUrl;
        }

        return ProviderConfig::missingUnlessAnyPresent([
            'services.google_search_console.credentials_path',
            'services.google_search_console.credentials_json',
        ]);
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function queryPerformance(array $arguments): array
    {
        try {
            [$startDate, $endDate] = $this->dateRange($arguments['date_range'] ?? null);
            $dimensions = $this->dimensions($arguments['dimensions'] ?? null);
            $request = new SearchAnalyticsQueryRequest([
                'startDate' => $startDate,
                'endDate' => $endDate,
                'dimensions' => $dimensions,
                'rowLimit' => $this->limit($arguments['limit'] ?? null),
                'startRow' => $this->offset($arguments['offset'] ?? null),
                'searchType' => strtoupper((string) ($arguments['search_type'] ?? 'web')),
            ]);

            $filters = $this->filters($arguments);

            if ($filters !== []) {
                $request->setDimensionFilterGroups([
                    new ApiDimensionFilterGroup([
                        'groupType' => ApiDimensionFilterGroup::GROUP_TYPE_AND,
                        'filters' => $filters,
                    ]),
                ]);
            }

            $siteUrl = $this->siteUrl($arguments['site_url'] ?? null);
            $response = $this->performQuery($siteUrl, $request);

            return [
                'provider' => 'google_search_console',
                'site_url' => $siteUrl,
                'date_range' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ],
                'dimensions' => $dimensions,
                'rows' => $this->rows($response, $dimensions),
            ];
        } catch (Throwable $exception) {
            return [
                'error' => true,
                'provider' => 'google_search_console',
                'message' => $exception->getMessage(),
                'exception' => $exception::class,
            ];
        }
    }

    protected function performQuery(string $siteUrl, SearchAnalyticsQueryRequest $request): SearchAnalyticsQueryResponse
    {
        return $this->searchConsole()->searchanalytics->query($siteUrl, $request);
    }

    private function searchConsole(): SearchConsole
    {
        return $this->searchConsole ??= new SearchConsole($this->client());
    }

    private function client(): Client
    {
        $client = new Client;
        $client->setApplicationName((string) config('app.name', 'Laravel'));
        $client->setAuthConfig($this->credentials());
        $client->addScope(SearchConsole::WEBMASTERS_READONLY);

        return $client;
    }

    /**
     * @return array<string, mixed>
     */
    private function credentials(): array
    {
        if ($this->credentials !== null) {
            return $this->credentials;
        }

        $credentialsJson = config('services.google_search_console.credentials_json');

        if (is_string($credentialsJson) && trim($credentialsJson) !== '') {
            $decoded = json_decode($credentialsJson, true);

            if (is_array($decoded)) {
                return $this->credentials = $decoded;
            }
        }

        $credentialsPath = config('services.google_search_console.credentials_path');

        if (is_string($credentialsPath) && is_file($credentialsPath)) {
            $decoded = json_decode((string) file_get_contents($credentialsPath), true);

            if (is_array($decoded)) {
                return $this->credentials = $decoded;
            }
        }

        throw new RuntimeException('Google Search Console service-account credentials are not configured.');
    }

    private function siteUrl(mixed $siteUrl): string
    {
        $siteUrl = is_string($siteUrl) ? $siteUrl : config('services.google_search_console.site_url');

        if (! is_string($siteUrl) || trim($siteUrl) === '') {
            throw new RuntimeException('Google Search Console site URL is not configured.');
        }

        return trim($siteUrl);
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function dateRange(mixed $dateRange): array
    {
        if (is_string($dateRange) && preg_match('/^(\d{4}-\d{2}-\d{2}):(\d{4}-\d{2}-\d{2})$/', $dateRange, $matches) === 1) {
            return [$matches[1], $matches[2]];
        }

        $endDate = Carbon::now()->subDay()->toDateString();

        return match ($dateRange) {
            'last_7_days' => [Carbon::now()->subDays(7)->toDateString(), $endDate],
            'last_3_months' => [Carbon::now()->subMonths(3)->toDateString(), $endDate],
            'last_6_months' => [Carbon::now()->subMonths(6)->toDateString(), $endDate],
            default => [Carbon::now()->subDays(28)->toDateString(), $endDate],
        };
    }

    /**
     * @return list<string>
     */
    private function dimensions(mixed $dimensions): array
    {
        $allowedDimensions = ['query', 'page', 'country', 'device', 'searchAppearance', 'date'];
        $dimensions = is_array($dimensions) ? $dimensions : ['query', 'page'];

        $dimensions = collect($dimensions)
            ->filter(fn (mixed $dimension): bool => is_string($dimension))
            ->map(fn (string $dimension): string => trim($dimension))
            ->intersect($allowedDimensions)
            ->values()
            ->all();

        return $dimensions === [] ? ['query', 'page'] : $dimensions;
    }

    private function limit(mixed $limit): int
    {
        return max(1, min(25000, (int) ($limit ?: 1000)));
    }

    private function offset(mixed $offset): int
    {
        return max(0, (int) ($offset ?: 0));
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return list<ApiDimensionFilter>
     */
    private function filters(array $arguments): array
    {
        $filters = [];

        if (is_string($arguments['query'] ?? null) && trim($arguments['query']) !== '') {
            $filters[] = new ApiDimensionFilter([
                'dimension' => ApiDimensionFilter::DIMENSION_QUERY,
                'operator' => ApiDimensionFilter::OPERATOR_CONTAINS,
                'expression' => trim($arguments['query']),
            ]);
        }

        if (is_string($arguments['page'] ?? null) && trim($arguments['page']) !== '') {
            $filters[] = new ApiDimensionFilter([
                'dimension' => ApiDimensionFilter::DIMENSION_PAGE,
                'operator' => ApiDimensionFilter::OPERATOR_CONTAINS,
                'expression' => trim($arguments['page']),
            ]);
        }

        return $filters;
    }

    /**
     * @param  list<string>  $dimensions
     * @return list<array<string, mixed>>
     */
    private function rows(SearchAnalyticsQueryResponse $response, array $dimensions): array
    {
        return collect($response->getRows() ?? [])
            ->map(function (ApiDataRow $row) use ($dimensions): array {
                $dimensionValues = [];

                foreach ($dimensions as $index => $dimension) {
                    $dimensionValues[$dimension] = ($row->getKeys() ?? [])[$index] ?? null;
                }

                return [
                    ...$dimensionValues,
                    'clicks' => $row->getClicks(),
                    'impressions' => $row->getImpressions(),
                    'ctr' => $row->getCtr(),
                    'position' => $row->getPosition(),
                ];
            })
            ->values()
            ->all();
    }
}
