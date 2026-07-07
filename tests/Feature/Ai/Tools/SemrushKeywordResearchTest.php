<?php

use App\Ai\Tools\Keywords\SemrushKeywordResearch;
use App\Services\Seo\SemrushKeywordResearchService;
use Illuminate\Http\Client\Request as HttpRequest;
use Illuminate\Support\Facades\Http;
use Laravel\Ai\Tools\Request;

it('runs semrush keyword research through the service', function () {
    config(['services.semrush.api_key' => 'semrush-key']);

    $service = new class extends SemrushKeywordResearchService
    {
        public array $arguments = [];

        public function research(array $arguments): array
        {
            $this->arguments = $arguments;

            return [
                'provider' => 'semrush',
                'database' => 'mx',
                'country' => 'MX',
                'keyword_metrics' => [
                    [
                        'keyword' => 'aceite para masaje',
                        'search_volume' => 2400,
                        'cpc' => 12.45,
                    ],
                ],
            ];
        }
    };

    $tool = new SemrushKeywordResearch($service);
    $result = json_decode((string) $tool->handle(new Request([
        'query' => 'aceite para masaje',
        'country' => 'MX',
        'language' => 'es',
        'limit' => 25,
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($service->arguments['query'])->toBe('aceite para masaje')
        ->and($service->arguments['country'])->toBe('MX')
        ->and($service->arguments['language'])->toBe('es')
        ->and($service->arguments['limit'])->toBe(25)
        ->and($result['provider'])->toBe('semrush')
        ->and($result['database'])->toBe('mx')
        ->and($result['keyword_metrics'][0]['search_volume'])->toBe(2400);
});

it('reports missing semrush api key', function () {
    config(['services.semrush.api_key' => null]);

    $payload = json_decode((string) app(SemrushKeywordResearch::class)->handle(new Request([
        'query' => 'aceite de masaje profesional',
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload)
        ->toMatchArray([
            'error' => true,
            'provider' => 'semrush',
            'required_config' => ['services.semrush.api_key'],
        ])
        ->and($payload['message'])->toContain('API is not configured')
        ->and($payload['received_arguments']['query'])->toBe('aceite de masaje profesional');
});

it('normalizes semrush keyword metrics and organic rankings responses', function () {
    config([
        'services.semrush.api_key' => 'semrush-key',
        'services.semrush.base_url' => 'https://api.semrush.com',
    ]);

    Http::fake([
        'api.semrush.com/apis/v4/keywords/v1/metrics*' => Http::response([
            'meta' => [
                'country' => 'MX',
                'keyword' => 'aceite para masaje',
                'month' => '2026-01',
                'request_id' => 'req-123',
                'status_code' => 200,
                'success' => true,
            ],
            'data' => [
                'competitive_density' => 58,
                'cpc' => '1245',
                'intents' => ['COMMERCIAL', 'INFORMATIONAL'],
                'keyword_difficulty' => 74,
                'number_of_results' => '1850000',
                'search_volume' => '2400',
                'serp_features' => ['SITELINKS', 'PEOPLE_ALSO_ASK'],
                'trends' => [82, 78, 85, 90, 88, 92, 95, 100, 96, 91, 87, 84],
            ],
        ], 200),
        'api.semrush.com/?*type=domain_organic*' => Http::response(
            "Keyword;Position;Previous Position;Position Difference;Search Volume;CPC;Url;Traffic (%);Traffic Cost (%);Competition;Number of Results;Trends\n".
            'aceite para masaje;5;7;2;2400;12.45;https://example.com/aceites;3.42;12.34;0.58;1850000;0.82,0.85,0.91,1.00',
            200,
            ['Content-Type' => 'text/csv'],
        ),
    ]);

    $result = app(SemrushKeywordResearchService::class)->research([
        'query' => 'aceite para masaje',
        'domain' => 'https://example.com',
        'country' => 'MX',
        'limit' => 10,
    ]);

    Http::assertSent(function (HttpRequest $request): bool {
        if (str_contains($request->url(), '/apis/v4/keywords/v1/metrics')) {
            return $request->hasHeader('Authorization', 'Apikey semrush-key')
                && $request['keyword'] === 'aceite para masaje'
                && $request['country'] === 'MX'
                && $request['month'] === now()->format('Y-m');
        }

        if (str_contains($request->url(), 'type=domain_organic')) {
            parse_str((string) parse_url($request->url(), PHP_URL_QUERY), $query);

            return $request->method() === 'GET'
                && $query['type'] === 'domain_organic'
                && $query['key'] === 'semrush-key'
                && $query['domain'] === 'example.com'
                && $query['database'] === 'mx'
                && $query['export_columns'] === 'Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr,Td'
                && $query['display_limit'] === '10';
        }

        return false;
    });

    expect($result)
        ->toMatchArray([
            'provider' => 'semrush',
            'database' => 'mx',
            'country' => 'MX',
        ])
        ->and($result['seed']['query'])->toBe('aceite para masaje')
        ->and($result['keyword_metrics'][0])->toMatchArray([
            'keyword' => 'aceite para masaje',
            'country' => 'MX',
            'search_volume' => 2400,
            'cpc' => 1245.0,
            'competitive_density' => 58,
            'keyword_difficulty' => 74,
            'number_of_results' => 1850000,
            'intents' => ['COMMERCIAL', 'INFORMATIONAL'],
            'serp_features' => ['SITELINKS', 'PEOPLE_ALSO_ASK'],
        ])
        ->and($result['keyword_metrics'][0]['trends'])->toBe([82.0, 78.0, 85.0, 90.0, 88.0, 92.0, 95.0, 100.0, 96.0, 91.0, 87.0, 84.0])
        ->and($result['domain_research'][0]['domain'])->toBe('example.com')
        ->and($result['domain_research'][0]['rows'][0])->toMatchArray([
            'keyword' => 'aceite para masaje',
            'position' => 5,
            'previous_position' => 7,
            'position_difference' => 2,
            'search_volume' => 2400,
            'cpc' => 12.45,
            'url' => 'https://example.com/aceites',
            'traffic_percent' => 3.42,
            'traffic_cost_percent' => 12.34,
            'competition' => 0.58,
            'number_of_results' => 1850000,
            'trends' => [0.82, 0.85, 0.91, 1.0],
        ]);
});
