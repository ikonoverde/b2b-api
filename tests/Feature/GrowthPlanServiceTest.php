<?php

use App\Models\GrowthAction;
use App\Models\GrowthPlan;
use App\Models\GrowthTask;
use App\Models\MarketingReport;
use App\Models\MarketingReportMetric;
use App\Services\Growth\GrowthPlanService;

function baselineReport(array $metrics = [], string $reportedOn = '2026-07-12'): MarketingReport
{
    $report = MarketingReport::factory()->create(['reported_on' => $reportedOn]);

    foreach ($metrics as $key => $metric) {
        MarketingReportMetric::factory()->for($report, 'report')->create([
            'key' => $key,
            'provenance' => $metric['provenance'],
            'numeric_value' => $metric['numeric_value'] ?? null,
            'text_value' => $metric['text_value'] ?? null,
        ]);
    }

    return $report;
}

function planPayload(array $overrides = []): array
{
    return [
        'planned_on' => '2026-07-12',
        'source_report_date' => '2026-07-12',
        'body' => "# Plan\n\nESTIMATED  Write the catalog pages.\n",
        'paid_gate' => GrowthPlan::PAID_GATE_CLOSED,
        'paid_gate_reason' => 'Nothing to buy yet.',
        ...$overrides,
    ];
}

function anAction(array $tasks, string $slug = 'pre-launch-content'): array
{
    return [[
        'slug' => $slug,
        'name' => 'Pre-launch content',
        'summary' => 'There is a catalog and no audience.',
        'tasks' => $tasks,
    ]];
}

function aTask(array $overrides = []): array
{
    return [
        'slug' => 'write-the-oil-guide',
        'name' => 'Write the oil selection guide',
        'body' => 'ESTIMATED  Therapists choose by slip and absorption.',
        'agent' => GrowthTask::AGENT_CONTENT,
        ...$overrides,
    ];
}

it('files a plan against the baseline it was reasoned from', function () {
    $report = baselineReport();

    $result = app(GrowthPlanService::class)->save(planPayload([
        'actions' => anAction([aTask()]),
    ]));

    $plan = $result['plan'];

    expect($plan->marketing_report_id)->toBe($report->id)
        ->and($plan->paid_gate)->toBe(GrowthPlan::PAID_GATE_CLOSED)
        ->and(GrowthAction::query()->sole()->slug)->toBe('pre-launch-content')
        ->and(GrowthTask::query()->sole()->source_marketing_report_id)->toBe($report->id);
});

it('refuses to plan from a baseline that does not exist', function () {
    baselineReport(reportedOn: '2026-07-12');

    expect(fn () => app(GrowthPlanService::class)->save(planPayload([
        'source_report_date' => '2026-07-01',
    ])))->toThrow(RuntimeException::class, 'No marketing report stands for 2026-07-01');

    expect(GrowthPlan::query()->count())->toBe(0);
});

/**
 * The gate. An agent cannot infer completion, so a close is accepted on exactly one basis: a value the
 * report actually observed, checked here against the report rather than taken on the agent's word.
 */
it('closes a task when the source report observed the evidence', function () {
    baselineReport(['ig.followers' => ['provenance' => 'observed', 'numeric_value' => 40]]);

    GrowthTask::factory()
        ->for(GrowthAction::factory()->create(['slug' => 'profile']), 'action')
        ->create(['slug' => 'set-up-the-instagram-profile']);

    $result = app(GrowthPlanService::class)->save(planPayload([
        'close_tasks' => [[
            'task_slug' => 'set-up-the-instagram-profile',
            'evidence_metric_key' => 'ig.followers',
        ]],
    ]));

    $task = GrowthTask::query()->sole();

    expect($task->status)->toBe(GrowthTask::STATUS_DONE)
        ->and($task->closed_by)->toBe(GrowthTask::CLOSED_BY_REPORT)
        ->and($task->close_evidence)->toContain('OBSERVED ig.followers = 40')
        ->and($result['closed'][0]['outcome'])->toBe('closed');
});

it('does not close a task on an estimate, and files it as a proposal instead', function () {
    // An estimate is a judgement, not evidence that work landed. Subtracting the difference between
    // those two is the whole reason this table has provenance at all.
    baselineReport(['ig.followers' => ['provenance' => 'estimated', 'numeric_value' => 40]]);

    GrowthTask::factory()->create(['slug' => 'set-up-the-instagram-profile']);

    $result = app(GrowthPlanService::class)->save(planPayload([
        'close_tasks' => [[
            'task_slug' => 'set-up-the-instagram-profile',
            'evidence_metric_key' => 'ig.followers',
            'reason' => 'I believe the profile is live.',
        ]],
    ]));

    $task = GrowthTask::query()->sole();

    expect($task->status)->toBe(GrowthTask::STATUS_OPEN)
        ->and($task->closed_at)->toBeNull()
        ->and($task->closed_by)->toBeNull()
        ->and($task->hasProposedClosure())->toBeTrue()
        ->and($task->closure_proposal_reason)->toContain('I believe the profile is live.')
        ->and($task->closure_proposal_reason)->toContain('records it as estimated');

    expect($result['closed'][0]['outcome'])->toBe('closure_proposed');
});

it('does not close a task when the report carries no such metric', function () {
    baselineReport(['ga4.sessions' => ['provenance' => 'observed', 'numeric_value' => 30]]);

    GrowthTask::factory()->create(['slug' => 'set-up-the-instagram-profile']);

    app(GrowthPlanService::class)->save(planPayload([
        'close_tasks' => [[
            'task_slug' => 'set-up-the-instagram-profile',
            'evidence_metric_key' => 'ig.display_name',
        ]],
    ]));

    $task = GrowthTask::query()->sole();

    expect($task->status)->toBe(GrowthTask::STATUS_OPEN)
        ->and($task->hasProposedClosure())->toBeTrue()
        ->and($task->closure_proposal_reason)->toContain('does not carry that metric');
});

/**
 * The model is told, in the tool's own response, that its evidence was refused. Without this it
 * summarizes the run as though the task were done, and the person reading the chat believes it.
 */
it('tells the agent plainly which closes were refused', function () {
    baselineReport(['ga4.sessions' => ['provenance' => 'observed', 'numeric_value' => 30]]);

    GrowthTask::factory()->create(['slug' => 'set-up-the-instagram-profile']);

    $service = app(GrowthPlanService::class);

    $payload = $service->payload($service->save(planPayload([
        'close_tasks' => [[
            'task_slug' => 'set-up-the-instagram-profile',
            'evidence_metric_key' => 'ig.display_name',
        ]],
    ])));

    expect($payload['closed'])->toBeEmpty()
        ->and($payload['not_closed'])->toHaveCount(1)
        ->and($payload['not_closed'][0]['message'])->toContain('NOT closed')
        ->and($payload['note'])->toContain('REFUSED');
});

it('updates a re-proposed task in place rather than duplicating it', function () {
    baselineReport(reportedOn: '2026-07-01');
    $newer = baselineReport(reportedOn: '2026-07-12');

    $service = app(GrowthPlanService::class);

    $service->save(planPayload([
        'planned_on' => '2026-07-01',
        'source_report_date' => '2026-07-01',
        'actions' => anAction([aTask()]),
    ]));

    $service->save(planPayload([
        'actions' => anAction([aTask(['name' => 'Write the oil selection guide, with dilution ratios'])]),
    ]));

    $task = GrowthTask::query()->sole();

    expect(GrowthAction::query()->count())->toBe(1)
        ->and($task->name)->toBe('Write the oil selection guide, with dilution ratios')
        // The source report is rewritten: a task carried forward is now reasoned from the new baseline.
        ->and($task->source_marketing_report_id)->toBe($newer->id)
        ->and($task->updated_by_growth_plan_id)->toBe(GrowthPlan::current()->id);
});

it('drops a task with its reason, and never deletes the row', function () {
    baselineReport();

    GrowthTask::factory()->create(['slug' => 'run-a-retargeting-test']);

    app(GrowthPlanService::class)->save(planPayload([
        'drop_tasks' => [[
            'task_slug' => 'run-a-retargeting-test',
            'reason' => 'The paid gate shut. There is nothing to retarget.',
        ]],
    ]));

    $task = GrowthTask::query()->sole();

    expect($task->status)->toBe(GrowthTask::STATUS_DROPPED)
        ->and($task->drop_reason)->toContain('The paid gate shut')
        // Dropping claims the work is not worth doing. It must never look like the work was done.
        ->and($task->closed_by)->toBeNull();
});

it('rejects a task assigned to an agent that only observes', function () {
    baselineReport();

    $validator = validator(
        planPayload(['actions' => anAction([aTask(['agent' => 'meta'])])]),
        app(GrowthPlanService::class)->rules(),
        app(GrowthPlanService::class)->messages(),
    );

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->first())->toContain('Never to meta');
});

it('reads back the standing plan with the paid gate verdict', function () {
    baselineReport();

    app(GrowthPlanService::class)->save(planPayload([
        'paid_gate_preconditions' => ['Checkout completes an order end to end.'],
        'actions' => anAction([aTask()]),
    ]));

    $plan = app(GrowthPlanService::class)->plan();

    expect($plan['has_plan'])->toBeTrue()
        ->and($plan['paid_gate']['verdict'])->toBe(GrowthPlan::PAID_GATE_CLOSED)
        ->and($plan['paid_gate']['preconditions'])->toBe(['Checkout completes an order end to end.'])
        ->and($plan['actions'][0]['tasks'][0]['slug'])->toBe('write-the-oil-guide');
});

it('closes an action once nothing is open under it, and reopens it when work returns', function () {
    baselineReport(['ig.followers' => ['provenance' => 'observed', 'numeric_value' => 40]]);

    $action = GrowthAction::factory()->create(['slug' => 'profile']);
    GrowthTask::factory()->for($action, 'action')->create(['slug' => 'set-up-the-instagram-profile']);

    $service = app(GrowthPlanService::class);

    $service->save(planPayload([
        'close_tasks' => [[
            'task_slug' => 'set-up-the-instagram-profile',
            'evidence_metric_key' => 'ig.followers',
        ]],
    ]));

    expect($action->refresh()->status)->toBe(GrowthAction::STATUS_DONE);

    $service->save(planPayload([
        'actions' => anAction([aTask(['slug' => 'write-the-bio'])], slug: 'profile'),
    ]));

    expect($action->refresh()->status)->toBe(GrowthAction::STATUS_OPEN);
});
