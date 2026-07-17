<?php

use App\Ai\GrowthTaskContext;
use App\Ai\Tools\Reports\CreateReport;
use App\Models\GrowthTask;
use App\Models\Report;
use Laravel\Ai\Tools\Request;

/**
 * @param  array<string, mixed>  $arguments
 * @return array<string, mixed>
 */
function createReportResult(array $arguments = []): array
{
    return json_decode((string) app(CreateReport::class)->handle(new Request($arguments)), true);
}

it('files a report as an artifact', function () {
    $payload = createReportResult([
        'type' => Report::TYPE_KEYWORD_RESEARCH,
        'title' => 'Investigación de keywords: aceites de masaje',
        'summary' => 'Clúster transaccional para spas.',
        'body' => '## Clúster principal\n\n- aceite de masaje profesional — ESTIMATED.',
        'agent' => 'keywords_specialist',
    ]);

    $report = Report::query()->sole();

    expect($payload['saved'])->toBeTrue()
        ->and($payload['id'])->toBe($report->id)
        ->and($report->type)->toBe(Report::TYPE_KEYWORD_RESEARCH)
        ->and($report->title)->toBe('Investigación de keywords: aceites de masaje')
        ->and($report->agent)->toBe('keywords_specialist')
        ->and($report->body)->toContain('ESTIMATED');
});

/**
 * The whole reason a report is an artifact: filed during a task run, it links to that task without the
 * tool passing it through, so it shows up on the task details page.
 */
it('links the report to the running growth task', function () {
    $task = GrowthTask::factory()->create();
    app(GrowthTaskContext::class)->set($task);

    try {
        createReportResult([
            'type' => Report::TYPE_KEYWORD_RESEARCH,
            'title' => 'Investigación',
            'body' => 'Cuerpo del reporte.',
        ]);
    } finally {
        app(GrowthTaskContext::class)->clear();
    }

    expect(Report::query()->sole()->growth_task_id)->toBe($task->id);
});

it('gives the keyword research report its Spanish badge', function () {
    $report = Report::factory()->create(['type' => Report::TYPE_KEYWORD_RESEARCH]);

    expect($report->artifactLabel())->toBe('Investigación de keywords')
        ->and($report->artifactTitle())->toBe($report->title)
        ->and($report->adminUrl())->toBeNull();
});

it('refuses a report kind it cannot label', function () {
    $payload = createReportResult([
        'type' => 'made_up_kind',
        'title' => 'Título',
        'body' => 'Cuerpo.',
    ]);

    expect($payload['error'])->toContain('not a report kind')
        ->and(Report::query()->count())->toBe(0);
});

it('refuses a report with an empty body', function () {
    $payload = createReportResult([
        'type' => Report::TYPE_KEYWORD_RESEARCH,
        'title' => 'Título',
        'body' => '   ',
    ]);

    expect($payload['error'])->toContain('non-empty markdown')
        ->and(Report::query()->count())->toBe(0);
});

it('refuses a report with no title', function () {
    $payload = createReportResult([
        'type' => Report::TYPE_KEYWORD_RESEARCH,
        'body' => 'Cuerpo.',
    ]);

    expect($payload['error'])->toContain('title')
        ->and(Report::query()->count())->toBe(0);
});
