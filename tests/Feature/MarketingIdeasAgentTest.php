<?php

use App\Ai\Agents\MarketingIdeasAgent;
use App\Ai\Tools\GetAnalyticsAccountSummaries;
use App\Ai\Tools\GetAnalyticsPropertyDetails;
use App\Ai\Tools\GetCustomDimensionsAndMetrics;
use App\Ai\Tools\GetInstagramPosts;
use App\Ai\Tools\GetMetaPagePosts;
use App\Ai\Tools\ListAnalyticsPropertyAnnotations;
use App\Ai\Tools\ListGoogleAdsLinks;
use App\Ai\Tools\MarketingProductCatalog;
use App\Ai\Tools\MarketingSalesSummary;
use App\Ai\Tools\RunAnalyticsConversionsReport;
use App\Ai\Tools\RunAnalyticsFunnelReport;
use App\Ai\Tools\RunAnalyticsRealtimeReport;
use App\Ai\Tools\RunAnalyticsReport;

it('carries the marketing ideas strategy rules', function () {
    $instructions = (string) (new MarketingIdeasAgent)->instructions();

    expect($instructions)
        ->toContain('139 proven marketing ideas')
        ->toContain('Suggest the 3-5 most relevant ideas')
        ->toContain('idea name, why it fits, how to start')
        ->toContain('public prices, no minimum order')
        ->toContain('Product catalog: active products, categories, SKUs')
        ->toContain('Sales summary: completed non-cancelled order totals by product')
        ->toContain('GA4 analytics: traffic, channels, campaigns')
        ->toContain('state the data source, date range or filters, dimensions, metrics, and caveats')
        ->toContain('You do not have tools that read reviews, competitor prices')
        ->toContain('recommend using AdsAgent');
});

it('exposes GA4 read-only tools for analytics context', function () {
    $tools = collect((new MarketingIdeasAgent)->tools())->map(fn (object $tool): string => $tool::class);

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
        ->not->toContain(GetMetaPagePosts::class)
        ->not->toContain(GetInstagramPosts::class);
});

it('maps conversation history into Laravel AI messages', function () {
    $messages = iterator_to_array(new MarketingIdeasAgent([
        ['role' => 'user', 'content' => 'Dame ideas de marketing'],
        ['role' => 'assistant', 'content' => 'Necesito etapa y presupuesto.'],
    ])->messages());

    expect($messages)->toHaveCount(2)
        ->and($messages[0]->content)->toBe('Dame ideas de marketing')
        ->and($messages[1]->content)->toBe('Necesito etapa y presupuesto.');
});
