<?php

namespace App\Ai\Tools\Growth;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Models\GrowthTask;
use App\Services\Growth\GrowthPlanService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

/**
 * Edit one existing growth task in place, without filing a whole plan.
 *
 * The reach is deliberately narrow: it moves the description of the work — name, body, assignee — and
 * nothing about where the task sits in its life. A task closes only on evidence a report OBSERVED, or
 * because a human said so in the admin; it drops only through a plan run that records why. None of that
 * is reachable here. An agent that could flip a task's status by editing a field would close its own
 * homework, which is the one thing this whole subsystem is built to prevent.
 *
 * For the same reason a settled task is left alone: only an open task can be edited. A done or dropped
 * task is a historical record, and rewriting its body after the fact would let the next run read a
 * changed story as the original one.
 */
class UpdateGrowthTask implements Tool
{
    use FormatsToolResponses;

    public function __construct(private GrowthPlanService $plans) {}

    public function name(): string
    {
        return 'growth_update_task';
    }

    public function description(): Stringable|string
    {
        return 'Edit one existing growth task in place. Identify it by id or slug, and send only the fields you want to change: name, body, or the agent it is assigned to. This moves the description of the work, never its lifecycle — you cannot close, drop, or reopen a task here, and only an open task can be edited. Closing is verified against a report in growth_save_plan, and a human decides it in the admin.';
    }

    public function handle(Request $request): Stringable|string
    {
        $arguments = $request->all();

        foreach (['slug', 'name', 'body', 'agent'] as $key) {
            if (is_string($arguments[$key] ?? null)) {
                $arguments[$key] = trim($arguments[$key]) === '' ? null : trim($arguments[$key]);
            }
        }

        $validator = Validator::make($arguments, [
            'id' => ['nullable', 'integer'],
            'slug' => ['nullable', 'string', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
            'body' => ['nullable', 'string'],
            'agent' => ['nullable', 'string', Rule::in(GrowthTask::AGENTS)],
        ], [
            'agent.in' => 'A task must be assigned to one of: '.implode(', ', GrowthTask::AGENTS).'. Never to meta, google-analytics, conversion, or brand — those observe or gate, they do not produce work.',
        ]);

        if ($validator->fails()) {
            return $this->json(['error' => $validator->errors()->first()]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        $id = $validated['id'] ?? null;
        $slug = $validated['slug'] ?? null;

        if ($id === null && $slug === null) {
            return $this->json(['error' => 'Name the task to update by id or slug.']);
        }

        $changes = array_filter(
            array_intersect_key($validated, array_flip(['name', 'body', 'agent'])),
            fn (mixed $value): bool => $value !== null,
        );

        if ($changes === []) {
            return $this->json(['error' => 'Nothing to update. Send at least one of name, body, or agent.']);
        }

        $task = $id !== null ? $this->plans->taskById((int) $id) : $this->plans->taskBySlug((string) $slug);

        if ($task === null) {
            $reference = $id !== null ? "id {$id}" : "slug '{$slug}'";

            return $this->json(['error' => "No growth task exists with {$reference}. Fetch the plan to see the tasks that do."]);
        }

        if ($task->status !== GrowthTask::STATUS_OPEN) {
            return $this->json(['error' => "Growth task '{$task->slug}' is {$task->status}, not open. A closed or dropped task is a settled record: edit only open work, and change a task's lifecycle through a plan run or a human in the admin."]);
        }

        return $this->json($this->plans->updateTask($task, $changes));
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()
                ->nullable()
                ->description('Id of the task to edit. Takes precedence over slug. Pass id or slug, not necessarily both.'),
            'slug' => $schema->string()
                ->nullable()
                ->description('Slug of the task to edit, if you do not have its id.'),
            'name' => $schema->string()
                ->nullable()
                ->description('New title for the task. Omit to leave it unchanged.'),
            'body' => $schema->string()
                ->nullable()
                ->description('New body: what the work is, what done looks like, and the tagged facts that motivate it. It must stay executable without this conversation. Keep the provenance tags on any fact carried from a report. Omit to leave it unchanged.'),
            'agent' => $schema->string()
                ->nullable()
                ->description('Reassign the task to one of: '.implode(', ', GrowthTask::AGENTS).'. Omit to leave the assignee unchanged.'),
        ];
    }
}
