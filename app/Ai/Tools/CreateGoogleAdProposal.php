<?php

namespace App\Ai\Tools;

use App\Ai\Tools\Ads\AdProposalTool;

class CreateGoogleAdProposal extends AdProposalTool
{
    public function name(): string
    {
        return 'create_google_ad_proposal';
    }

    protected function platform(): string
    {
        return 'google';
    }

    protected function platformLabel(): string
    {
        return 'Google Ads';
    }
}
