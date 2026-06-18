<?php

namespace App\Mcp\Servers;

use App\Mcp\Tools\GenerateAndOptimizeImageTool;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;
use Laravel\Mcp\Server\Prompt;
use Laravel\Mcp\Server\Resource as McpResource;
use Laravel\Mcp\Server\Tool;

#[Name('Image Server')]
#[Version('1.0.0')]
#[Instructions('Generate marketing images with the configured AI image provider, then optimize and store them on a Laravel filesystem disk.')]
class ImageServer extends Server
{
    /**
     * @var array<int, class-string<Tool>>
     */
    protected array $tools = [
        GenerateAndOptimizeImageTool::class,
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
