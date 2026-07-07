<?php

use App\Ai\Agents\GoogleAnalyticsAgent;
use App\Ai\Agents\KeywordsAgent;
use App\Ai\Tools\Keywords\AhrefsKeywordResearch;
use App\Ai\Tools\Keywords\DataForSeoKeywordResearch;
use App\Ai\Tools\Keywords\GoogleAdsKeywordPlannerIdeas;
use App\Ai\Tools\Keywords\GoogleSearchConsoleKeywordPerformance;
use App\Ai\Tools\Keywords\SemrushKeywordResearch;
use App\Ai\Tools\Keywords\SerpApiSearchInsights;
use App\Ai\Tools\MarketingProductCatalog;
use App\Ai\Tools\MarketingSalesSummary;
use Laravel\Ai\Tools\AgentTool;
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
    $toolClasses = collect((new KeywordsAgent)->tools())
        ->map(fn (object $tool): string => $tool instanceof AgentTool ? $tool->agent()::class : $tool::class)
        ->all();

    expect($toolClasses)
        ->toContain(MarketingProductCatalog::class)
        ->toContain(MarketingSalesSummary::class)
        ->toContain(GoogleAnalyticsAgent::class)
        ->toContain(GoogleSearchConsoleKeywordPerformance::class)
        ->toContain(GoogleAdsKeywordPlannerIdeas::class);
});

it('exposes expected SEO keyword tool names', function () {
    $toolNames = collect((new KeywordsAgent)->tools())
        ->map(function (object $tool): string {
            if ($tool instanceof AgentTool) {
                return $tool->name();
            }

            return is_callable([$tool, 'name']) ? $tool->name() : $tool::class;
        })
        ->all();

    expect($toolNames)->toContain(
        'google_analytics_specialist',
        'keywords_google_search_console_performance',
        'keywords_google_ads_keyword_planner_ideas',
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
    'keyword planner' => [GoogleAdsKeywordPlannerIdeas::class, 'google_ads_keyword_planner', ['services.google_ads.developer_token', 'services.google_ads.customer_id', 'services.google_ads.client_id', 'services.google_ads.client_secret', 'services.google_ads.refresh_token']],
    'semrush' => [SemrushKeywordResearch::class, 'semrush', ['services.semrush.api_key']],
    'ahrefs' => [AhrefsKeywordResearch::class, 'ahrefs', ['services.ahrefs.api_key']],
]);
