<?php

namespace App\Http\Controllers\Admin\GrowthPlan;

use App\Http\Controllers\Controller;
use App\Models\GrowthTask;
use App\Services\Growth\GrowthPlanService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * A person says the work is done.
 *
 * This is the second of the only two things that can close a task, and the reason the first one — a
 * report that observed it — is not enough on its own: most work is not visible in GA4 or the Graph API,
 * and somebody has to say so. It is recorded as closed_by = human, and it stays distinguishable from a
 * measured close for as long as the row exists.
 */
class ConfirmGrowthTaskClosureController extends Controller
{
    public function __construct(private GrowthPlanService $plans) {}

    public function __invoke(Request $request, GrowthTask $growthTask): RedirectResponse
    {
        if (! $growthTask->isOpen()) {
            return back()->with('error', 'Esa tarea ya no está abierta.');
        }

        $growthTask->update([
            'status' => GrowthTask::STATUS_DONE,
            'closed_at' => now(),
            'closed_by' => GrowthTask::CLOSED_BY_HUMAN,
            'close_evidence' => sprintf('%s confirmó que el trabajo se hizo.', $request->user()->name),
            'closure_proposed_at' => null,
            'closure_proposal_reason' => null,
            'closure_proposed_by_growth_plan_id' => null,
        ]);

        /** Closing the last open task finishes its action, the same as a report-measured close does. */
        $this->plans->closeActionIfFinished($growthTask->action);

        return back()->with('success', 'Tarea cerrada. Queda registrada como cerrada por una persona, no por el reporte.');
    }
}
