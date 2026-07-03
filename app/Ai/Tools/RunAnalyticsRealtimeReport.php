<?php

namespace App\Ai\Tools;

use App\Ai\Tools\Ads\AnalyticsTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class RunAnalyticsRealtimeReport extends AnalyticsTool
{
    public function name(): string
    {
        return 'analytics_run_realtime_report';
    }

    public function description(): Stringable|string
    {
        return 'Run a GA4 realtime report to validate fresh ad traffic, landing page activity, or conversion events.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->analytics->runRealtimeReport($request->all()));
    }

    public function schema(JsonSchema $schema): array
    {
        $schemaDefinition = $this->reportSchema($schema);

        unset($schemaDefinition['date_ranges'], $schemaDefinition['currency_code']);

        return $schemaDefinition;
    }
}
