<?php

namespace App\Ai\Tools\Keywords;

use Stringable;

class SerpApiSearchInsights extends KeywordResearchTool
{
    public function name(): string
    {
        return 'keywords_serpapi_search_insights';
    }

    public function description(): Stringable|string
    {
        return 'Placeholder for SerpApi SERP inspection, People Also Ask, related searches, organic competitors, and result intent analysis.';
    }

    protected function providerKey(): string
    {
        return 'serpapi';
    }

    protected function providerName(): string
    {
        return 'SerpApi';
    }

    protected function requiredConfig(): array
    {
        return ['services.serpapi.api_key'];
    }
}
