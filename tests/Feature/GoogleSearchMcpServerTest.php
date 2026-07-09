<?php

use App\Mcp\Servers\GoogleSearchServer;
use App\Mcp\Tools\Keywords\GoogleAdsKeywordPlannerIdeas;
use App\Mcp\Tools\Keywords\GoogleSearchConsoleKeywordPerformance;
use App\Models\User;
use App\Services\Ads\GoogleAdsKeywordPlannerService;
use App\Services\Seo\GoogleSearchConsoleService;
use Illuminate\Testing\Fluent\AssertableJson;

function fakeKeywordPlanner(array $result): void
{
    app()->instance(GoogleAdsKeywordPlannerService::class, new class($result) extends GoogleAdsKeywordPlannerService
    {
        public function __construct(private array $result) {}

        public function keywordIdeas(array $arguments): array
        {
            return $this->result;
        }
    });
}

function fakeSearchConsole(array $result): void
{
    app()->instance(GoogleSearchConsoleService::class, new class($result) extends GoogleSearchConsoleService
    {
        public function __construct(private array $result) {}

        public function queryPerformance(array $arguments): array
        {
            return $this->result;
        }
    });
}

function configureGoogleAds(): void
{
    config([
        'services.google_ads.developer_token' => 'developer-token',
        'services.google_ads.customer_id' => '123-456-7890',
        'services.google_ads.client_id' => 'client-id',
        'services.google_ads.client_secret' => 'client-secret',
        'services.google_ads.refresh_token' => 'refresh-token',
    ]);
}

function configureSearchConsole(): void
{
    config([
        'services.google_search_console.site_url' => 'sc-domain:example.com',
        'services.google_search_console.credentials_json' => '{}',
        'services.google_search_console.credentials_path' => null,
    ]);
}

it('returns keyword planner ideas for an admin', function () {
    $admin = User::factory()->admin()->create();
    configureGoogleAds();
    fakeKeywordPlanner([
        'provider' => 'google_ads_keyword_planner',
        'customer_id' => '1234567890',
        'geo_target_constant' => 'geoTargetConstants/2484',
        'language_constant' => 'languageConstants/1003',
        'keyword_plan_network' => 'GOOGLE_SEARCH_AND_PARTNERS',
        'seed_keywords' => ['aceite para masaje'],
        'rows' => [[
            'keyword' => 'aceite para masaje profesional',
            'avg_monthly_searches' => 2400,
            'competition' => 'MEDIUM',
            'competition_index' => 44,
            'low_top_of_page_bid_micros' => 1200000,
            'high_top_of_page_bid_micros' => 4800000,
            'monthly_search_volumes' => [],
        ]],
    ]);

    GoogleSearchServer::actingAs($admin)->tool(GoogleAdsKeywordPlannerIdeas::class, [
        'query' => 'aceite para masaje',
        'country' => 'MX',
        'language' => 'es',
        'limit' => 25,
    ])
        ->assertOk()
        ->assertName('google-ads-keyword-planner-ideas')
        ->assertSee(['aceite para masaje profesional', 'MEDIUM'])
        ->assertStructuredContent(fn (AssertableJson $json) => $json
            ->where('rows.0.avg_monthly_searches', 2400)
            ->etc()
        );
});

it('returns search console performance for an admin', function () {
    $admin = User::factory()->admin()->create();
    configureSearchConsole();
    fakeSearchConsole([
        'provider' => 'google_search_console',
        'site_url' => 'sc-domain:example.com',
        'date_range' => ['start_date' => '2026-01-01', 'end_date' => '2026-01-31'],
        'dimensions' => ['query', 'page'],
        'rows' => [[
            'query' => 'aceite para masaje',
            'page' => 'https://example.com/aceites',
            'clicks' => 12,
            'impressions' => 100,
            'ctr' => 0.12,
            'position' => 4.5,
        ]],
    ]);

    GoogleSearchServer::actingAs($admin)->tool(GoogleSearchConsoleKeywordPerformance::class, [
        'query' => 'aceite para masaje',
        'date_range' => '2026-01-01:2026-01-31',
    ])
        ->assertOk()
        ->assertName('google-search-console-performance')
        ->assertStructuredContent(fn (AssertableJson $json) => $json
            ->where('rows.0.clicks', 12)
            ->where('rows.0.position', 4.5)
            ->etc()
        );
});

it('denies keyword tools to non admin users', function (string $tool) {
    $customer = User::factory()->create();

    GoogleSearchServer::actingAs($customer)->tool($tool, [])->assertHasErrors(['Permission denied.']);
})->with([
    'keyword planner' => GoogleAdsKeywordPlannerIdeas::class,
    'search console' => GoogleSearchConsoleKeywordPerformance::class,
]);

it('reports missing google ads configuration', function () {
    $admin = User::factory()->admin()->create();
    configureGoogleAds();
    config(['services.google_ads.developer_token' => null]);

    GoogleSearchServer::actingAs($admin)->tool(GoogleAdsKeywordPlannerIdeas::class, [
        'query' => 'aceite para masaje',
    ])->assertHasErrors(['Google Ads Keyword Planner API is not configured. Missing config: services.google_ads.developer_token.']);
});

it('reports missing search console credentials once the site url is set', function () {
    $admin = User::factory()->admin()->create();
    config([
        'services.google_search_console.site_url' => 'sc-domain:example.com',
        'services.google_search_console.credentials_json' => null,
        'services.google_search_console.credentials_path' => null,
    ]);

    GoogleSearchServer::actingAs($admin)->tool(GoogleSearchConsoleKeywordPerformance::class, [
        'query' => 'aceite para masaje',
    ])->assertHasErrors([
        'Google Search Console API is not configured. Missing config: services.google_search_console.credentials_path, services.google_search_console.credentials_json.',
    ]);
});

it('surfaces provider failures as tool errors instead of structured content', function () {
    $admin = User::factory()->admin()->create();
    configureGoogleAds();
    fakeKeywordPlanner([
        'error' => true,
        'provider' => 'google_ads_keyword_planner',
        'message' => 'Unable to fetch a Google Ads access token.',
    ]);

    GoogleSearchServer::actingAs($admin)->tool(GoogleAdsKeywordPlannerIdeas::class, [
        'query' => 'aceite para masaje',
    ])->assertHasErrors([
        'Google Ads Keyword Planner request failed: Unable to fetch a Google Ads access token.',
    ]);
});

it('rejects an unsupported search console dimension', function () {
    $admin = User::factory()->admin()->create();
    configureSearchConsole();

    GoogleSearchServer::actingAs($admin)->tool(GoogleSearchConsoleKeywordPerformance::class, [
        'dimensions' => ['query', 'nonsense'],
    ])->assertHasErrors();
});
