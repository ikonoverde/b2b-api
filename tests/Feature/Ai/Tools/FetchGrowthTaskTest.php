<?php

use App\Ai\Tools\Growth\FetchGrowthTask;
use App\Models\GrowthAction;
use App\Models\GrowthTask;
use App\Services\Growth\GrowthPlanService;
use Laravel\Ai\Tools\Request;

/**
 * @param  array<string, mixed>  $arguments
 * @return array<string, mixed>
 */
function fetchGrowthTask(array $arguments = []): array
{
    return json_decode((string) app(FetchGrowthTask::class)->handle(new Request($arguments)), true);
}

it('lists the open content tasks with the action each one serves', function () {
    $action = GrowthAction::factory()->create([
        'name' => 'Build the pre-launch content library',
        'summary' => 'Rank for professional buying questions before launch.',
    ]);

    GrowthTask::factory()->for($action, 'action')->create([
        'slug' => 'post-aceites-de-masaje',
        'name' => 'Escribir la guía de aceites de masaje',
    ]);

    $payload = fetchGrowthTask();

    expect($payload['agent'])->toBe('content')
        ->and($payload['open_tasks'])->toHaveCount(1)
        ->and($payload['open_tasks'][0]['slug'])->toBe('post-aceites-de-masaje')
        ->and($payload['open_tasks'][0]['status'])->toBe('open')
        ->and($payload['open_tasks'][0]['action']['name'])->toBe('Build the pre-launch content library');
});

it('reads a single task by slug', function () {
    GrowthTask::factory()->create([
        'slug' => 'post-aceites-de-masaje',
        'body' => '## Why\n\nTherapists choose an oil by slip.',
    ]);

    $payload = fetchGrowthTask(['slug' => 'post-aceites-de-masaje']);

    expect($payload['task']['slug'])->toBe('post-aceites-de-masaje')
        ->and($payload['task']['body'])->toContain('Therapists choose an oil by slip')
        ->and($payload['task']['action'])->toHaveKey('summary');
});

it('reads a single task by id', function () {
    $task = GrowthTask::factory()->create([
        'slug' => 'post-aceites-de-masaje',
        'body' => '## Why\n\nTherapists choose an oil by slip.',
    ]);

    $payload = fetchGrowthTask(['id' => $task->id]);

    expect($payload['task']['slug'])->toBe('post-aceites-de-masaje')
        ->and($payload['task']['body'])->toContain('Therapists choose an oil by slip')
        ->and($payload['task']['action'])->toHaveKey('summary');
});

it('lets an id take precedence over a slug', function () {
    $wanted = GrowthTask::factory()->create(['slug' => 'la-que-quiero']);
    GrowthTask::factory()->create(['slug' => 'la-otra']);

    expect(fetchGrowthTask(['id' => $wanted->id, 'slug' => 'la-otra'])['task']['slug'])
        ->toBe('la-que-quiero');
});

it('refuses a task fetched by id that belongs to another specialist', function () {
    $task = GrowthTask::factory()->agent(GrowthTask::AGENT_PAID_ACQUISITION)->create([
        'slug' => 'campana-de-retargeting',
    ]);

    expect(fetchGrowthTask(['id' => $task->id])['error'])
        ->toContain('assigned to paid-acquisition, not to content');
});

it('explains itself when the id matches nothing', function () {
    expect(fetchGrowthTask(['id' => 9999])['error'])
        ->toContain('No growth task exists with id 9999');
});

/**
 * The scope is the point of the tool. A task assigned to a person is blocked on a body, a credential,
 * or a signature, and an agent handed one produces a plausible substitute rather than failing.
 */
it('refuses to hand over a task assigned to a person', function () {
    GrowthTask::factory()->agent(GrowthTask::AGENT_HUMAN)->create([
        'slug' => 'fotografiar-los-productos',
    ]);

    $payload = fetchGrowthTask(['slug' => 'fotografiar-los-productos']);

    expect($payload)->not->toHaveKey('task')
        ->and($payload['error'])->toContain('assigned to human, not to content')
        ->and($payload['error'])->toContain('do not produce a substitute');
});

it('refuses to hand over another specialist task', function () {
    GrowthTask::factory()->agent(GrowthTask::AGENT_PAID_ACQUISITION)->create([
        'slug' => 'campana-de-retargeting',
    ]);

    expect(fetchGrowthTask(['slug' => 'campana-de-retargeting'])['error'])
        ->toContain('assigned to paid-acquisition, not to content');
});

it('shows only the open content tasks, never another agent work or closed work', function () {
    GrowthTask::factory()->create(['slug' => 'abierta-de-contenido']);
    GrowthTask::factory()->closedByReport()->create(['slug' => 'ya-cerrada']);
    GrowthTask::factory()->dropped()->create(['slug' => 'descartada']);
    GrowthTask::factory()->agent(GrowthTask::AGENT_SOCIAL_MEDIA)->create(['slug' => 'reel-de-instagram']);
    GrowthTask::factory()->agent(GrowthTask::AGENT_HUMAN)->create(['slug' => 'fotografiar-los-productos']);

    $slugs = array_column(fetchGrowthTask()['open_tasks'], 'slug');

    expect($slugs)->toBe(['abierta-de-contenido']);
});

/**
 * A task an agent asked to close is still open, and still the agent's to finish. Hiding it because the
 * closure was proposed would let a refused close read as a completed task.
 */
it('still shows a task whose closure was proposed and not granted', function () {
    GrowthTask::factory()->closureProposed()->create(['slug' => 'post-aceites-de-masaje']);

    $payload = fetchGrowthTask();

    expect($payload['open_tasks'])->toHaveCount(1)
        ->and($payload['open_tasks'][0]['closure_proposed'])->toBeTrue()
        ->and($payload['open_tasks'][0]['status'])->toBe('open');
});

it('says the empty list is empty rather than inviting invented work', function () {
    $payload = fetchGrowthTask();

    expect($payload['open_tasks'])->toBe([])
        ->and($payload['note'])->toContain('not an instruction to invent some');
});

it('explains itself when the slug matches nothing', function () {
    expect(fetchGrowthTask(['slug' => 'no-existe'])['error'])
        ->toContain("No growth task exists with slug 'no-existe'");
});

/**
 * The growth strategist coordinates rather than executes, so it holds the tool with a null scope and
 * reads across every specialist's lane.
 */
it('lists open tasks for every agent when the scope is null', function () {
    GrowthTask::factory()->create(['slug' => 'abierta-de-contenido']);
    GrowthTask::factory()->agent(GrowthTask::AGENT_SOCIAL_MEDIA)->create(['slug' => 'reel-de-instagram']);
    GrowthTask::factory()->agent(GrowthTask::AGENT_HUMAN)->create(['slug' => 'fotografiar-los-productos']);
    GrowthTask::factory()->closedByReport()->create(['slug' => 'ya-cerrada']);

    $tool = new FetchGrowthTask(app(GrowthPlanService::class), null);
    $payload = json_decode((string) $tool->handle(new Request([])), true);

    expect($payload['agent'])->toBe('all')
        ->and(array_column($payload['open_tasks'], 'slug'))
        ->toEqualCanonicalizing(['abierta-de-contenido', 'reel-de-instagram', 'fotografiar-los-productos'])
        ->and(array_column($payload['open_tasks'], 'agent'))->toContain('social-media', 'human', 'content');
});

it('reads any agent single task when the scope is null', function () {
    $task = GrowthTask::factory()->agent(GrowthTask::AGENT_PAID_ACQUISITION)->create([
        'slug' => 'campana-de-retargeting',
    ]);

    $tool = new FetchGrowthTask(app(GrowthPlanService::class), null);

    $bySlug = json_decode((string) $tool->handle(new Request(['slug' => 'campana-de-retargeting'])), true);
    $byId = json_decode((string) $tool->handle(new Request(['id' => $task->id])), true);

    expect($bySlug)->not->toHaveKey('error')
        ->and($bySlug['agent'])->toBe('paid-acquisition')
        ->and($bySlug['task']['slug'])->toBe('campana-de-retargeting')
        ->and($byId['task']['slug'])->toBe('campana-de-retargeting');
});

/**
 * The assignee is a constructor argument so another specialist can hold the same tool, and each one
 * still sees only its own work.
 */
it('scopes to whichever agent holds the tool', function () {
    GrowthTask::factory()->create(['slug' => 'abierta-de-contenido']);
    GrowthTask::factory()->agent(GrowthTask::AGENT_SOCIAL_MEDIA)->create(['slug' => 'reel-de-instagram']);

    $tool = new FetchGrowthTask(app(GrowthPlanService::class), GrowthTask::AGENT_SOCIAL_MEDIA);

    $payload = json_decode((string) $tool->handle(new Request([])), true);

    expect($payload['agent'])->toBe('social-media')
        ->and(array_column($payload['open_tasks'], 'slug'))->toBe(['reel-de-instagram']);
});
