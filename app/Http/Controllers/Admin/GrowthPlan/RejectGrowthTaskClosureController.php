<?php

namespace App\Http\Controllers\Admin\GrowthPlan;

use App\Http\Controllers\Controller;
use App\Models\GrowthTask;
use Illuminate\Http\RedirectResponse;

/**
 * The agent thought the task was done and a person disagrees. The proposal is cleared and the task goes
 * back to being what it always was: open work.
 */
class RejectGrowthTaskClosureController extends Controller
{
    public function __invoke(GrowthTask $growthTask): RedirectResponse
    {
        if (! $growthTask->hasProposedClosure()) {
            return back()->with('error', 'Esa tarea no tiene una propuesta de cierre pendiente.');
        }

        $growthTask->update([
            'closure_proposed_at' => null,
            'closure_proposal_reason' => null,
            'closure_proposed_by_growth_plan_id' => null,
        ]);

        return back()->with('success', 'Propuesta descartada. La tarea sigue abierta.');
    }
}
