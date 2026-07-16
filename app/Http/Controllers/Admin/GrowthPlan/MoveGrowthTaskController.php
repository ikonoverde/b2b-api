<?php

namespace App\Http\Controllers\Admin\GrowthPlan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GrowthPlan\MoveGrowthTaskRequest;
use App\Models\GrowthTask;
use App\Services\Growth\GrowthPlanService;
use Illuminate\Http\RedirectResponse;

/**
 * A card moved on the kanban board. Every column is a claim, so every drag is a state change with the
 * same meaning it has everywhere else in this system — nothing here invents a new way for a task to be
 * open or closed.
 *
 * Dragging into Hecha is a human close, the same claim the confirm button makes, recorded the same way.
 * Dragging into Revisión is a person flagging the task for a closure decision, kept apart from an
 * agent's proposal only by the reason on it. Dragging a closed task back out is a reopen, and the
 * evidence that closed it leaves with it.
 */
class MoveGrowthTaskController extends Controller
{
    public function __construct(private GrowthPlanService $plans) {}

    public function __invoke(MoveGrowthTaskRequest $request, GrowthTask $growthTask): RedirectResponse
    {
        $column = $request->validated('column');

        if ($growthTask->boardColumn() === $column) {
            return back();
        }

        match ($column) {
            GrowthTask::COLUMN_TODO => $this->reopen($growthTask, started: false),
            GrowthTask::COLUMN_IN_PROGRESS => $this->reopen($growthTask, started: true),
            GrowthTask::COLUMN_REVIEW => $this->sendToReview($growthTask, $request->user()->name),
            GrowthTask::COLUMN_DONE => $this->closeAsHuman($growthTask, $request->user()->name),
        };

        /** The action's state is bookkeeping over its tasks, in both directions, on every move. */
        $this->plans->closeActionIfFinished($growthTask->action);

        return back()->with('success', match ($column) {
            GrowthTask::COLUMN_TODO => 'Tarea de vuelta en Por hacer.',
            GrowthTask::COLUMN_IN_PROGRESS => 'Tarea en curso.',
            GrowthTask::COLUMN_REVIEW => 'Tarea en revisión. Sigue abierta hasta que alguien confirme el cierre.',
            GrowthTask::COLUMN_DONE => 'Tarea cerrada. Queda registrada como cerrada por una persona, no por el reporte.',
        });
    }

    /**
     * To Do and In Progress are the same state — open work — split by whether somebody picked it up. A
     * closed or dropped task dragged here is being reopened, and the evidence that closed it is cleared
     * with it, exactly as the reopen button does.
     */
    private function reopen(GrowthTask $growthTask, bool $started): void
    {
        $growthTask->update([
            'status' => GrowthTask::STATUS_OPEN,
            'started_at' => $started ? ($growthTask->started_at ?? now()) : null,
            'closed_at' => null,
            'closed_by' => null,
            'close_evidence' => null,
            'drop_reason' => null,
            'closure_proposed_at' => null,
            'closure_proposal_reason' => null,
            'closure_proposed_by_growth_plan_id' => null,
        ]);
    }

    /**
     * Review is not a soft Done: the task stays open, and only the confirm gate can close it. The
     * proposal records who flagged it, so it never reads as a claim an agent made.
     */
    private function sendToReview(GrowthTask $growthTask, string $userName): void
    {
        $growthTask->update([
            'status' => GrowthTask::STATUS_OPEN,
            'closed_at' => null,
            'closed_by' => null,
            'close_evidence' => null,
            'drop_reason' => null,
            'closure_proposed_at' => now(),
            'closure_proposal_reason' => sprintf('%s la puso en revisión desde el tablero.', $userName),
            'closure_proposed_by_growth_plan_id' => null,
        ]);
    }

    /**
     * The same claim ConfirmGrowthTaskClosureController records: a person said the work is done. It is
     * closed_by = human for as long as the row exists, distinguishable from a close a report measured.
     */
    private function closeAsHuman(GrowthTask $growthTask, string $userName): void
    {
        $growthTask->update([
            'status' => GrowthTask::STATUS_DONE,
            'closed_at' => now(),
            'closed_by' => GrowthTask::CLOSED_BY_HUMAN,
            'close_evidence' => sprintf('%s la movió a Hecha en el tablero.', $userName),
            'drop_reason' => null,
            'closure_proposed_at' => null,
            'closure_proposal_reason' => null,
            'closure_proposed_by_growth_plan_id' => null,
        ]);
    }
}
