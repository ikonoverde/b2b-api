<?php

namespace App\Ai\Tools\Analytics;

use App\Ai\Tools\Ads\AnalyticsTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class RunAnalyticsFunnelReport extends AnalyticsTool
{
    public function name(): string
    {
        return 'analytics_run_funnel_report';
    }

    public function description(): Stringable|string
    {
        return 'Run a GA4 funnel report for drop-off analysis across ad click, landing page, cart, checkout, purchase, or lead steps.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->analytics->runFunnelReport($request->all()));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            ...$this->propertySchema($schema),
            'date_ranges' => $schema->array()
                ->description('Date ranges, for example [{"start_date":"30daysAgo","end_date":"yesterday"}].')
                ->required(),
            'funnel_steps' => $schema->array()
                ->description('Funnel steps. Each step may use {"name":"View product","event":"view_item"} or a raw GA funnel filter expression.')
                ->required(),
            'funnel_breakdown' => $schema->object()
                ->nullable()
                ->description('Optional funnel breakdown definition.'),
            'funnel_next_action' => $schema->object()
                ->nullable()
                ->description('Optional next-action analysis definition.'),
            'segments' => $schema->array()
                ->nullable()
                ->description('Optional GA funnel segments.'),
            'return_property_quota' => $schema->boolean()
                ->nullable()
                ->description('Whether to include property quota in the response.'),
        ];
    }
}
