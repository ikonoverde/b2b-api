<?php

namespace App\Mcp\Tools\Ads;

use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Title;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

#[Name('create-google-ad-proposal')]
#[Title('Create Google Ads Proposal')]
#[Description('Create an internal draft Google Ads proposal in the database. This does not publish, create, or modify campaigns in any ad platform.')]
#[IsDestructive(false)]
class CreateGoogleAdProposal extends AdProposalTool
{
    protected function platform(): string
    {
        return 'google';
    }

    protected function platformLabel(): string
    {
        return 'Google Ads';
    }
}
