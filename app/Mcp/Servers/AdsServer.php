<?php

namespace App\Mcp\Servers;

use App\Mcp\Tools\Ads\CreateGoogleAdProposal;
use App\Mcp\Tools\Ads\CreateMetaAdProposal;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;
use Laravel\Mcp\Server\Prompt;
use Laravel\Mcp\Server\Resource as McpResource;
use Laravel\Mcp\Server\Tool;

#[Name('Ads Server')]
#[Version('1.0.0')]
#[Instructions('Draft internal paid media proposals for later human review. Use create-meta-ad-proposal for Meta and Instagram campaign concepts, and create-google-ad-proposal for Google Ads search, shopping, and performance max concepts. Both tools only write a draft row to this application\'s database. Neither one publishes, creates, or modifies anything in Meta Ads Manager or Google Ads.')]
class AdsServer extends Server
{
    /**
     * @var array<int, class-string<Tool>>
     */
    protected array $tools = [
        CreateMetaAdProposal::class,
        CreateGoogleAdProposal::class,
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
