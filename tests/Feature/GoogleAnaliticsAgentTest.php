<?php

use App\Ai\Agents\GoogleAnalyticsAgent;
use App\Ai\Tools\Analytics\GetAnalyticsAccountSummaries;
use App\Ai\Tools\Analytics\GetAnalyticsPropertyDetails;
use App\Ai\Tools\Analytics\GetCustomDimensionsAndMetrics;
use App\Ai\Tools\Analytics\ListAnalyticsPropertyAnnotations;
use App\Ai\Tools\Analytics\ListGoogleAdsLinks;
use App\Ai\Tools\Analytics\RunAnalyticsConversionsReport;
use App\Ai\Tools\Analytics\RunAnalyticsFunnelReport;
use App\Ai\Tools\Analytics\RunAnalyticsRealtimeReport;
use App\Ai\Tools\Analytics\RunAnalyticsReport;
use App\Ai\Tools\Meta\GetMetaPagePosts;

it('carries Google Analytics delegation and interpretation rules', function () {
    $instructions = (string) (new GoogleAnalyticsAgent)->instructions();

    expect($instructions)
        ->toContain('safe delegation target for other agents and models')
        ->toContain('GA4 account summaries, property details, Google Ads links')
        ->toContain('Do not mutate analytics, advertising, storefront, or customer data')
        ->toContain('Always state the property, date range, filters, dimensions, metrics, currency, and caveats')
        ->toContain('Use conversion-specific tools for conversion, ROAS, ad cost, ad clicks, attribution')
        ->toContain('Use precise Mexican Spanish');
});

it('exposes only Google Analytics read-only tools', function () {
    $tools = collect((new GoogleAnalyticsAgent)->tools())->map(fn (object $tool): string => $tool::class);

    expect($tools->all())
        ->toContain(GetAnalyticsAccountSummaries::class)
        ->toContain(GetAnalyticsPropertyDetails::class)
        ->toContain(ListGoogleAdsLinks::class)
        ->toContain(GetCustomDimensionsAndMetrics::class)
        ->toContain(RunAnalyticsReport::class)
        ->toContain(RunAnalyticsConversionsReport::class)
        ->toContain(RunAnalyticsFunnelReport::class)
        ->toContain(RunAnalyticsRealtimeReport::class)
        ->toContain(ListAnalyticsPropertyAnnotations::class)
        ->not->toContain(GetMetaPagePosts::class);
});

it('maps conversation history into Laravel AI messages', function () {
    $messages = iterator_to_array(new GoogleAnalyticsAgent([
        ['role' => 'user', 'content' => 'Analiza conversiones de GA4'],
        ['role' => 'assistant', 'content' => 'Necesito propiedad y rango.'],
    ])->messages());

    expect($messages)->toHaveCount(2)
        ->and($messages[0]->content)->toBe('Analiza conversiones de GA4')
        ->and($messages[1]->content)->toBe('Necesito propiedad y rango.');
});
