<?php

use App\Models\AdProposal;
use App\Models\Banner;
use App\Models\BlogPost;
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

it('lists generated artifacts newest first, with a link where one exists and none where it does not', function () {
    $task = GrowthTask::factory()->create();
    $post = BlogPost::factory()->create([
        'growth_task_id' => $task->id,
        'title' => 'Guía de aceites',
        'created_at' => now()->subDay(),
    ]);
    Banner::factory()->create(['growth_task_id' => $task->id, 'title' => 'Promo 5L', 'created_at' => now()]);
    AdProposal::factory()->create();

    $this->actingAs(taskShowAdmin())
        ->get("/admin/growth-plan/tasks/{$task->id}")
        ->assertInertia(fn ($page) => $page
            ->component('admin/growth-plan/Task')
            ->has('task.artifacts', 2)
            ->where('task.artifacts.0.label', 'Banner')
            ->where('task.artifacts.0.title', 'Promo 5L')
            ->where('task.artifacts.0.url', null)
            ->where('task.artifacts.1.label', 'Entrada de blog')
            ->where('task.artifacts.1.title', 'Guía de aceites')
            ->where('task.artifacts.1.url', "/admin/blog-posts/{$post->id}/edit"));
});

it('exposes an empty artifacts array for a task that generated nothing', function () {
    $task = GrowthTask::factory()->create();

    $this->actingAs(taskShowAdmin())
        ->get("/admin/growth-plan/tasks/{$task->id}")
        ->assertInertia(fn ($page) => $page
            ->component('admin/growth-plan/Task')
            ->has('task.artifacts', 0));
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
