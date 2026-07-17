<?php

namespace App\Jobs;

use App\Ai\Agents\GrowthStrategyAgent;
use App\Models\GrowthPlan;
use App\Models\MarketingReport;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Turns the latest observed baseline into a written plan: prompts GrowthStrategyAgent to read the
 * newest marketing report and the plan already on file, and to record what it decides through
 * growth_save_plan.
 *
 * The job does not write the plan itself and holds no fallback that would. If the agent produces
 * nothing, the honest outcome is no plan — a placeholder filed in its place would be read by the next
 * run as work somebody chose.
 */
class GenerateGrowthPlan implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    /**
     * Reading the plan, reading the reports, delegating to three sub-agents and then filing is a long
     * round trip. Nothing is waiting on the result.
     *
     * This must stay below the connection's retry_after (redis-agents allows 1800s). Redis releases a
     * reserved job to another worker once retry_after elapses, running or not, so a job that outlives
     * it is silently run again alongside itself.
     */
    public int $timeout = 900;

    /**
     * Not the default queue: a run of this takes minutes, and `default` allows a job 90 seconds before
     * it hands it to a second worker.
     */
    public function __construct()
    {
        $this->onConnection('redis-agents')->onQueue('agents');
    }

    public function handle(): void
    {
        $report = MarketingReport::query()
            ->current()
            ->orderByDesc('reported_on')
            ->orderByDesc('id')
            ->first();

        /**
         * The hard stop. A growth plan built on a baseline nobody observed is a list of things that
         * sounded good on the day it was written, and the only thing that makes these tasks worth
         * anything is that they are traceable to a measurement.
         */
        if (! $report) {
            throw new RuntimeException('No marketing report stands, so there is nothing to plan from. Run GenerateMarketingReport first.');
        }

        $lastPlanId = GrowthPlan::query()->max('id');

        $response = new GrowthStrategyAgent()->prompt($this->prompt($report));

        $plan = GrowthPlan::query()
            ->when($lastPlanId !== null, fn ($query) => $query->where('id', '>', $lastPlanId))
            ->orderByDesc('id')
            ->first();

        if (! $plan) {
            /**
             * The agent answered but never called the tool. Whatever it said is not a plan, and it
             * lives only in this log line — which is the right place for it, because nothing downstream
             * should be able to mistake it for work that was decided on.
             */
            Log::error('GrowthStrategyAgent finished without saving a growth plan.', [
                'source_report' => $report->reported_on->toDateString(),
                'response' => (string) $response,
            ]);

            throw new RuntimeException(sprintf(
                'GrowthStrategyAgent produced no growth plan from the %s baseline.',
                $report->reported_on->toDateString(),
            ));
        }

        Log::info('Growth plan recorded.', [
            'plan_id' => $plan->id,
            'planned_on' => $plan->planned_on->toDateString(),
            'source_report' => $report->reported_on->toDateString(),
            'paid_gate' => $plan->paid_gate,
        ]);
    }

    /**
     * The rules the plan has to hold to live in GrowthStrategyAgent's instructions, not here. The agent
     * carries those rules on every run, whoever prompts it; a copy in this job would be a second place
     * for them to drift. What belongs here is only what is true of an unattended run.
     */
    private function prompt(MarketingReport $report): string
    {
        $baseline = $report->reported_on->toDateString();
        $today = Carbon::now(config('shop.timezone'))->toDateString();

        return <<<PROMPT
        Read the marketing report for {$baseline} in full, read the plan that already stands, and file today's growth plan with growth_save_plan. Use {$today} as planned_on and {$baseline} as source_report_date.

        This is an unattended run. There is no admin here to answer questions, so do not end by asking which tasks are done — nobody will read the question. Close only what the report itself observes, and anything else you believe is finished, send as a closure proposal with your reasoning. A person will decide it in the admin.

        Add the work the baseline justifies, update the tasks whose reasoning has moved, drop what is no longer worth doing, and give your paid-gate verdict in your own terms.
        PROMPT;
    }
}
