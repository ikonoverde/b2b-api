<?php

use App\Ai\Tools\Keywords\GoogleAdsKeywordPlannerIdeas;
use App\Services\Ads\GoogleAdsKeywordPlannerService;
use Illuminate\Http\Client\Request as HttpRequest;
use Illuminate\Support\Facades\Http;
use Laravel\Ai\Tools\Request;

it('runs keyword ideas through the google ads keyword planner service', function () {
    config([
        'services.google_ads.developer_token' => 'developer-token',
        'services.google_ads.customer_id' => '123-456-7890',
        'services.google_ads.client_id' => 'client-id',
        'services.google_ads.client_secret' => 'client-secret',
        'services.google_ads.refresh_token' => 'refresh-token',
    ]);

    $service = new class extends GoogleAdsKeywordPlannerService
    {
        public array $arguments = [];

        public function keywordIdeas(array $arguments): array
        {
            $this->arguments = $arguments;

            return [
                'provider' => 'google_ads_keyword_planner',
                'rows' => [
                    [
                        'keyword' => 'aceite para masaje',
                        'avg_monthly_searches' => 2400,
                    ],
                ],
            ];
        }
    };

    $tool = new GoogleAdsKeywordPlannerIdeas($service);
    $result = json_decode((string) $tool->handle(new Request([
        'query' => 'aceite para masaje',
        'country' => 'MX',
        'language' => 'es',
        'limit' => 25,
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($service->arguments['query'])->toBe('aceite para masaje')
        ->and($service->arguments['country'])->toBe('MX')
        ->and($service->arguments['language'])->toBe('es')
        ->and($result['provider'])->toBe('google_ads_keyword_planner')
        ->and($result['rows'][0]['avg_monthly_searches'])->toBe(2400);
});

it('reports missing google ads oauth credentials', function () {
    config([
        'services.google_ads.developer_token' => 'developer-token',
        'services.google_ads.customer_id' => '1234567890',
        'services.google_ads.client_id' => null,
        'services.google_ads.client_secret' => null,
        'services.google_ads.refresh_token' => null,
    ]);

    $payload = json_decode((string) app(GoogleAdsKeywordPlannerIdeas::class)->handle(new Request([
        'query' => 'aceite para masaje',
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload)
        ->toMatchArray([
            'error' => true,
            'provider' => 'google_ads_keyword_planner',
            'required_config' => [
                'services.google_ads.client_id',
                'services.google_ads.client_secret',
                'services.google_ads.refresh_token',
            ],
        ]);
});

it('normalizes google ads keyword planner responses', function () {
    config([
        'services.google_ads.developer_token' => 'developer-token',
        'services.google_ads.customer_id' => '123-456-7890',
        'services.google_ads.login_customer_id' => '9998887777',
        'services.google_ads.client_id' => 'client-id',
        'services.google_ads.client_secret' => 'client-secret',
        'services.google_ads.refresh_token' => 'refresh-token',
    ]);

    Http::fake([
        'oauth2.googleapis.com/token' => Http::response(['access_token' => 'access-token'], 200),
        'googleads.googleapis.com/v22/customers/1234567890:generateKeywordIdeas' => Http::response([
            'results' => [
                [
                    'text' => 'aceite para masaje',
                    'keywordIdeaMetrics' => [
                        'avgMonthlySearches' => '2400',
                        'competition' => 'MEDIUM',
                        'competitionIndex' => '58',
                        'lowTopOfPageBidMicros' => '1200000',
                        'highTopOfPageBidMicros' => '3500000',
                        'monthlySearchVolumes' => [
                            ['year' => '2026', 'month' => 'JANUARY', 'monthlySearches' => '2200'],
                        ],
                    ],
                ],
            ],
        ], 200),
    ]);

    $result = app(GoogleAdsKeywordPlannerService::class)->keywordIdeas([
        'query' => 'aceite para masaje',
        'keywords' => ['aceite para masaje profesional'],
        'country' => 'MX',
        'language' => 'es',
        'limit' => 10,
    ]);

    Http::assertSent(function (HttpRequest $request): bool {
        if (! str_contains($request->url(), 'googleads.googleapis.com')) {
            return false;
        }

        return $request->hasHeader('developer-token', 'developer-token')
            && $request->hasHeader('login-customer-id', '9998887777')
            && $request['language'] === 'languageConstants/1003'
            && $request['geoTargetConstants'] === ['geoTargetConstants/2484']
            && $request['keywordSeed']['keywords'] === ['aceite para masaje', 'aceite para masaje profesional']
            && $request['pageSize'] === 10;
    });

    expect($result)
        ->toMatchArray([
            'provider' => 'google_ads_keyword_planner',
            'customer_id' => '1234567890',
            'geo_target_constant' => 'geoTargetConstants/2484',
            'language_constant' => 'languageConstants/1003',
            'rows' => [
                [
                    'keyword' => 'aceite para masaje',
                    'avg_monthly_searches' => 2400,
                    'competition' => 'MEDIUM',
                    'competition_index' => 58,
                    'low_top_of_page_bid_micros' => 1200000,
                    'high_top_of_page_bid_micros' => 3500000,
                    'monthly_search_volumes' => [
                        ['year' => '2026', 'month' => 'JANUARY', 'monthlySearches' => '2200'],
                    ],
                ],
            ],
        ]);
});
