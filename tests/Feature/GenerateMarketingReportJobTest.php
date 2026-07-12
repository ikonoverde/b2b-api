<?php

use App\Ai\Agents\MarketingReportAgent;
use App\Ai\Tools\SaveMarketingReport;
use App\Jobs\GenerateMarketingReport;
use App\Models\MarketingReport;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Support\Facades\Queue;
use Laravel\Ai\Prompts\AgentPrompt;
use Laravel\Ai\Tools\Request;

beforeEach(function () {
    config()->set('shop.timezone', 'America/Merida');
});

function reportDate(): string
{
    return now(config('shop.timezone'))->toDateString();
}

it('prompts the report agent to observe the accounts and save what it saw', function () {
    MarketingReportAgent::fake(function (string $prompt) {
        // The agent is what writes the report; the job only asks for it. Standing in for the tool
        // call the real agent would make.
        app(SaveMarketingReport::class)->handle(new Request([
            'reported_on' => reportDate(),
            'body' => "# Baseline\n\nOBSERVED   ga4.sessions = 30\n",
            'agents_run' => ['google-analytics', 'meta'],
            'reachability' => ['ga4' => 'ok', 'meta_graph' => 'ok'],
            'metrics' => [['key' => 'ga4.sessions', 'provenance' => 'observed', 'numeric_value' => 30]],
        ]));

        return 'Report saved.';
    });

    new GenerateMarketingReport()->handle();

    MarketingReportAgent::assertPrompted(fn (AgentPrompt $prompt): bool => $prompt->contains('marketing_save_report')
        && $prompt->contains(reportDate()));

    $report = MarketingReport::query()->sole();

    expect($report->reported_on->toDateString())->toBe(reportDate())
        ->and($report->ga4_sessions)->toBe(30);
});

it('fails loudly rather than recording a report the agent never saved', function () {
    // The agent answered but never called the tool. Writing a placeholder in its place would put a
    // row of zeros in the table, and nothing downstream could tell it from a quiet day.
    MarketingReportAgent::fake(['I was unable to reach the analytics tools.']);

    expect(fn () => new GenerateMarketingReport()->handle())
        ->toThrow(RuntimeException::class, 'produced no marketing report');

    expect(MarketingReport::query()->count())->toBe(0);
});

it('does not run again on a day that already has a report', function () {
    MarketingReport::factory()->create(['reported_on' => reportDate(), 'ga4_sessions' => 30]);

    MarketingReportAgent::fake();

    new GenerateMarketingReport()->handle();

    // A same-day rerun supersedes the first only when a human asks for it, so the scheduled pass
    // stops here. This is also what makes a retry after a successful save harmless.
    MarketingReportAgent::assertNeverPrompted();

    expect(MarketingReport::query()->sole()->ga4_sessions)->toBe(30);
});

it('still runs when the only report for today has been superseded', function () {
    MarketingReport::factory()->superseded()->create(['reported_on' => reportDate()]);

    MarketingReportAgent::fake(['...']);

    expect(fn () => new GenerateMarketingReport()->handle())->toThrow(RuntimeException::class);

    MarketingReportAgent::assertPrompted(fn (AgentPrompt $prompt): bool => $prompt->contains('marketing_save_report'));
});

it('tells the agent nobody is there to answer questions and not to supersede an existing report', function () {
    // The rules the report must hold to live in the agent's instructions, so they hold on every run
    // whoever prompts it. What the job adds is what is true only of a scheduled run.
    MarketingReportAgent::fake(['...']);

    rescue(fn () => new GenerateMarketingReport()->handle());

    MarketingReportAgent::assertPrompted(fn (AgentPrompt $prompt): bool => $prompt->contains('no admin here to answer questions')
        && $prompt->contains('tagged unknown')
        && $prompt->contains('Do not supersede'));
});

it('runs on a connection that allows it to take as long as its timeout', function () {
    $job = new GenerateMarketingReport;

    $retryAfter = config("queue.connections.{$job->connection}.retry_after");

    // Redis releases a reserved job to another worker once retry_after elapses, whether or not the
    // first worker is still running it. A job whose timeout exceeds retry_after is therefore run
    // again alongside itself every retry_after seconds, its attempts climb, and it is finally marked
    // failed for taking exactly as long as it was told it could. On `default` (90s) this job did.
    expect($job->timeout)->toBeLessThan($retryAfter);
});

it('is queued off the default queue, where a minutes-long run would block short jobs', function () {
    Queue::fake();

    GenerateMarketingReport::dispatch();

    Queue::assertPushedOn('agents', GenerateMarketingReport::class);
});

it('dispatches without a uniqueness lock, so a dispatch is never silently discarded', function () {
    // ShouldBeUnique would hold a cache lock with no expiry for the length of the run and drop any
    // dispatch arriving meanwhile without a word — while handing back a PendingDispatch that looks
    // like success. The day's-report check makes a second run harmless anyway.
    expect(new GenerateMarketingReport)->not->toBeInstanceOf(ShouldBeUnique::class);

    Queue::fake();

    GenerateMarketingReport::dispatch();
    GenerateMarketingReport::dispatch();

    Queue::assertPushed(GenerateMarketingReport::class, 2);
});
