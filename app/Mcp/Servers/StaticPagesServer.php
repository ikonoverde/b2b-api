<?php

namespace App\Mcp\Servers;

use App\Mcp\Tools\StaticPages\EditStaticPageTool;
use App\Mcp\Tools\StaticPages\GetStaticPageTool;
use App\Mcp\Tools\StaticPages\ListStaticPagesTool;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;
use Laravel\Mcp\Server\Prompt;
use Laravel\Mcp\Server\Resource as McpResource;
use Laravel\Mcp\Server\Tool;

#[Name('Static Pages Server')]
#[Version('1.0.0')]
#[Instructions('Manage the storefront static pages: terms, privacy, about, and FAQ. Use list-static-pages to see which pages exist, get-static-page to read one by slug or ID, and edit-static-page to rewrite its title, content, or publication state. These pages are a fixed set: the storefront routes name each slug, so a page cannot be created, renamed, or deleted here. An edit replaces the whole page body, so read the page before writing it, and remember that unpublishing a routed page takes a live URL down.')]
class StaticPagesServer extends Server
{
    /**
     * @var array<int, class-string<Tool>>
     */
    protected array $tools = [
        ListStaticPagesTool::class,
        GetStaticPageTool::class,
        EditStaticPageTool::class,
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
