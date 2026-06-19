<?php

namespace App\Mcp\Servers;

use App\Mcp\Tools\CreateBlogPostTool;
use App\Mcp\Tools\EditBlogPostTool;
use App\Mcp\Tools\GetBlogPostTool;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;
use Laravel\Mcp\Server\Prompt;
use Laravel\Mcp\Server\Resource as McpResource;
use Laravel\Mcp\Server\Tool;

#[Name('Blog Server')]
#[Version('1.0.0')]
#[Instructions('Manage blog content for the public storefront. Use get-blog-post to retrieve full post details by ID or slug, create-blog-post to create draft, scheduled, or published posts, and edit-blog-post to update existing posts or set their cover images. Cover images must already exist on the public storage disk.')]
class BlogServer extends Server
{
    /**
     * @var array<int, class-string<Tool>>
     */
    protected array $tools = [
        GetBlogPostTool::class,
        CreateBlogPostTool::class,
        EditBlogPostTool::class,
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
