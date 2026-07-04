<?php

namespace App\Ai\Tools\Keywords;

use Stringable;

class GoogleAdsKeywordPlannerIdeas extends KeywordResearchTool
{
    public function name(): string
    {
        return 'keywords_google_ads_keyword_planner_ideas';
    }

    public function description(): Stringable|string
    {
        return 'Placeholder for Google Ads Keyword Planner keyword ideas, search volume ranges, CPC, and competition.';
    }

    protected function providerKey(): string
    {
        return 'google_ads_keyword_planner';
    }

    protected function providerName(): string
    {
        return 'Google Ads Keyword Planner';
    }

    protected function requiredConfig(): array
    {
        return [
            'services.google_ads.developer_token',
            'services.google_ads.customer_id',
        ];
    }
}
