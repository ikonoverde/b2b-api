<?php

namespace App\Http\Controllers\Admin\GrowthPlan;

use App\Http\Controllers\Controller;
use App\Models\GrowthPlan;
use App\Models\GrowthTask;
use Inertia\Inertia;
use Inertia\Response;

/**
 * One planning run, whole: the recommendation as the agent wrote it, the baseline it read, and what it
 * did to the plan.
 */
class ShowGrowthPlanController extends Controller
{
    public function __invoke(GrowthPlan $growthPlan): Response
    {
        $growthPlan->load('sourceReport');

        $touched = GrowthTask::query()
            ->with('action:id,name')
            ->where(fn ($query) => $query
                ->where('created_by_growth_plan_id', $growthPlan->id)
                ->orWhere('updated_by_growth_plan_id', $growthPlan->id)
                ->orWhere('closure_proposed_by_growth_plan_id', $growthPlan->id))
            ->orderBy('id')
            ->get();

        return Inertia::render('admin/growth-plan/Show', [
            'plan' => [
                'id' => $growthPlan->id,
                'planned_on' => $growthPlan->planned_on->toDateString(),
                'body' => $growthPlan->body,
                'paid_gate' => $growthPlan->paid_gate,
                'paid_gate_reason' => $growthPlan->paid_gate_reason,
                'paid_gate_preconditions' => $growthPlan->paid_gate_preconditions ?? [],
                'created_at' => $growthPlan->created_at?->toISOString(),
                'source_report' => [
                    'id' => $growthPlan->sourceReport->id,
                    'reported_on' => $growthPlan->sourceReport->reported_on->toDateString(),
                ],
            ],
            'touchedTasks' => $touched->map(fn (GrowthTask $task): array => [
                'id' => $task->id,
                'name' => $task->name,
                'action_name' => $task->action->name,
                'agent' => $task->agent,
                'status' => $task->status,
                'closure_proposed' => $task->hasProposedClosure(),
                'created_here' => $task->created_by_growth_plan_id === $growthPlan->id,
            ])->all(),
        ]);
    }
}
