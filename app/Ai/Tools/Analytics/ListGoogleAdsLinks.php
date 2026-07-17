<?php

namespace App\Ai\Tools\Analytics;

use App\Ai\Tools\Ads\AnalyticsTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class ListGoogleAdsLinks extends AnalyticsTool
{
    public function name(): string
    {
        return 'analytics_list_google_ads_links';
    }

    public function description(): Stringable|string
    {
        return 'List Google Ads accounts linked to a GA4 property to verify ad attribution setup.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->analytics->googleAdsLinks($request->string('property_id')->toString() ?: null));
    }

    public function schema(JsonSchema $schema): array
    {
        return $this->propertySchema($schema);
    }
}
