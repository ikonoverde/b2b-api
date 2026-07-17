<?php

use App\Jobs\ExecuteGrowthTask;
use App\Models\GrowthAction;
use App\Models\GrowthTask;
use App\Models\User;
use Illuminate\Support\Facades\Queue;

beforeEach(function () {
    Queue::fake();
});

function boardAdmin(): User
{
    return User::factory()->create(['role' => 'admin', 'name' => 'Elena']);
}

it('keeps the board behind the admin role', function (string $method, string $path) {
    $task = GrowthTask::factory()->create();
    $path = str_replace('{task}', (string) $task->id, $path);

    $this->actingAs(User::factory()->create(['role' => 'customer']))
        ->{$method}($path)
        ->assertForbidden();
})->with([
    ['get', '/admin/growth-plan/board'],
    ['post', '/admin/growth-plan/tasks/{task}/move'],
]);

/**
 * The columns are a reading of state the system already keeps, so each state lands on exactly one
 * column and a dropped task lands on none.
 */
it('groups every task onto the column its state means', function () {
    GrowthTask::factory()->create(['name' => 'Sin tomar']);
    GrowthTask::factory()->started()->create(['name' => 'En curso']);
    GrowthTask::factory()->closureProposed()->create(['name' => 'En duda']);
    GrowthTask::factory()->closedByReport()->create(['name' => 'Medida']);
    GrowthTask::factory()->dropped()->create(['name' => 'Descartada']);

    $this->actingAs(boardAdmin())
        ->get('/admin/growth-plan/board')
        ->assertInertia(fn ($page) => $page
            ->component('admin/growth-plan/Board')
            ->where('columns.todo.0.name', 'Sin tomar')
            ->where('columns.in_progress.0.name', 'En curso')
            ->where('columns.review.0.name', 'En duda')
            ->where('columns.done.0.name', 'Medida')
            ->has('columns.todo', 1)
            ->has('columns.in_progress', 1)
            ->has('columns.review', 1)
            ->has('columns.done', 1));
});

it('marks a task as picked up when it moves into En curso', function () {
    $task = GrowthTask::factory()->create();

    $this->actingAs(boardAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/move", ['column' => 'in_progress'])
        ->assertRedirect();

    $task->refresh();

    expect($task->started_at)->not->toBeNull()
        ->and($task->status)->toBe(GrowthTask::STATUS_OPEN);
});

it('puts a task back to nobody-took-it when it moves into Por hacer', function () {
    $task = GrowthTask::factory()->started()->create();

    $this->actingAs(boardAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/move", ['column' => 'todo']);

    expect($task->refresh()->started_at)->toBeNull();
});

/**
 * Dropping a card on Hecha is the same claim the confirm button makes — a person said the work is done
 * — and it must be recorded the same way, rolled up to the action the same way.
 */
it('closes a task as a human close when it moves into Hecha', function () {
    $action = GrowthAction::factory()->create();
    $task = GrowthTask::factory()->for($action, 'action')->started()->create();

    $this->actingAs(boardAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/move", ['column' => 'done'])
        ->assertRedirect();

    $task->refresh();

    expect($task->status)->toBe(GrowthTask::STATUS_DONE)
        ->and($task->closed_by)->toBe(GrowthTask::CLOSED_BY_HUMAN)
        ->and($task->close_evidence)->toContain('Elena')
        ->and($action->refresh()->status)->toBe(GrowthAction::STATUS_DONE);
});

/**
 * Every close in this system is a claim and a claim can be wrong. Dragging a closed card back out is a
 * reopen: the evidence leaves with it, and the action comes back open.
 */
it('reopens a closed task dragged out of Hecha and clears the evidence that closed it', function () {
    $action = GrowthAction::factory()->done()->create();
    $task = GrowthTask::factory()->for($action, 'action')->closedByReport()->create();

    $this->actingAs(boardAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/move", ['column' => 'todo']);

    $task->refresh();

    expect($task->status)->toBe(GrowthTask::STATUS_OPEN)
        ->and($task->closed_by)->toBeNull()
        ->and($task->close_evidence)->toBeNull()
        ->and($action->refresh()->status)->toBe(GrowthAction::STATUS_OPEN);
});

/**
 * En revisión does not close anything. It records that a person flagged the task for a closure
 * decision, under their name, and the task stays open until the confirm gate acts.
 */
it('leaves a task open with a named proposal when it moves into En revisión', function () {
    $task = GrowthTask::factory()->started()->create();

    $this->actingAs(boardAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/move", ['column' => 'review']);

    $task->refresh();

    expect($task->status)->toBe(GrowthTask::STATUS_OPEN)
        ->and($task->hasProposedClosure())->toBeTrue()
        ->and($task->closure_proposal_reason)->toContain('Elena');
});

it('withdraws the closure proposal when a card leaves En revisión for En curso', function () {
    $task = GrowthTask::factory()->started()->closureProposed()->create();

    $this->actingAs(boardAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/move", ['column' => 'in_progress']);

    $task->refresh();

    expect($task->hasProposedClosure())->toBeFalse()
        ->and($task->closure_proposal_reason)->toBeNull()
        ->and($task->started_at)->not->toBeNull();
});

it('does nothing when a card is dropped on the column it is already in', function () {
    $task = GrowthTask::factory()->started()->create();
    $startedAt = $task->started_at;

    $this->actingAs(boardAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/move", ['column' => 'in_progress'])
        ->assertRedirect();

    expect($task->refresh()->started_at->toISOString())->toBe($startedAt->toISOString());
});

/**
 * The drag into En curso is more than bookkeeping when the assignee is an agent: it is the instruction
 * to execute, and the job that carries it is dispatched right there.
 */
it('puts the assigned agent to work when its task moves into En curso', function () {
    $task = GrowthTask::factory()->agent(GrowthTask::AGENT_SOCIAL_MEDIA)->create();

    $this->actingAs(boardAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/move", ['column' => 'in_progress'])
        ->assertRedirect();

    Queue::assertPushed(ExecuteGrowthTask::class, fn (ExecuteGrowthTask $job): bool => $job->task->is($task));
});

it('dispatches no agent for a task no agent can execute', function (string $agent) {
    $task = GrowthTask::factory()->agent($agent)->create();

    $this->actingAs(boardAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/move", ['column' => 'in_progress'])
        ->assertRedirect();

    expect($task->refresh()->started_at)->not->toBeNull();

    Queue::assertNotPushed(ExecuteGrowthTask::class);
})->with([
    'human' => GrowthTask::AGENT_HUMAN,
    'generic' => GrowthTask::AGENT_GENERIC,
]);

it('dispatches nothing when a card moves anywhere but En curso', function (string $column) {
    $task = GrowthTask::factory()->started()->create();

    $this->actingAs(boardAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/move", ['column' => $column]);

    Queue::assertNotPushed(ExecuteGrowthTask::class);
})->with(['todo', 'review', 'done']);

it('does not re-dispatch when a card is dropped on En curso where it already sits', function () {
    $task = GrowthTask::factory()->started()->create();

    $this->actingAs(boardAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/move", ['column' => 'in_progress'])
        ->assertRedirect();

    Queue::assertNotPushed(ExecuteGrowthTask::class);
});

it('rejects a column the board does not have', function () {
    $task = GrowthTask::factory()->create();

    $this->actingAs(boardAdmin())
        ->post("/admin/growth-plan/tasks/{$task->id}/move", ['column' => 'blocked'])
        ->assertSessionHasErrors('column');

    expect($task->refresh()->status)->toBe(GrowthTask::STATUS_OPEN);
});
