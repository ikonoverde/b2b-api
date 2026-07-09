<?php

namespace App\Mcp\Servers;

use App\Mcp\Tools\MarketingProductCatalog;
use App\Mcp\Tools\MarketingSalesSummary;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;
use Laravel\Mcp\Server\Prompt;
use Laravel\Mcp\Server\Resource as McpResource;
use Laravel\Mcp\Server\Tool;

#[Name('Marketing Server')]
#[Version('1.0.0')]
#[Instructions('Read storefront marketing data. Use marketing-product-catalog to list active products for campaign and content planning, filtered by category, search term, or featured status. Use marketing-sales-summary to review revenue, order counts, average order value, and top selling products over a date range.')]
class MarketingServer extends Server
{
    /**
     * @var array<int, class-string<Tool>>
     */
    protected array $tools = [
        MarketingProductCatalog::class,
        MarketingSalesSummary::class,
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
