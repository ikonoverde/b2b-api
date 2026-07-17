<?php

namespace App\Ai\Tools\Analytics;

use App\Ai\Tools\Ads\AnalyticsTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetAnalyticsAccountSummaries extends AnalyticsTool
{
    public function name(): string
    {
        return 'analytics_get_account_summaries';
    }

    public function description(): Stringable|string
    {
        return 'List Google Analytics account summaries and available GA4 properties for account selection.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->analytics->accountSummaries());
    }

    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
