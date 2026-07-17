<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /**
         * One row per planning run: what GrowthStrategyAgent recommended, and the baseline it read.
         *
         * This is a run log, not the plan. The plan is the actions and tasks below, which outlive any
         * single run — a plan that owned its actions would re-derive the same few ideas every time
         * anybody asked, which is the failure the close/update/add discipline exists to prevent.
         *
         * Plans accumulate and the newest stands. That also gives the paid-gate history for free: a
         * verdict is only meaningful next to the reason the gate was previously shut, and every row
         * here is dated.
         */
        Schema::create('growth_plans', function (Blueprint $table) {
            $table->id();
            $table->date('planned_on');

            /**
             * Required, and the report cannot be deleted out from under it. A plan whose baseline
             * nobody can produce is a list of things that sounded good on the day it was written, and
             * later there is no way to tell which numbers justified it.
             */
            $table->foreignId('marketing_report_id')->constrained()->restrictOnDelete();

            $table->longText('body');

            /**
             * Whether paid acquisition is appropriate at all. The agent owns this verdict, and it is
             * re-asked every run rather than inherited. While it is closed, no paid-acquisition task
             * may stand — an open task contradicting the verdict above it is how a plan stops agreeing
             * with itself.
             */
            $table->string('paid_gate', 20);
            $table->text('paid_gate_reason');
            $table->json('paid_gate_preconditions')->nullable();

            $table->timestamps();

            $table->index('planned_on');
        });

        /**
         * A goal worth pursuing. Long-lived, and never deleted: tasks reference each other by slug, and
         * a deleted row is a decision nobody can reconstruct — it will come back as a fresh idea on the
         * next run, because nothing remembers it was killed.
         */
        Schema::create('growth_actions', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('summary')->nullable();
            $table->string('status', 20)->default('open')->index();
            $table->timestamp('closed_at')->nullable();
            $table->foreignId('created_by_growth_plan_id')->nullable()->constrained('growth_plans')->nullOnDelete();
            $table->timestamps();
        });

        /**
         * One unit of work under an action, assigned to exactly one agent.
         */
        Schema::create('growth_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('growth_action_id')->constrained()->cascadeOnDelete();

            /**
             * The dedupe key. A task re-proposed under the same slug updates the row already here
             * rather than landing beside it: the plan on disk wins, and a plan that only ever grows is
             * not a plan.
             */
            $table->string('slug');

            $table->string('name');
            $table->longText('body');

            /** One of GrowthTask::AGENTS. The generic/human split is the one that carries information. */
            $table->string('agent', 20)->index();

            $table->string('status', 20)->default('open')->index();

            /**
             * The baseline this task was reasoned from, rewritten whenever the task is updated against
             * a newer one. Not decoration: a task found later with no idea which numbers produced it is
             * a suggestion from a stranger.
             */
            $table->foreignId('source_marketing_report_id')->nullable()->constrained('marketing_reports')->nullOnDelete();

            $table->foreignId('created_by_growth_plan_id')->nullable()->constrained('growth_plans')->nullOnDelete();
            $table->foreignId('updated_by_growth_plan_id')->nullable()->constrained('growth_plans')->nullOnDelete();

            /**
             * How the task was closed, and the two ways must stay distinguishable.
             *
             * `report` means a marketing report OBSERVED that the work landed, and GrowthPlanService
             * checked that claim against the metric before writing this row. `human` means a person
             * said so. They are different kinds of truth, and collapsing them into one green check is
             * the same mistake as recording an unobserved value as zero.
             *
             * Nothing else closes a task. An agent cannot infer completion: nothing in this system
             * executes these tasks, no agent writes back, and a task row looks identical the day it is
             * written and the day after the work ships. Silence is not evidence.
             */
            $table->timestamp('closed_at')->nullable();
            $table->string('closed_by', 20)->nullable();
            $table->text('close_evidence')->nullable();

            /**
             * The agent wanted this closed and had no observed metric to prove it. The task stays open
             * and a human decides. An open task nobody has done is an honest record of work
             * outstanding; a closed task nobody did is a lie the next run will act on.
             */
            $table->timestamp('closure_proposed_at')->nullable();
            $table->text('closure_proposal_reason')->nullable();
            $table->foreignId('closure_proposed_by_growth_plan_id')->nullable()->constrained('growth_plans')->nullOnDelete();

            /**
             * Dropping claims only that the work is no longer worth doing, never that it was done, so
             * the agent may do it directly. The reason is required and the row stays: it is the only
             * thing that stops the same idea being re-proposed next month.
             */
            $table->text('drop_reason')->nullable();

            $table->timestamps();

            $table->unique(['growth_action_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('growth_tasks');
        Schema::dropIfExists('growth_actions');
        Schema::dropIfExists('growth_plans');
    }
};
