<?php

use App\Models\GrowthAction;
use App\Models\GrowthTask;
use App\Models\User;

function taskShowAdmin(): User
{
    return User::factory()->create(['role' => 'admin', 'name' => 'Elena']);
}

it('keeps the task details page behind the admin role', function () {
    $task = GrowthTask::factory()->create();

    $this->actingAs(User::factory()->create(['role' => 'customer']))
        ->get("/admin/growth-plan/tasks/{$task->id}")
        ->assertForbidden();
});

it('renders the task whole with the column its state means', function () {
    $action = GrowthAction::factory()->create(['name' => 'Publicar en el blog']);
    $task = GrowthTask::factory()->for($action, 'action')->started()->create([
        'name' => 'Escribir la guía de cuidado',
        'body' => 'El cuerpo entero, con los hechos etiquetados.',
    ]);

    $this->actingAs(taskShowAdmin())
        ->get("/admin/growth-plan/tasks/{$task->id}")
        ->assertInertia(fn ($page) => $page
            ->component('admin/growth-plan/Task')
            ->where('task.id', $task->id)
            ->where('task.name', 'Escribir la guía de cuidado')
            ->where('task.body', 'El cuerpo entero, con los hechos etiquetados.')
            ->where('task.action', 'Publicar en el blog')
            ->where('task.status', GrowthTask::STATUS_OPEN)
            ->where('task.column', GrowthTask::COLUMN_IN_PROGRESS));
});

it('surfaces the closure proposal so a person can decide from the details page', function () {
    $task = GrowthTask::factory()->started()->closureProposed()->create();

    $this->actingAs(taskShowAdmin())
        ->get("/admin/growth-plan/tasks/{$task->id}")
        ->assertInertia(fn ($page) => $page
            ->component('admin/growth-plan/Task')
            ->where('task.closure_proposed', true)
            ->where('task.column', GrowthTask::COLUMN_REVIEW)
            ->whereNot('task.closure_proposal_reason', null));
});

it('shows a dropped task with its drop reason and no board column', function () {
    $task = GrowthTask::factory()->dropped()->create(['drop_reason' => 'Ya no aplica.']);

    $this->actingAs(taskShowAdmin())
        ->get("/admin/growth-plan/tasks/{$task->id}")
        ->assertInertia(fn ($page) => $page
            ->component('admin/growth-plan/Task')
            ->where('task.status', GrowthTask::STATUS_DROPPED)
            ->where('task.column', null)
            ->where('task.drop_reason', 'Ya no aplica.'));
});
