<?php

namespace App\Mcp\Servers;

use App\Mcp\Tools\GetConversionEventsTool;
use App\Mcp\Tools\GetMetaDatasetTool;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;
use Laravel\Mcp\Server\Prompt;
use Laravel\Mcp\Server\Resource as McpResource;
use Laravel\Mcp\Server\Tool;

#[Name('Tracking Server')]
#[Version('1.0.0')]
#[Instructions('Verify server-side conversion tracking, from both ends. Use get-conversion-events to read what this app dispatched to the Meta Conversions API, including attempts skipped because credentials are unset. Use get-meta-dataset to read what Meta actually received: event counts, the browser-versus-server split, and which match keys arrived. The two disagree in ways that matter — a dispatch recorded as sent is not proof Meta counted it, and an event Meta counted may have come from a developer laptop rather than a customer. A browser cannot observe server-side events, so these tools are the only evidence the Conversions API half of purchase tracking works. An empty result means nothing was attempted, which is different from something that failed. Rows carrying a test_event_code went to Meta Test Events, not to production stats. No count from either tool is a sale until someone has ruled out test orders.')]
class TrackingServer extends Server
{
    /**
     * @var array<int, class-string<Tool>>
     */
    protected array $tools = [
        GetConversionEventsTool::class,
        GetMetaDatasetTool::class,
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
