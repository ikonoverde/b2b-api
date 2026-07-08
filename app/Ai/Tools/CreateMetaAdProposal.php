<?php

namespace App\Ai\Tools;

use App\Ai\Tools\Ads\AdProposalTool;

class CreateMetaAdProposal extends AdProposalTool
{
    public function name(): string
    {
        return 'create_meta_ad_proposal';
    }

    protected function platform(): string
    {
        return 'meta';
    }

    protected function platformLabel(): string
    {
        return 'Meta';
    }
}
