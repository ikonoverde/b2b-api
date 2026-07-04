<?php

use App\Ai\Agents\KeywordsAgent;
use App\Ai\Tools\GetAnalyticsAccountSummaries;
use App\Ai\Tools\GetAnalyticsPropertyDetails;
use App\Ai\Tools\GetCustomDimensionsAndMetrics;
use App\Ai\Tools\Keywords\AhrefsKeywordResearch;
use App\Ai\Tools\Keywords\DataForSeoKeywordResearch;
use App\Ai\Tools\Keywords\GoogleAdsKeywordPlannerIdeas;
use App\Ai\Tools\Keywords\GoogleSearchConsoleKeywordPerformance;
use App\Ai\Tools\Keywords\SemrushKeywordResearch;
use App\Ai\Tools\Keywords\SerpApiSearchInsights;
use App\Ai\Tools\ListAnalyticsPropertyAnnotations;
use App\Ai\Tools\ListGoogleAdsLinks;
use App\Ai\Tools\MarketingProductCatalog;
use App\Ai\Tools\MarketingSalesSummary;
use App\Ai\Tools\RunAnalyticsConversionsReport;
use App\Ai\Tools\RunAnalyticsFunnelReport;
use App\Ai\Tools\RunAnalyticsRealtimeReport;
use App\Ai\Tools\RunAnalyticsReport;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;

it('carries the keyword research operating rules', function () {
    $instructions = (string) (new KeywordsAgent)->instructions();

    expect($instructions)
        ->toContain('SEO keyword research specialist')
        ->toContain('Mexican Spanish B2B ecommerce search demand')
        ->toContain('transactional, commercial investigation, informational, local, comparison, or branded')
        ->toContain('Use external SEO provider tools when configured')
        ->toContain('If an external SEO tool returns a configuration or not-implemented placeholder response')
        ->toContain('Never invent exact search volume, CPC, rankings, CTR, or competitor data')
        ->toContain('public prices, no minimum order')
        ->toContain('Use precise Mexican Spanish');
});

it('exposes product sales analytics and SEO keyword tools', function () {
    $tools = collect((new KeywordsAgent)->tools())->map(fn (object $tool): string => $tool::class);

    expect($tools->all())
        ->toContain(MarketingProductCatalog::class)
        ->toContain(MarketingSalesSummary::class)
        ->toContain(GetAnalyticsAccountSummaries::class)
        ->toContain(GetAnalyticsPropertyDetails::class)
        ->toContain(ListGoogleAdsLinks::class)
        ->toContain(GetCustomDimensionsAndMetrics::class)
        ->toContain(RunAnalyticsReport::class)
        ->toContain(RunAnalyticsConversionsReport::class)
        ->toContain(RunAnalyticsFunnelReport::class)
        ->toContain(RunAnalyticsRealtimeReport::class)
        ->toContain(ListAnalyticsPropertyAnnotations::class)
        ->toContain(DataForSeoKeywordResearch::class)
        ->toContain(SerpApiSearchInsights::class)
        ->toContain(GoogleSearchConsoleKeywordPerformance::class)
        ->toContain(GoogleAdsKeywordPlannerIdeas::class)
        ->toContain(SemrushKeywordResearch::class)
        ->toContain(AhrefsKeywordResearch::class);
});

it('exposes expected SEO keyword tool names', function () {
    $toolNames = collect((new KeywordsAgent)->tools())
        ->map(fn (Tool $tool): string => $tool->name())
        ->all();

    expect($toolNames)->toContain(
        'keywords_dataforseo_keyword_research',
        'keywords_serpapi_search_insights',
        'keywords_google_search_console_performance',
        'keywords_google_ads_keyword_planner_ideas',
        'keywords_semrush_keyword_research',
        'keywords_ahrefs_keyword_research',
    );
});

it('maps conversation history into Laravel AI messages', function () {
    $messages = iterator_to_array(new KeywordsAgent([
        ['role' => 'user', 'content' => 'Investiga keywords para aceites 5 L'],
        ['role' => 'assistant', 'content' => 'Necesito mercado y objetivo.'],
    ])->messages());

    expect($messages)->toHaveCount(2)
        ->and($messages[0]->content)->toBe('Investiga keywords para aceites 5 L')
        ->and($messages[1]->content)->toBe('Necesito mercado y objetivo.');
});

it('returns structured configuration errors from SEO placeholders', function (string $toolClass, string $provider, array $requiredConfig) {
    foreach ($requiredConfig as $configKey) {
        config([$configKey => null]);
    }

    $payload = json_decode((string) app($toolClass)->handle(new Request([
        'query' => 'aceite de masaje profesional',
        'country' => 'MX',
        'language' => 'es',
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload)
        ->toMatchArray([
            'error' => true,
            'provider' => $provider,
            'required_config' => $requiredConfig,
        ])
        ->and($payload['message'])->toContain('API is not configured')
        ->and($payload['received_arguments']['query'])->toBe('aceite de masaje profesional');
})->with([
    'dataforseo' => [DataForSeoKeywordResearch::class, 'dataforseo', ['services.dataforseo.login', 'services.dataforseo.password']],
    'serpapi' => [SerpApiSearchInsights::class, 'serpapi', ['services.serpapi.api_key']],
    'search console' => [GoogleSearchConsoleKeywordPerformance::class, 'google_search_console', ['services.google_search_console.site_url']],
    'keyword planner' => [GoogleAdsKeywordPlannerIdeas::class, 'google_ads_keyword_planner', ['services.google_ads.developer_token', 'services.google_ads.customer_id']],
    'semrush' => [SemrushKeywordResearch::class, 'semrush', ['services.semrush.api_key']],
    'ahrefs' => [AhrefsKeywordResearch::class, 'ahrefs', ['services.ahrefs.api_key']],
]);
