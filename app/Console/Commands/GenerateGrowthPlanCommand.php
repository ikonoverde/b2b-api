<?php

namespace App\Console\Commands;

use App\Jobs\GenerateGrowthPlan;
use App\Models\MarketingReport;
use Illuminate\Console\Command;
use Throwable;

/**
 * The door to the growth plan. There is no schedule entry on purpose: planning is a deliberate act,
 * and a plan that regenerates every morning churns against a baseline that has barely moved.
 */
class GenerateGrowthPlanCommand extends Command
{
    protected $signature = 'growth:plan {--now : Run in this process instead of queueing it}';

    protected $description = 'Have GrowthStrategyAgent read the latest marketing report and file a growth plan.';

    public function handle(): int
    {
        $report = MarketingReport::query()
            ->current()
            ->orderByDesc('reported_on')
            ->orderByDesc('id')
            ->first();

        if (! $report) {
            $this->error('No marketing report stands, so there is nothing to plan from.');
            $this->line('Run the marketing report first. A plan reasoned from a baseline nobody observed is a list of things that sounded good today.');

            return self::FAILURE;
        }

        $this->line("Planning from the {$report->reported_on->toDateString()} baseline.");

        if (! $this->option('now')) {
            GenerateGrowthPlan::dispatch();

            $this->info('Queued on the agents queue. Watch it in Horizon.');

            return self::SUCCESS;
        }

        try {
            new GenerateGrowthPlan()->handle();
        } catch (Throwable $exception) {
            $this->error($exception->getMessage());

            return self::FAILURE;
        }

        $this->info('Plan filed. Read it at /admin/growth-plan. The tasks are proposals, and nothing here executes them.');

        return self::SUCCESS;
    }
}
