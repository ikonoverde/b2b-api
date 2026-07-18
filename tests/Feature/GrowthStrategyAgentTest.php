<?php

use App\Ai\Agents\GrowthStrategyAgent;
use App\Ai\Tools\Analytics\GetAnalyticsAccountSummaries;
use App\Ai\Tools\Analytics\GetAnalyticsPropertyDetails;
use App\Ai\Tools\Analytics\GetCustomDimensionsAndMetrics;
use App\Ai\Tools\Analytics\ListAnalyticsPropertyAnnotations;
use App\Ai\Tools\Analytics\ListGoogleAdsLinks;
use App\Ai\Tools\Analytics\RunAnalyticsConversionsReport;
use App\Ai\Tools\Analytics\RunAnalyticsFunnelReport;
use App\Ai\Tools\Analytics\RunAnalyticsRealtimeReport;
use App\Ai\Tools\Analytics\RunAnalyticsReport;
use App\Ai\Tools\Growth\GetGrowthPlan;
use App\Ai\Tools\Growth\SaveGrowthPlan;
use App\Ai\Tools\Marketing\MarketingProductCatalog;
use App\Ai\Tools\Marketing\MarketingSalesSummary;
use App\Ai\Tools\Meta\GetInstagramPosts;
use App\Ai\Tools\Meta\GetMetaPagePosts;
use Laravel\Ai\Contracts\HasTools;

it('carries the marketing ideas strategy rules', function () {
    $instructions = (string) (new GrowthStrategyAgent)->instructions();

    expect($instructions)
        ->toContain('139 proven marketing ideas')
        ->toContain('growth strategy specialist')
        ->toContain('delegate to PaidAcquisitionAgent')
        ->toContain('Suggest the 3-5 most relevant ideas')
        ->toContain('idea name, why it fits, how to start')
        ->toContain('Core messages: uso profesional')
        ->toContain('Product catalog: active products, categories, SKUs')
        ->toContain('Sales summary: completed non-cancelled order totals by product')
        ->toContain('GA4 analytics: traffic, channels, campaigns')
        ->toContain('state the data source, date range or filters, dimensions, metrics, and caveats')
        ->toContain('You do not directly read reviews, competitor prices')
        ->toContain('recommend using PaidAcquisitionAgent directly');
});

it('exposes GA4 read-only tools for analytics context', function () {
    $tools = collect((new GrowthStrategyAgent)->tools())
        ->flatMap(fn (object $tool): array => $tool instanceof HasTools
            ? collect($tool->tools())->map(fn (object $nestedTool): string => $nestedTool::class)->all()
            : [$tool::class]);

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

it('can read the standing plan and file a new one', function () {
    $tools = collect((new GrowthStrategyAgent)->tools())
        ->map(fn (object $tool): string => $tool::class);

    expect($tools->all())
        ->toContain(GetGrowthPlan::class)
        ->toContain(SaveGrowthPlan::class);
});

/**
 * The gate is architectural, not a sentence in a prompt. The agent's only write tool files a plan into
 * a table a person reads; nothing in its reach publishes, spends, or emails. Its instructions say it
 * cannot close a task on its own judgement, and GrowthPlanService is what makes that true.
 */
it('carries the rules of the plan it is allowed to write', function () {
    $instructions = (string) (new GrowthStrategyAgent)->instructions();

    expect($instructions)
        ->toContain('You cannot close a task on your own judgement')
        ->toContain('the tool checks it against the report')
        ->toContain('a closed task nobody did is a lie the next run will act on')
        ->toContain('Dropping is different, and it is yours')
        ->toContain('The paid gate is yours to decide')
        ->toContain('file no paid-acquisition tasks')
        ->toContain('The sales summary reads the local development database')
        ->toContain('Dedupe by intent, not by title');
});

it('maps conversation history into Laravel AI messages', function () {
    $messages = iterator_to_array(new GrowthStrategyAgent([
        ['role' => 'user', 'content' => 'Dame ideas de marketing'],
        ['role' => 'assistant', 'content' => 'Necesito etapa y presupuesto.'],
    ])->messages());

    expect($messages)->toHaveCount(2)
        ->and($messages[0]->content)->toBe('Dame ideas de marketing')
        ->and($messages[1]->content)->toBe('Necesito etapa y presupuesto.');
});
