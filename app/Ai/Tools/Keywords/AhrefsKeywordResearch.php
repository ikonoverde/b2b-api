<?php

namespace App\Ai\Tools\Keywords;

use Stringable;

class AhrefsKeywordResearch extends KeywordResearchTool
{
    public function name(): string
    {
        return 'keywords_ahrefs_keyword_research';
    }

    public function description(): Stringable|string
    {
        return 'Placeholder for Ahrefs keyword explorer, content gap, competitor keywords, keyword difficulty, and backlink-informed SEO analysis.';
    }

    protected function providerKey(): string
    {
        return 'ahrefs';
    }

    protected function providerName(): string
    {
        return 'Ahrefs';
    }

    protected function requiredConfig(): array
    {
        return ['services.ahrefs.api_key'];
    }
}
