<?php

namespace App\Ai\Tools\Keywords;

use Stringable;

class SemrushKeywordResearch extends KeywordResearchTool
{
    public function name(): string
    {
        return 'keywords_semrush_keyword_research';
    }

    public function description(): Stringable|string
    {
        return 'Placeholder for Semrush keyword overview, keyword gap, competitor rankings, difficulty, and content opportunities.';
    }

    protected function providerKey(): string
    {
        return 'semrush';
    }

    protected function providerName(): string
    {
        return 'Semrush';
    }

    protected function requiredConfig(): array
    {
        return ['services.semrush.api_key'];
    }
}
