<?php

use App\Ai\Tools\Keywords\GoogleSearchConsoleKeywordPerformance;
use App\Services\Seo\GoogleSearchConsoleService;
use Google\Service\SearchConsole\ApiDataRow;
use Google\Service\SearchConsole\SearchAnalyticsQueryRequest;
use Google\Service\SearchConsole\SearchAnalyticsQueryResponse;
use Laravel\Ai\Tools\Request;

it('runs keyword performance through the google search console service', function () {
    config([
        'services.google_search_console.site_url' => 'sc-domain:example.com',
        'services.google_search_console.credentials_json' => '{}',
        'services.google_search_console.credentials_path' => null,
    ]);

    $service = new class extends GoogleSearchConsoleService
    {
        public array $arguments = [];

        public function queryPerformance(array $arguments): array
        {
            $this->arguments = $arguments;

            return [
                'provider' => 'google_search_console',
                'rows' => [
                    [
                        'query' => 'aceite para masaje',
                        'page' => 'https://example.com/aceites',
                        'clicks' => 12,
                        'impressions' => 100,
                        'ctr' => 0.12,
                        'position' => 4.5,
                    ],
                ],
            ];
        }
    };

    $tool = new GoogleSearchConsoleKeywordPerformance($service);
    $result = json_decode((string) $tool->handle(new Request([
        'query' => 'aceite para masaje',
        'date_range' => '2026-01-01:2026-01-31',
        'limit' => 25,
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($service->arguments['query'])->toBe('aceite para masaje')
        ->and($service->arguments['date_range'])->toBe('2026-01-01:2026-01-31')
        ->and($result['provider'])->toBe('google_search_console')
        ->and($result['rows'][0]['clicks'])->toBe(12);
});

it('reports missing google search console credentials after the site url is configured', function () {
    config([
        'services.google_search_console.site_url' => 'sc-domain:example.com',
        'services.google_search_console.credentials_json' => null,
        'services.google_search_console.credentials_path' => null,
    ]);

    $payload = json_decode((string) app(GoogleSearchConsoleKeywordPerformance::class)->handle(new Request([
        'query' => 'aceite para masaje',
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload)
        ->toMatchArray([
            'error' => true,
            'provider' => 'google_search_console',
            'required_config' => [
                'services.google_search_console.credentials_path',
                'services.google_search_console.credentials_json',
            ],
        ]);
});

it('normalizes google search console performance responses', function () {
    config([
        'services.google_search_console.site_url' => 'sc-domain:example.com',
    ]);

    $service = new class extends GoogleSearchConsoleService
    {
        public string $siteUrl;

        public SearchAnalyticsQueryRequest $request;

        protected function performQuery(string $siteUrl, SearchAnalyticsQueryRequest $request): SearchAnalyticsQueryResponse
        {
            $this->siteUrl = $siteUrl;
            $this->request = $request;

            return new SearchAnalyticsQueryResponse([
                'rows' => [
                    new ApiDataRow([
                        'keys' => ['aceite para masaje', 'https://example.com/aceites'],
                        'clicks' => 10,
                        'impressions' => 200,
                        'ctr' => 0.05,
                        'position' => 3.2,
                    ]),
                ],
            ]);
        }
    };

    $result = $service->queryPerformance([
        'query' => 'aceite',
        'dimensions' => ['query', 'page'],
        'date_range' => '2026-01-01:2026-01-31',
        'limit' => 50,
    ]);

    expect($service->siteUrl)->toBe('sc-domain:example.com')
        ->and($service->request->getStartDate())->toBe('2026-01-01')
        ->and($service->request->getEndDate())->toBe('2026-01-31')
        ->and($service->request->getRowLimit())->toBe(50)
        ->and($result['rows'][0])->toMatchArray([
            'query' => 'aceite para masaje',
            'page' => 'https://example.com/aceites',
            'clicks' => 10,
            'impressions' => 200,
            'ctr' => 0.05,
            'position' => 3.2,
        ]);
});
