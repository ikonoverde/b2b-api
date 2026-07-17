<?php

use App\Ai\Tools\Growth\UpdateGrowthTask;
use App\Models\GrowthTask;
use Laravel\Ai\Tools\Request;

/**
 * @param  array<string, mixed>  $arguments
 * @return array<string, mixed>
 */
function updateGrowthTask(array $arguments = []): array
{
    return json_decode((string) app(UpdateGrowthTask::class)->handle(new Request($arguments)), true);
}

it('edits the name, body, and agent of an open task by slug', function () {
    $task = GrowthTask::factory()->create([
        'slug' => 'post-aceites-de-masaje',
        'name' => 'Escribir la guía',
        'body' => 'El cuerpo viejo.',
        'agent' => GrowthTask::AGENT_CONTENT,
    ]);

    $payload = updateGrowthTask([
        'slug' => 'post-aceites-de-masaje',
        'name' => 'Escribir la guía de aceites de masaje',
        'body' => 'El cuerpo nuevo, con los hechos etiquetados.',
        'agent' => GrowthTask::AGENT_KEYWORDS,
    ]);

    expect($payload['outcome'])->toBe('updated')
        ->and($payload['agent'])->toBe('keywords');

    expect($task->fresh())
        ->name->toBe('Escribir la guía de aceites de masaje')
        ->body->toBe('El cuerpo nuevo, con los hechos etiquetados.')
        ->agent->toBe(GrowthTask::AGENT_KEYWORDS);
});

it('edits a task located by id', function () {
    $task = GrowthTask::factory()->create(['name' => 'Antes']);

    updateGrowthTask(['id' => $task->id, 'name' => 'Después']);

    expect($task->fresh()->name)->toBe('Después');
});

it('changes only the fields it is given', function () {
    $task = GrowthTask::factory()->create([
        'name' => 'El nombre',
        'body' => 'El cuerpo original.',
    ]);

    updateGrowthTask(['id' => $task->id, 'name' => 'Nombre nuevo']);

    expect($task->fresh())
        ->name->toBe('Nombre nuevo')
        ->body->toBe('El cuerpo original.');
});

it('refuses an update that names no task', function () {
    expect(updateGrowthTask(['name' => 'Sin destino'])['error'])
        ->toContain('Name the task to update by id or slug');
});

it('refuses an update that changes nothing', function () {
    $task = GrowthTask::factory()->create();

    expect(updateGrowthTask(['id' => $task->id])['error'])
        ->toContain('Send at least one of name, body, or agent');
});

it('explains itself when the task does not exist', function () {
    expect(updateGrowthTask(['slug' => 'no-existe', 'name' => 'x'])['error'])
        ->toContain("No growth task exists with slug 'no-existe'");

    expect(updateGrowthTask(['id' => 9999, 'name' => 'x'])['error'])
        ->toContain('No growth task exists with id 9999');
});

it('rejects an agent outside the allowed list', function () {
    $task = GrowthTask::factory()->create();

    expect(updateGrowthTask(['id' => $task->id, 'agent' => 'brand'])['error'])
        ->toContain('must be assigned to one of');
});

/**
 * A settled task is a historical record. Editing its body after the fact would let the next run read a
 * changed story as the original one, so lifecycle changes belong to the verified plan path or a human.
 */
it('refuses to edit a task that is already closed', function () {
    $task = GrowthTask::factory()->closedByReport()->create(['slug' => 'ya-cerrada']);

    expect(updateGrowthTask(['slug' => 'ya-cerrada', 'name' => 'nuevo'])['error'])
        ->toContain("Growth task 'ya-cerrada' is done, not open");

    expect($task->fresh()->name)->not->toBe('nuevo');
});

it('refuses to edit a task that was dropped', function () {
    GrowthTask::factory()->dropped()->create(['slug' => 'descartada']);

    expect(updateGrowthTask(['slug' => 'descartada', 'body' => 'x'])['error'])
        ->toContain('is dropped, not open');
});

it('cannot close a task: it has no status field to set', function () {
    $task = GrowthTask::factory()->create(['status' => GrowthTask::STATUS_OPEN]);

    updateGrowthTask(['id' => $task->id, 'name' => 'sigue abierta', 'status' => GrowthTask::STATUS_DONE]);

    expect($task->fresh())
        ->status->toBe(GrowthTask::STATUS_OPEN)
        ->name->toBe('sigue abierta');
});
