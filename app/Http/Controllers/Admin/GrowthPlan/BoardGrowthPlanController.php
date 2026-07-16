<?php

namespace App\Http\Controllers\Admin\GrowthPlan;

use App\Http\Controllers\Controller;
use App\Models\GrowthTask;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The plan's tasks as a kanban board. The columns are a reading of state the system already keeps — To
 * Do and In Progress split the open tasks by started_at, Revisión is the ones waiting on a closure
 * decision, Hecha is the closed ones — so nothing shown here can disagree with the plan page.
 *
 * Dropped tasks are on no column. They were discarded, not finished, and a board lane for them would
 * read as a place work goes to be done.
 */
class BoardGrowthPlanController extends Controller
{
    public function __invoke(): Response
    {
        $tasks = GrowthTask::query()
            ->whereIn('status', [GrowthTask::STATUS_OPEN, GrowthTask::STATUS_DONE])
            ->with(['action:id,name,slug', 'sourceReport:id,reported_on'])
            ->orderBy('id')
            ->get();

        $columns = $tasks
            ->groupBy(fn (GrowthTask $task): string => (string) $task->boardColumn())
            ->map(fn (Collection $column): array => $column
                ->sortByDesc(fn (GrowthTask $task) => $task->closed_at?->getTimestamp() ?? 0)
                ->values()
                ->map(fn (GrowthTask $task): array => [
                    'id' => $task->id,
                    'slug' => $task->slug,
                    'name' => $task->name,
                    'body' => $task->body,
                    'agent' => $task->agent,
                    'action' => $task->action->name,
                    'source_report' => $task->sourceReport?->reported_on->toDateString(),
                    'started_at' => $task->started_at?->toISOString(),
                    'closed_by' => $task->closed_by,
                    'close_evidence' => $task->close_evidence,
                    'closure_proposal_reason' => $task->closure_proposal_reason,
                ])->all());

        return Inertia::render('admin/growth-plan/Board', [
            'columns' => collect(GrowthTask::COLUMNS)
                ->mapWithKeys(fn (string $column): array => [$column => $columns->get($column, [])])
                ->all(),
        ]);
    }
}
