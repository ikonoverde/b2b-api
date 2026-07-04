<?php

namespace App\Ai\Tools\Keywords;

use Stringable;

class GoogleSearchConsoleKeywordPerformance extends KeywordResearchTool
{
    public function name(): string
    {
        return 'keywords_google_search_console_performance';
    }

    public function description(): Stringable|string
    {
        return 'Placeholder for Google Search Console query, page, impressions, clicks, CTR, and position performance.';
    }

    protected function providerKey(): string
    {
        return 'google_search_console';
    }

    protected function providerName(): string
    {
        return 'Google Search Console';
    }

    protected function requiredConfig(): array
    {
        return ['services.google_search_console.site_url'];
    }
}
