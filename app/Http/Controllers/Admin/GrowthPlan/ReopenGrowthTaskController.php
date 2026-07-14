<?php

namespace App\Http\Controllers\Admin\GrowthPlan;

use App\Http\Controllers\Controller;
use App\Models\GrowthAction;
use App\Models\GrowthTask;
use Illuminate\Http\RedirectResponse;

/**
 * Put a closed or dropped task back. Every close in this system is a claim, and a claim can be wrong —
 * a report can observe something that did not actually mean the work landed, and a person can confirm a
 * task by mistake.
 *
 * The evidence that closed it is cleared with it. A reopened task carrying the reasoning that closed it
 * would read as a task somebody had already finished.
 */
class ReopenGrowthTaskController extends Controller
{
    public function __invoke(GrowthTask $growthTask): RedirectResponse
    {
        if ($growthTask->isOpen()) {
            return back()->with('error', 'Esa tarea ya está abierta.');
        }

        $growthTask->update([
            'status' => GrowthTask::STATUS_OPEN,
            'closed_at' => null,
            'closed_by' => null,
            'close_evidence' => null,
            'drop_reason' => null,
        ]);

        $growthTask->action->update([
            'status' => GrowthAction::STATUS_OPEN,
            'closed_at' => null,
        ]);

        return back()->with('success', 'Tarea reabierta.');
    }
}
