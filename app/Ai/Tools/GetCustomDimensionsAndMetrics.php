<?php

namespace App\Ai\Tools;

use App\Ai\Tools\Ads\AnalyticsTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetCustomDimensionsAndMetrics extends AnalyticsTool
{
    public function name(): string
    {
        return 'analytics_get_custom_dimensions_and_metrics';
    }

    public function description(): Stringable|string
    {
        return 'List custom GA4 dimensions and metrics available for ads, attribution, and funnel reporting.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->analytics->customDimensionsAndMetrics($request->string('property_id')->toString() ?: null));
    }

    public function schema(JsonSchema $schema): array
    {
        return $this->propertySchema($schema);
    }
}
