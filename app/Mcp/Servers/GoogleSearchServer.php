<?php

namespace App\Mcp\Servers;

use App\Mcp\Tools\Keywords\GoogleAdsKeywordPlannerIdeas;
use App\Mcp\Tools\Keywords\GoogleSearchConsoleKeywordPerformance;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;
use Laravel\Mcp\Server\Prompt;
use Laravel\Mcp\Server\Resource as McpResource;
use Laravel\Mcp\Server\Tool;

#[Name('Google Search Server')]
#[Version('1.0.0')]
#[Instructions('Read Google search demand and performance data for SEO and paid keyword research. Use google-ads-keyword-planner-ideas to discover new keywords with search volume, competition, and top-of-page bid ranges. Use google-search-console-performance to review how the site already ranks, with clicks, impressions, CTR, and average position by query and page. Keyword Planner describes the market; Search Console describes this site within it.')]
class GoogleSearchServer extends Server
{
    /**
     * @var array<int, class-string<Tool>>
     */
    protected array $tools = [
        GoogleAdsKeywordPlannerIdeas::class,
        GoogleSearchConsoleKeywordPerformance::class,
    ];

    /**
     * @var array<int, class-string<McpResource>>
     */
    protected array $resources = [
        //
    ];

    /**
     * @var array<int, class-string<Prompt>>
     */
    protected array $prompts = [
        //
    ];
}
