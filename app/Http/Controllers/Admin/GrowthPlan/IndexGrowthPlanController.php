<?php

namespace App\Http\Controllers\Admin\GrowthPlan;

use App\Http\Controllers\Controller;
use App\Models\GrowthAction;
use App\Models\GrowthPlan;
use App\Models\GrowthTask;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The standing plan: what is outstanding, who it is assigned to, and where the paid gate sits.
 *
 * The runs underneath are the record of how it got there, and they are secondary. What an admin comes
 * here to do is work the open tasks and decide the closures an agent could not prove.
 */
class IndexGrowthPlanController extends Controller
{
    public function __invoke(): Response
    {
        $current = GrowthPlan::current();

        $actions = GrowthAction::query()
            ->with([
                'tasks' => fn ($query) => $query->orderBy('status')->orderBy('id'),
                'tasks.sourceReport:id,reported_on',
            ])
            ->orderByRaw('CASE WHEN status = ? THEN 0 ELSE 1 END', [GrowthAction::STATUS_OPEN])
            ->orderByDesc('id')
            ->get();

        $runs = GrowthPlan::query()
            ->with('sourceReport:id,reported_on')
            ->withCount(['createdActions', 'createdTasks'])
            ->orderByDesc('planned_on')
            ->orderByDesc('id')
            ->limit(20)
            ->get();

        return Inertia::render('admin/growth-plan/Index', [
            'paidGate' => $current === null ? null : [
                'verdict' => $current->paid_gate,
                'reason' => $current->paid_gate_reason,
                'preconditions' => $current->paid_gate_preconditions ?? [],
                'decided_on' => $current->planned_on->toDateString(),
            ],
            'actions' => $actions->map(fn (GrowthAction $action): array => [
                'id' => $action->id,
                'slug' => $action->slug,
                'name' => $action->name,
                'summary' => $action->summary,
                'status' => $action->status,
                'tasks' => $action->tasks->map(fn (GrowthTask $task): array => [
                    'id' => $task->id,
                    'slug' => $task->slug,
                    'name' => $task->name,
                    'body' => $task->body,
                    'agent' => $task->agent,
                    'status' => $task->status,
                    'source_report' => $task->sourceReport?->reported_on->toDateString(),
                    'closed_at' => $task->closed_at?->toISOString(),
                    'closed_by' => $task->closed_by,
                    'close_evidence' => $task->close_evidence,
                    'drop_reason' => $task->drop_reason,
                    'closure_proposed' => $task->hasProposedClosure(),
                    'closure_proposal_reason' => $task->closure_proposal_reason,
                ])->all(),
            ])->all(),
            'runs' => $runs->map(fn (GrowthPlan $plan): array => [
                'id' => $plan->id,
                'planned_on' => $plan->planned_on->toDateString(),
                'source_report' => $plan->sourceReport->reported_on->toDateString(),
                'paid_gate' => $plan->paid_gate,
                'created_actions_count' => $plan->created_actions_count,
                'created_tasks_count' => $plan->created_tasks_count,
            ])->all(),
            'awaitingDecisionCount' => GrowthTask::query()->awaitingClosureDecision()->count(),
        ]);
    }
}
