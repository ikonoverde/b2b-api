<?php

namespace App\Ai\Tools\Analytics;

use App\Ai\Tools\Ads\AnalyticsTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class ListAnalyticsPropertyAnnotations extends AnalyticsTool
{
    public function name(): string
    {
        return 'analytics_list_property_annotations';
    }

    public function description(): Stringable|string
    {
        return 'List GA4 property annotations to explain traffic, spend, or conversion spikes around launches and campaign changes.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->analytics->propertyAnnotations($request->string('property_id')->toString() ?: null));
    }

    public function schema(JsonSchema $schema): array
    {
        return $this->propertySchema($schema);
    }
}
