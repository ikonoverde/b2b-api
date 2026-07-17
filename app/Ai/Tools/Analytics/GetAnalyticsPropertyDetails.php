<?php

namespace App\Ai\Tools\Analytics;

use App\Ai\Tools\Ads\AnalyticsTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetAnalyticsPropertyDetails extends AnalyticsTool
{
    public function name(): string
    {
        return 'analytics_get_property_details';
    }

    public function description(): Stringable|string
    {
        return 'Get GA4 property details such as display name, time zone, currency, and account relationship.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->analytics->propertyDetails($request->string('property_id')->toString() ?: null));
    }

    public function schema(JsonSchema $schema): array
    {
        return $this->propertySchema($schema);
    }
}
