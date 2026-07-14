<?php

namespace App\Services\Growth;

use App\Models\GrowthAction;
use App\Models\GrowthPlan;
use App\Models\GrowthTask;
use App\Models\MarketingReport;
use App\Models\MarketingReportMetric;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use RuntimeException;

/**
 * Writes and reads the growth plan.
 *
 * A plan is judgement, so nearly everything in it is an estimate, and that is correct. What must stay
 * honest is the boundary between what was planned and what was done. Two rules hold it, and both are
 * enforced here rather than asked for in a prompt, because breaking either produces a plan that looks
 * right:
 *
 *  - A task closes only on evidence a marketing report actually OBSERVED. The agent names the metric
 *    key; this service checks the report itself. Nothing else can set a task done except a person.
 *  - A task is never deleted. Closing and dropping are edits, and the row stays — a deleted task is a
 *    decision nobody can reconstruct, and it comes back as a fresh idea on the next run because
 *    nothing remembers it was killed.
 */
class GrowthPlanService
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'planned_on' => ['required', 'date_format:Y-m-d'],
            'source_report_date' => ['required', 'date_format:Y-m-d'],
            'body' => ['required', 'string'],

            'paid_gate' => ['required', 'string', Rule::in(GrowthPlan::PAID_GATES)],
            'paid_gate_reason' => ['required', 'string'],
            'paid_gate_preconditions' => ['nullable', 'array'],
            'paid_gate_preconditions.*' => ['required', 'string', 'max:500'],

            'actions' => ['nullable', 'array'],
            'actions.*.slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]+(-[a-z0-9]+)*$/'],
            'actions.*.name' => ['required', 'string', 'max:255'],
            'actions.*.summary' => ['nullable', 'string'],
            'actions.*.tasks' => ['required', 'array', 'min:1'],
            'actions.*.tasks.*.slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]+(-[a-z0-9]+)*$/'],
            'actions.*.tasks.*.name' => ['required', 'string', 'max:255'],
            'actions.*.tasks.*.body' => ['required', 'string'],
            'actions.*.tasks.*.agent' => ['required', 'string', Rule::in(GrowthTask::AGENTS)],

            'close_tasks' => ['nullable', 'array'],
            'close_tasks.*.task_slug' => ['required', 'string', 'max:255'],
            'close_tasks.*.evidence_metric_key' => ['required', 'string', 'max:255'],
            'close_tasks.*.reason' => ['nullable', 'string'],

            'drop_tasks' => ['nullable', 'array'],
            'drop_tasks.*.task_slug' => ['required', 'string', 'max:255'],
            'drop_tasks.*.reason' => ['required', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'actions.*.tasks.*.agent.in' => 'A task must be assigned to one of: '.implode(', ', GrowthTask::AGENTS).'. Never to meta, google-analytics, conversion, or brand — those observe or gate, they do not produce work.',
            'actions.*.tasks.required' => 'An action with no task is a wish. Give it at least one unit of work.',
            'close_tasks.*.evidence_metric_key.required' => 'Name the metric key from the source report that shows this work landed. You cannot close a task on your own judgement; without observed evidence this becomes a proposal for a human.',
            'drop_tasks.*.reason.required' => 'Say why the task is being dropped. The reason is the only thing that stops the same idea being re-proposed next month.',
            'paid_gate_reason.required' => 'Say why the gate is where it is. A verdict with no reasoning cannot be re-asked against a new baseline.',
        ];
    }

    /**
     * Models hand back a JSON string where an array was asked for often enough to be worth collapsing
     * before validation, and a blank string where they mean nothing at all.
     *
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function normalize(array $arguments): array
    {
        foreach (['actions', 'close_tasks', 'drop_tasks', 'paid_gate_preconditions'] as $key) {
            if (array_key_exists($key, $arguments) && is_string($arguments[$key])) {
                $decoded = json_decode($arguments[$key], associative: true);

                $arguments[$key] = is_array($decoded) ? $decoded : $arguments[$key];
            }
        }

        if (is_string($arguments['paid_gate'] ?? null)) {
            $arguments['paid_gate'] = strtolower(trim($arguments['paid_gate']));
        }

        return $arguments;
    }

    /**
     * File a planning run: the recommendation, the paid-gate verdict, and the close / update / add of
     * the tasks under it. All of it or none of it.
     *
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed> the plan, and what it did to every task it touched
     *
     * @throws RuntimeException when no report stands for the stated baseline
     */
    public function save(array $validated): array
    {
        $report = MarketingReport::query()
            ->current()
            ->whereDate('reported_on', $validated['source_report_date'])
            ->first();

        if (! $report) {
            throw new RuntimeException(sprintf(
                'No marketing report stands for %s, so there is no baseline to plan from. Read the reports first and name one that exists. A plan reasoned from a baseline nobody observed is a list of things that sounded good on the day it was written.',
                $validated['source_report_date'],
            ));
        }

        return DB::transaction(function () use ($validated, $report): array {
            $plan = GrowthPlan::query()->create([
                'planned_on' => $validated['planned_on'],
                'marketing_report_id' => $report->id,
                'body' => $validated['body'],
                'paid_gate' => $validated['paid_gate'],
                'paid_gate_reason' => $validated['paid_gate_reason'],
                'paid_gate_preconditions' => Arr::get($validated, 'paid_gate_preconditions'),
            ]);

            return [
                'plan' => $plan,
                'actions' => $this->upsertActions($plan, $report, Arr::get($validated, 'actions', []) ?? []),
                'closed' => $this->closeTasks($plan, $report, Arr::get($validated, 'close_tasks', []) ?? []),
                'dropped' => $this->dropTasks(Arr::get($validated, 'drop_tasks', []) ?? []),
            ];
        });
    }

    /**
     * Add what is new, update what has moved, and leave the rest alone.
     *
     * A task is identified by its slug within its action. A re-proposed task therefore lands on the row
     * that is already there and rewrites it, rather than sitting beside it as a duplicate under a
     * slightly different title.
     *
     * @param  array<int, array<string, mixed>>  $actions
     * @return array<int, array<string, mixed>>
     */
    private function upsertActions(GrowthPlan $plan, MarketingReport $report, array $actions): array
    {
        $outcomes = [];

        foreach ($actions as $input) {
            $action = GrowthAction::query()->firstOrNew(['slug' => $input['slug']]);
            $isNewAction = ! $action->exists;

            $action->fill([
                'name' => $input['name'],
                'summary' => Arr::get($input, 'summary'),
            ]);

            if ($isNewAction) {
                $action->status = GrowthAction::STATUS_OPEN;
                $action->created_by_growth_plan_id = $plan->id;
            }

            $action->save();

            $tasks = [];

            foreach (Arr::get($input, 'tasks', []) as $taskInput) {
                $tasks[] = $this->upsertTask($plan, $report, $action, $taskInput);
            }

            /** New work under a finished action reopens it. An action is only as closed as its tasks. */
            $this->closeActionIfFinished($action->refresh());

            $outcomes[] = [
                'slug' => $action->slug,
                'outcome' => $isNewAction ? 'created' : 'updated',
                'tasks' => $tasks,
            ];
        }

        return $outcomes;
    }

    /**
     * @param  array<string, mixed>  $input
     * @return array<string, mixed>
     */
    private function upsertTask(GrowthPlan $plan, MarketingReport $report, GrowthAction $action, array $input): array
    {
        $task = GrowthTask::query()->firstOrNew([
            'growth_action_id' => $action->id,
            'slug' => $input['slug'],
        ]);

        $isNew = ! $task->exists;

        $task->fill([
            'name' => $input['name'],
            'body' => $input['body'],
            'agent' => $input['agent'],
            'source_marketing_report_id' => $report->id,
        ]);

        if ($isNew) {
            $task->status = GrowthTask::STATUS_OPEN;
            $task->created_by_growth_plan_id = $plan->id;
        } else {
            $task->updated_by_growth_plan_id = $plan->id;
        }

        $task->save();

        return [
            'slug' => $task->slug,
            'agent' => $task->agent,
            'status' => $task->status,
            'outcome' => $isNew ? 'created' : 'updated',
        ];
    }

    /**
     * The gate.
     *
     * An agent cannot infer completion. Nothing in this system executes these tasks, no agent writes
     * back, and a task row looks identical the day it is written and the day after the work ships. So
     * a close is accepted on exactly one basis: a metric the source report OBSERVED, checked here
     * against the report itself rather than taken on the agent's word.
     *
     * A close it cannot prove is not refused outright — it is recorded as a proposal, with the agent's
     * reasoning, and the task stays open until a person decides. An open task nobody has done is an
     * honest record of work outstanding. A closed task nobody did is a lie the next run will act on.
     *
     * @param  array<int, array<string, mixed>>  $closes
     * @return array<int, array<string, mixed>>
     */
    private function closeTasks(GrowthPlan $plan, MarketingReport $report, array $closes): array
    {
        $outcomes = [];

        foreach ($closes as $close) {
            $task = $this->findTask($close['task_slug']);

            if (! $task) {
                $outcomes[] = [
                    'task_slug' => $close['task_slug'],
                    'outcome' => 'not_found',
                    'message' => 'No task carries that slug. It was not closed.',
                ];

                continue;
            }

            $metric = MarketingReportMetric::query()
                ->where('marketing_report_id', $report->id)
                ->where('key', $close['evidence_metric_key'])
                ->first();

            if (! $metric || ! $metric->isObserved()) {
                $task->update([
                    'closure_proposed_at' => now(),
                    'closure_proposal_reason' => $this->proposalReason($close, $metric, $report),
                    'closure_proposed_by_growth_plan_id' => $plan->id,
                ]);

                $outcomes[] = [
                    'task_slug' => $task->slug,
                    'outcome' => 'closure_proposed',
                    'status' => $task->status,
                    'message' => $metric === null
                        ? sprintf('Report %s carries no metric "%s", so this task was NOT closed. It stays open, and your reasoning is recorded as a proposal for a human to decide. Do not describe it as done.', $report->reported_on->toDateString(), $close['evidence_metric_key'])
                        : sprintf('Metric "%s" in report %s is %s, not observed. An estimate is not evidence that work landed, so this task was NOT closed. It stays open as a proposal for a human. Do not describe it as done.', $close['evidence_metric_key'], $report->reported_on->toDateString(), $metric->provenance),
                ];

                continue;
            }

            $evidence = sprintf(
                'Report %s OBSERVED %s = %s',
                $report->reported_on->toDateString(),
                $metric->key,
                $metric->numeric_value !== null
                    ? rtrim(rtrim(number_format((float) $metric->numeric_value, 4, '.', ''), '0'), '.')
                    : ($metric->text_value ?? 'observed'),
            );

            $task->update([
                'status' => GrowthTask::STATUS_DONE,
                'closed_at' => now(),
                'closed_by' => GrowthTask::CLOSED_BY_REPORT,
                'close_evidence' => $evidence,
                'closure_proposed_at' => null,
                'closure_proposal_reason' => null,
                'closure_proposed_by_growth_plan_id' => null,
            ]);

            $this->closeActionIfFinished($task->action);

            $outcomes[] = [
                'task_slug' => $task->slug,
                'outcome' => 'closed',
                'status' => GrowthTask::STATUS_DONE,
                'evidence' => $evidence,
            ];
        }

        return $outcomes;
    }

    /**
     * @param  array<string, mixed>  $close
     */
    private function proposalReason(array $close, ?MarketingReportMetric $metric, MarketingReport $report): string
    {
        $stated = trim((string) Arr::get($close, 'reason', ''));

        $basis = $metric === null
            ? sprintf('Cited %s as evidence, but report %s does not carry that metric.', $close['evidence_metric_key'], $report->reported_on->toDateString())
            : sprintf('Cited %s as evidence, but report %s records it as %s, not observed.', $close['evidence_metric_key'], $report->reported_on->toDateString(), $metric->provenance);

        return $stated === '' ? $basis : $stated."\n\n".$basis;
    }

    /**
     * Dropping says the work is no longer worth doing. It never says it was done, so an agent may do it
     * on its own judgement — and a person can put it back.
     *
     * @param  array<int, array<string, mixed>>  $drops
     * @return array<int, array<string, mixed>>
     */
    private function dropTasks(array $drops): array
    {
        $outcomes = [];

        foreach ($drops as $drop) {
            $task = $this->findTask($drop['task_slug']);

            if (! $task) {
                $outcomes[] = [
                    'task_slug' => $drop['task_slug'],
                    'outcome' => 'not_found',
                ];

                continue;
            }

            $task->update([
                'status' => GrowthTask::STATUS_DROPPED,
                'closed_at' => now(),
                'closed_by' => null,
                'drop_reason' => $drop['reason'],
                'closure_proposed_at' => null,
                'closure_proposal_reason' => null,
                'closure_proposed_by_growth_plan_id' => null,
            ]);

            $this->closeActionIfFinished($task->action);

            $outcomes[] = [
                'task_slug' => $task->slug,
                'outcome' => 'dropped',
                'status' => GrowthTask::STATUS_DROPPED,
            ];
        }

        return $outcomes;
    }

    /**
     * An action with nothing open under it is finished. Nothing about the action itself is being
     * claimed here — it is bookkeeping over its tasks, and it comes straight back open the moment a
     * task under it does.
     */
    private function closeActionIfFinished(GrowthAction $action): void
    {
        $openTasks = $action->tasks()->open()->count();

        if ($openTasks > 0) {
            $action->update(['status' => GrowthAction::STATUS_OPEN, 'closed_at' => null]);

            return;
        }

        $anyDone = $action->tasks()->where('status', GrowthTask::STATUS_DONE)->exists();

        $action->update([
            'status' => $anyDone ? GrowthAction::STATUS_DONE : GrowthAction::STATUS_DROPPED,
            'closed_at' => now(),
        ]);
    }

    private function findTask(string $slug): ?GrowthTask
    {
        return GrowthTask::query()->with('action')->where('slug', $slug)->first();
    }

    /**
     * The plan as it stands: the standing paid-gate verdict, and every action with its tasks.
     *
     * This is what the agent reads before it proposes anything. Without it, it does not know what was
     * planned last time and will cheerfully re-propose every one of it as a fresh idea.
     *
     * @return array<string, mixed>
     */
    public function plan(): array
    {
        $current = GrowthPlan::current();

        $actions = GrowthAction::query()
            ->with(['tasks' => fn ($query) => $query->orderBy('id')])
            ->orderBy('status')
            ->orderBy('id')
            ->get();

        return [
            'has_plan' => $current !== null,
            'last_planned_on' => $current?->planned_on->toDateString(),
            'paid_gate' => $current === null ? null : [
                'verdict' => $current->paid_gate,
                'reason' => $current->paid_gate_reason,
                'preconditions' => $current->paid_gate_preconditions ?? [],
                'decided_on' => $current->planned_on->toDateString(),
                'note' => 'Re-ask this against the new baseline rather than inheriting it. While it is closed, no paid-acquisition task may stand.',
            ],
            'actions' => $actions->map(fn (GrowthAction $action): array => [
                'slug' => $action->slug,
                'name' => $action->name,
                'summary' => $action->summary,
                'status' => $action->status,
                'tasks' => $action->tasks->map(fn (GrowthTask $task): array => $this->taskPayload($task))->all(),
            ])->all(),
            'note' => 'Everything open here is work outstanding, whatever it looks like. Nothing in this system executes these tasks and nothing writes back, so a task that has been open a long time is not evidence it was done, and silence is not evidence of anything.',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function taskPayload(GrowthTask $task): array
    {
        return [
            'slug' => $task->slug,
            'name' => $task->name,
            'agent' => $task->agent,
            'status' => $task->status,
            'body' => $task->body,
            'source_report' => $task->sourceReport?->reported_on->toDateString(),
            'closed_by' => $task->closed_by,
            'close_evidence' => $task->close_evidence,
            'drop_reason' => $task->drop_reason,
            'closure_proposed' => $task->hasProposedClosure(),
            'closure_proposal_reason' => $task->closure_proposal_reason,
        ];
    }

    /**
     * What the save tool hands back to the model.
     *
     * The refused closes are the part that matters. A model that is not told its evidence was rejected
     * will summarize the run as though the task were done, and the person reading the chat will believe
     * it.
     *
     * @param  array<string, mixed>  $result
     * @return array<string, mixed>
     */
    public function payload(array $result): array
    {
        /** @var GrowthPlan $plan */
        $plan = $result['plan'];

        /** @var array<int, array<string, mixed>> $closed */
        $closed = $result['closed'];

        $refused = array_values(array_filter(
            $closed,
            fn (array $outcome): bool => $outcome['outcome'] !== 'closed',
        ));

        return [
            'saved' => true,
            'plan_id' => $plan->id,
            'planned_on' => $plan->planned_on->toDateString(),
            'source_report' => $plan->sourceReport->reported_on->toDateString(),
            'paid_gate' => $plan->paid_gate,
            'actions' => $result['actions'],
            'closed' => array_values(array_filter(
                $closed,
                fn (array $outcome): bool => $outcome['outcome'] === 'closed',
            )),
            'not_closed' => $refused,
            'dropped' => $result['dropped'],
            'review_url' => route('admin.growth-plan'),
            'note' => $refused === []
                ? 'Filed. Tasks are proposals for a human; nothing here executes them.'
                : 'Filed, but the closes listed under not_closed were REFUSED: the report does not observe the evidence you cited. Those tasks are still open. Report them as open, not as done.',
        ];
    }
}
