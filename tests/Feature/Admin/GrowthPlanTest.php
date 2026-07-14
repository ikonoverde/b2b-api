<?php

use App\Models\GrowthAction;
use App\Models\GrowthPlan;
use App\Models\GrowthTask;
use App\Models\User;

function anAdmin(): User
{
    return User::factory()->create(['role' => 'admin']);
}

it('keeps the plan behind the admin role', function (string $method, string $path) {
    $task = GrowthTask::factory()->create();
    $path = str_replace('{task}', (string) $task->id, $path);

    $this->actingAs(User::factory()->create(['role' => 'customer']))
        ->{$method}($path)
        ->assertForbidden();
})->with([
    ['get', '/admin/growth-plan'],
    ['post', '/admin/growth-plan/tasks/{task}/confirm-closure'],
    ['post', '/admin/growth-plan/tasks/{task}/reject-closure'],
    ['post', '/admin/growth-plan/tasks/{task}/reopen'],
]);

it('shows the standing plan with its paid gate verdict', function () {
    GrowthPlan::factory()->create(['paid_gate' => GrowthPlan::PAID_GATE_CLOSED]);

    $action = GrowthAction::factory()->create(['name' => 'Pre-launch content']);
    GrowthTask::factory()->for($action, 'action')->create(['name' => 'Write the oil guide']);

    $this->actingAs(anAdmin())
        ->get('/admin/growth-plan')
        ->assertInertia(fn ($page) => $page
            ->component('admin/growth-plan/Index')
            ->where('paidGate.verdict', GrowthPlan::PAID_GATE_CLOSED)
            ->where('actions.0.name', 'Pre-launch content')
            ->where('actions.0.tasks.0.name', 'Write the oil guide'));
});

it('counts the tasks waiting on a human decision', function () {
    GrowthTask::factory()->closureProposed()->create();
    GrowthTask::factory()->create();

    $this->actingAs(anAdmin())
        ->get('/admin/growth-plan')
        ->assertInertia(fn ($page) => $page->where('awaitingDecisionCount', 1));
});

/**
 * The other of the only two things that can close a task. It is recorded as a human close and stays
 * distinguishable from one a report measured — those are different claims, and the row must not lose
 * which was made.
 */
it('lets a human confirm a closure the agent could not prove', function () {
    $task = GrowthTask::factory()->closureProposed()->create();

    $this->actingAs(anAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/confirm-closure")
        ->assertRedirect();

    $task->refresh();

    expect($task->status)->toBe(GrowthTask::STATUS_DONE)
        ->and($task->closed_by)->toBe(GrowthTask::CLOSED_BY_HUMAN)
        ->and($task->closure_proposed_at)->toBeNull();
});

it('leaves the task open when a human rejects the proposal', function () {
    $task = GrowthTask::factory()->closureProposed()->create();

    $this->actingAs(anAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/reject-closure")
        ->assertRedirect();

    $task->refresh();

    // The agent was wrong. An open task nobody has done is an honest record of work outstanding.
    expect($task->status)->toBe(GrowthTask::STATUS_OPEN)
        ->and($task->closed_at)->toBeNull()
        ->and($task->closure_proposed_at)->toBeNull()
        ->and($task->closure_proposal_reason)->toBeNull();
});

it('will not confirm a closure on a task that is already closed', function () {
    $task = GrowthTask::factory()->closedByReport()->create();

    $this->actingAs(anAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/confirm-closure")
        ->assertSessionHas('error');

    expect($task->refresh()->closed_by)->toBe(GrowthTask::CLOSED_BY_REPORT);
});

it('reopens a closed task and clears the evidence that closed it', function () {
    $action = GrowthAction::factory()->done()->create();
    $task = GrowthTask::factory()->for($action, 'action')->closedByReport()->create();

    $this->actingAs(anAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/reopen")
        ->assertRedirect();

    $task->refresh();

    // A reopened task still carrying the reasoning that closed it reads as work somebody finished.
    expect($task->status)->toBe(GrowthTask::STATUS_OPEN)
        ->and($task->closed_by)->toBeNull()
        ->and($task->close_evidence)->toBeNull()
        ->and($action->refresh()->status)->toBe(GrowthAction::STATUS_OPEN);
});

it('reopens a dropped task', function () {
    $task = GrowthTask::factory()->dropped()->create();

    $this->actingAs(anAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/reopen")
        ->assertRedirect();

    expect($task->refresh()->status)->toBe(GrowthTask::STATUS_OPEN)
        ->and($task->drop_reason)->toBeNull();
});

it('reads one run with the recommendation the agent wrote', function () {
    $plan = GrowthPlan::factory()->create(['body' => "# Plan\n\nESTIMATED  Write the catalog pages.\n"]);

    GrowthTask::factory()->create(['created_by_growth_plan_id' => $plan->id]);

    $this->actingAs(anAdmin())
        ->get("/admin/growth-plan/runs/{$plan->id}")
        ->assertInertia(fn ($page) => $page
            ->component('admin/growth-plan/Show')
            ->where('plan.body', "# Plan\n\nESTIMATED  Write the catalog pages.\n")
            ->where('plan.source_report.reported_on', $plan->sourceReport->reported_on->toDateString())
            ->where('touchedTasks.0.created_here', true));
});
