<?php

namespace App\Ai\Tools\Analytics;

use App\Ai\Tools\Ads\AnalyticsTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class RunAnalyticsConversionsReport extends AnalyticsTool
{
    public function name(): string
    {
        return 'analytics_run_conversions_report';
    }

    public function description(): Stringable|string
    {
        return 'Run a GA4 conversion report with optional conversion spec for CPA, ROAS, conversion, and attribution analysis.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->analytics->runConversionsReport($request->all()));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            ...$this->reportSchema($schema),
            'conversion_spec' => $schema->object()
                ->nullable()
                ->description('Optional conversion spec, for example {"conversion_actions":[],"attribution_model":"DATA_DRIVEN"}. Snake_case and camelCase keys are accepted.'),
        ];
    }
}
