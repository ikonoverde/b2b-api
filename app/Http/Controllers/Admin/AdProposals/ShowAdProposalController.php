<?php

namespace App\Http\Controllers\Admin\AdProposals;

use App\Http\Controllers\Controller;
use App\Models\AdProposal;
use App\Services\Ads\AdProposalPreviewer;
use Inertia\Inertia;
use Inertia\Response;

class ShowAdProposalController extends Controller
{
    public function __construct(protected AdProposalPreviewer $previewer) {}

    public function __invoke(AdProposal $adProposal): Response
    {
        return Inertia::render('admin/ad-proposals/Show', [
            'proposal' => [
                'id' => $adProposal->id,
                'platform' => $adProposal->platform,
                'name' => $adProposal->name,
                'objective' => $adProposal->objective,
                'status' => $adProposal->status,
                'budget_amount' => $adProposal->budget_amount,
                'budget_period' => $adProposal->budget_period,
                'currency' => $adProposal->currency,
                'start_date' => $adProposal->start_date?->toDateString(),
                'end_date' => $adProposal->end_date?->toDateString(),
                'audience' => $adProposal->audience,
                'geography' => $adProposal->geography,
                'landing_page_url' => $adProposal->landing_page_url,
                'offer' => $adProposal->offer,
                'campaign_structure' => $adProposal->campaign_structure,
                'ad_groups' => $adProposal->ad_groups,
                'keywords' => $adProposal->keywords,
                'negative_keywords' => $adProposal->negative_keywords,
                'tracking_plan' => $adProposal->tracking_plan,
                'success_metrics' => $adProposal->success_metrics,
                'assumptions' => $adProposal->assumptions,
                'notes' => $adProposal->notes,
                'created_by_agent' => $adProposal->created_by_agent,
                'created_at' => $adProposal->created_at?->toISOString(),
            ],
            'preview' => $this->previewer->preview($adProposal),
        ]);
    }
}
