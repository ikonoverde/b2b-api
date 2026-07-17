<?php

namespace App\Http\Controllers\Admin\GrowthPlan;

use App\Http\Controllers\Controller;
use App\Models\Artifact;
use App\Models\GrowthTask;
use Inertia\Inertia;
use Inertia\Response;

/**
 * One task, whole: the body an agent must read before picking it up, where it sits on the board, and
 * the closure state that decides which controls the page offers. Reached by clicking a card.
 */
class ShowGrowthTaskController extends Controller
{
    public function __invoke(GrowthTask $growthTask): Response
    {
        $growthTask->load(['action:id,name,slug', 'sourceReport:id,reported_on']);

        return Inertia::render('admin/growth-plan/Task', [
            'task' => [
                'id' => $growthTask->id,
                'slug' => $growthTask->slug,
                'name' => $growthTask->name,
                'body' => $growthTask->body,
                'agent' => $growthTask->agent,
                'action' => $growthTask->action->name,
                'status' => $growthTask->status,
                'column' => $growthTask->boardColumn(),
                'source_report' => $growthTask->sourceReport?->reported_on->toDateString(),
                'started_at' => $growthTask->started_at?->toISOString(),
                'closed_at' => $growthTask->closed_at?->toISOString(),
                'closed_by' => $growthTask->closed_by,
                'close_evidence' => $growthTask->close_evidence,
                'closure_proposed' => $growthTask->hasProposedClosure(),
                'closure_proposal_reason' => $growthTask->closure_proposal_reason,
                'drop_reason' => $growthTask->drop_reason,
                'artifacts' => $growthTask->artifacts()
                    ->map(fn (Artifact $artifact): array => [
                        'type' => class_basename($artifact),
                        'label' => $artifact->artifactLabel(),
                        'title' => $artifact->artifactTitle(),
                        'url' => $artifact->adminUrl(),
                        'created_at' => $artifact->created_at?->toISOString(),
                    ])
                    ->all(),
            ],
        ]);
    }
}
