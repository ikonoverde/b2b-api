<?php

namespace App\Ai\Tools;

use App\Ai\Tools\Ads\AnalyticsTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class RunAnalyticsReport extends AnalyticsTool
{
    public function name(): string
    {
        return 'analytics_run_report';
    }

    public function description(): Stringable|string
    {
        return 'Run a GA4 Data API report for traffic, channel, landing page, campaign, ecommerce, and engagement analysis.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->analytics->runReport($request->all()));
    }

    public function schema(JsonSchema $schema): array
    {
        return $this->reportSchema($schema);
    }
}
