<?php

namespace App\Ai\Tools\Keywords;

use Stringable;

class DataForSeoKeywordResearch extends KeywordResearchTool
{
    public function name(): string
    {
        return 'keywords_dataforseo_keyword_research';
    }

    public function description(): Stringable|string
    {
        return 'Placeholder for DataForSEO keyword research, search volume, CPC, keyword ideas, and SERP competitor data.';
    }

    protected function providerKey(): string
    {
        return 'dataforseo';
    }

    protected function providerName(): string
    {
        return 'DataForSEO';
    }

    protected function requiredConfig(): array
    {
        return ['services.dataforseo.login', 'services.dataforseo.password'];
    }
}
