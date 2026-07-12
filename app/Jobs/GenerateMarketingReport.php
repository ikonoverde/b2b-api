<?php

namespace App\Jobs;

use App\Ai\Agents\MarketingReportAgent;
use App\Models\MarketingReport;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Runs the daily marketing baseline: prompts MarketingReportAgent to observe the accounts and record
 * what it saw through marketing_save_report.
 *
 * The job does not write the report itself, and deliberately holds no fallback that would. If the
 * agent cannot reach an account, the honest outcome is a report that says so, or no report at all —
 * never a row of zeros standing in for a run that failed, because that is indistinguishable from a
 * quiet day and will be read as one for as long as the table exists.
 */
class GenerateMarketingReport implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    /**
     * An agent that has to delegate to two observers and then save is a long round trip. The report
     * is a daily baseline on a pre-launch store — nothing is waiting on it.
     *
     * This must stay below the connection's retry_after (redis-agents allows 1800s). Redis releases
     * a reserved job to another worker once retry_after elapses, running or not, so a job that
     * outlives it is silently run again alongside itself.
     */
    public int $timeout = 900;

    /**
     * Not the default queue: a run of this takes minutes, and `default` allows a job 90 seconds
     * before it hands it to a second worker.
     */
    public function __construct()
    {
        $this->onConnection('redis-agents')->onQueue('agents');
    }

    /**
     * Deliberately not ShouldBeUnique. Running twice is already harmless — the check below sees the
     * day's report and stops — while the unique lock buys nothing and hides a great deal: it holds a
     * cache lock with no expiry for the whole run, and every dispatch that arrives meanwhile is
     * discarded in silence, returning a PendingDispatch as though it had been queued.
     */
    public function handle(): void
    {
        $reportedOn = $this->reportedOn()->toDateString();

        /**
         * A rerun of the same day supersedes the first only when a human says so. If today already
         * has a report, this scheduled pass has nothing to do — and a retry that lands after a
         * successful save finds it here and stops, which is what makes the job idempotent.
         */
        if (MarketingReport::query()->current()->whereDate('reported_on', $reportedOn)->exists()) {
            Log::info('Marketing report already recorded; scheduled run skipped.', [
                'reported_on' => $reportedOn,
            ]);

            return;
        }

        $response = new MarketingReportAgent()->prompt($this->prompt($reportedOn));

        $report = MarketingReport::query()
            ->current()
            ->whereDate('reported_on', $reportedOn)
            ->first();

        if (! $report) {
            /**
             * The agent answered but never called the tool. Whatever it said is not a report, and
             * writing a placeholder in its place would be worse than the gap: the next run reads
             * this table as measurement.
             */
            Log::error('MarketingReportAgent finished without saving a marketing report.', [
                'reported_on' => $reportedOn,
                'response' => (string) $response,
            ]);

            throw new RuntimeException("MarketingReportAgent produced no marketing report for {$reportedOn}.");
        }

        Log::info('Marketing report recorded.', [
            'reported_on' => $reportedOn,
            'report_id' => $report->id,
            'metrics' => $report->metrics()->count(),
        ]);
    }

    private function reportedOn(): Carbon
    {
        return Carbon::now(config('shop.timezone'))->startOfDay();
    }

    /**
     * The rules the report has to hold to live in MarketingReportAgent's instructions, not here. The
     * agent carries them on every run, whoever prompts it; a copy in this job would be a second
     * place for them to drift.
     */
    private function prompt(string $reportedOn): string
    {
        return <<<PROMPT
        Produce the marketing baseline report for {$reportedOn} and save it with marketing_save_report.

        This is a scheduled run, so there is no admin here to answer questions. Observe what the tools return, record it with its provenance, and save exactly one report. If an account is unreachable, still save the report with those values tagged unknown.

        Do not supersede an existing report for this date. If one already stands, leave it and say so.
        PROMPT;
    }
}
