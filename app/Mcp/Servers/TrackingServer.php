<?php

namespace App\Mcp\Servers;

use App\Mcp\Tools\GetConversionEventsTool;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;
use Laravel\Mcp\Server\Prompt;
use Laravel\Mcp\Server\Resource as McpResource;
use Laravel\Mcp\Server\Tool;

#[Name('Tracking Server')]
#[Version('1.0.0')]
#[Instructions('Verify server-side conversion tracking. Use get-conversion-events to read every Meta Conversions API purchase dispatch, including ones skipped because Meta credentials are unset. A browser cannot observe server-side events, so this is the only evidence that the Conversions API half of purchase tracking works. An empty result means no dispatch was attempted, which is different from a dispatch that failed. Rows carrying a test_event_code went to Meta Test Events, not to production stats, and are not sales.')]
class TrackingServer extends Server
{
    /**
     * @var array<int, class-string<Tool>>
     */
    protected array $tools = [
        GetConversionEventsTool::class,
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
