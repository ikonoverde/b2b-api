<?php

namespace App\Mcp\Tools\Ads;

use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Title;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

#[Name('create-meta-ad-proposal')]
#[Title('Create Meta Ad Proposal')]
#[Description('Create an internal draft Meta ads proposal in the database. This does not publish, create, or modify campaigns in any ad platform.')]
#[IsDestructive(false)]
class CreateMetaAdProposal extends AdProposalTool
{
    protected function platform(): string
    {
        return 'meta';
    }

    protected function platformLabel(): string
    {
        return 'Meta';
    }
}
