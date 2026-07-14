<?php

use App\Ai\Agents\GrowthStrategyAgent;
use App\Ai\Tools\Growth\SaveGrowthPlan;
use App\Jobs\GenerateGrowthPlan;
use App\Models\GrowthAction;
use App\Models\GrowthPlan;
use App\Models\GrowthTask;
use App\Models\MarketingReport;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Support\Facades\Queue;
use Laravel\Ai\Prompts\AgentPrompt;
use Laravel\Ai\Tools\Request;

beforeEach(function () {
    config()->set('shop.timezone', 'America/Merida');
});

function fileAPlan(string $baseline): void
{
    app(SaveGrowthPlan::class)->handle(new Request([
        'planned_on' => now(config('shop.timezone'))->toDateString(),
        'source_report_date' => $baseline,
        'body' => "# Plan\n\nESTIMATED  Write the catalog pages before spending anything.\n",
        'paid_gate' => GrowthPlan::PAID_GATE_CLOSED,
        'paid_gate_reason' => 'The store has not launched. There is nothing for a click to buy.',
        'paid_gate_preconditions' => ['Checkout completes an order end to end.'],
        'actions' => [[
            'slug' => 'pre-launch-content',
            'name' => 'Pre-launch content',
            'summary' => 'There is a catalog and no audience.',
            'tasks' => [[
                'slug' => 'write-the-oil-guide',
                'name' => 'Write the oil selection guide',
                'body' => 'ESTIMATED  Therapists choose an oil by slip and absorption.',
                'agent' => GrowthTask::AGENT_CONTENT,
            ]],
        ]],
    ]));
}

it('prompts the strategist to read the latest baseline and file a plan', function () {
    $report = MarketingReport::factory()->create(['reported_on' => '2026-07-12']);

    GrowthStrategyAgent::fake(function (string $prompt) {
        // The agent is what writes the plan; the job only asks for it. Standing in for the tool call
        // the real agent would make.
        fileAPlan('2026-07-12');

        return 'Plan filed.';
    });

    new GenerateGrowthPlan()->handle();

    GrowthStrategyAgent::assertPrompted(fn (AgentPrompt $prompt): bool => $prompt->contains('growth_save_plan')
        && $prompt->contains('2026-07-12'));

    $plan = GrowthPlan::query()->sole();

    expect($plan->marketing_report_id)->toBe($report->id)
        ->and($plan->paid_gate)->toBe(GrowthPlan::PAID_GATE_CLOSED)
        ->and(GrowthAction::query()->sole()->slug)->toBe('pre-launch-content')
        ->and(GrowthTask::query()->sole()->agent)->toBe(GrowthTask::AGENT_CONTENT);
});

/**
 * The skill's first rule, and the reason this job has no fallback: a plan reasoned from a baseline
 * nobody observed is a list of things that sounded good on the day it was written.
 */
it('refuses to plan when no report stands', function () {
    GrowthStrategyAgent::fake();

    expect(fn () => new GenerateGrowthPlan()->handle())
        ->toThrow(RuntimeException::class, 'No marketing report stands');

    GrowthStrategyAgent::assertNeverPrompted();

    expect(GrowthPlan::query()->count())->toBe(0);
});

it('will not plan from a superseded report', function () {
    // A superseded report was replaced because it observed something different. It is kept for the
    // record and must never be read as the reading for its day.
    MarketingReport::factory()->superseded()->create(['reported_on' => '2026-07-12']);

    GrowthStrategyAgent::fake();

    expect(fn () => new GenerateGrowthPlan()->handle())->toThrow(RuntimeException::class);

    GrowthStrategyAgent::assertNeverPrompted();
});

it('fails loudly rather than recording a plan the agent never filed', function () {
    MarketingReport::factory()->create(['reported_on' => '2026-07-12']);

    // The agent answered but never called the tool. Whatever it said is not a plan, and writing a
    // placeholder in its place would put work into the queue that nobody chose.
    GrowthStrategyAgent::fake(['Here are some ideas you might consider.']);

    expect(fn () => new GenerateGrowthPlan()->handle())
        ->toThrow(RuntimeException::class, 'produced no growth plan');

    expect(GrowthPlan::query()->count())->toBe(0)
        ->and(GrowthTask::query()->count())->toBe(0);
});

it('plans from the newest baseline when several stand', function () {
    MarketingReport::factory()->create(['reported_on' => '2026-07-01']);
    $newest = MarketingReport::factory()->create(['reported_on' => '2026-07-12']);

    GrowthStrategyAgent::fake(function () {
        fileAPlan('2026-07-12');

        return 'Plan filed.';
    });

    new GenerateGrowthPlan()->handle();

    expect(GrowthPlan::query()->sole()->marketing_report_id)->toBe($newest->id);
});

it('tells the agent nobody is there to answer, so it must propose closures rather than ask', function () {
    // The rules a plan must hold live in the agent's instructions, so they hold on every run whoever
    // prompts it. What the job adds is what is true only of an unattended one.
    MarketingReport::factory()->create(['reported_on' => '2026-07-12']);

    GrowthStrategyAgent::fake(['...']);

    rescue(fn () => new GenerateGrowthPlan()->handle());

    GrowthStrategyAgent::assertPrompted(fn (AgentPrompt $prompt): bool => $prompt->contains('no admin here to answer questions')
        && $prompt->contains('closure proposal')
        && $prompt->contains('paid-gate verdict'));
});

it('runs on a connection that allows it to take as long as its timeout', function () {
    $job = new GenerateGrowthPlan;

    // Redis releases a reserved job to another worker once retry_after elapses, running or not, so a
    // job whose timeout exceeds it is silently run again alongside itself.
    expect($job->timeout)->toBeLessThan(config("queue.connections.{$job->connection}.retry_after"));
});

it('is queued off the default queue, where a minutes-long run would block short jobs', function () {
    Queue::fake();

    GenerateGrowthPlan::dispatch();

    Queue::assertPushedOn('agents', GenerateGrowthPlan::class);
});

it('dispatches without a uniqueness lock, so a dispatch is never silently discarded', function () {
    expect(new GenerateGrowthPlan)->not->toBeInstanceOf(ShouldBeUnique::class);
});
