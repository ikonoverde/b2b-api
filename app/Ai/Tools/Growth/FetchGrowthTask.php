<?php

namespace App\Ai\Tools\Growth;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Models\GrowthTask;
use App\Services\Growth\GrowthPlanService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Facades\Validator;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

/**
 * Read the growth work already assigned to this specialist, so it stops inventing its own.
 *
 * The tool is scoped to one assignee, and the scope is a guarantee rather than a request: a task
 * belonging to another specialist cannot be fetched, and neither can one assigned to `human`. That
 * last case is why the filter is in the query and not in the prompt. A human task is blocked on a
 * body, a credential, or a signature — photographing a real bottle — and an agent handed one does not
 * fail cleanly. It produces something adjacent and plausible, an AI image standing in for a product
 * photograph, and that reaches a buyer as a claim about a physical object.
 *
 * Fetching is all it does. Nothing here closes a task: closure is a human's decision in the admin, and
 * an agent that could mark its own homework done would.
 */
class FetchGrowthTask implements Tool
{
    use FormatsToolResponses;

    public function __construct(
        private GrowthPlanService $plans,
        private string $agent = GrowthTask::AGENT_CONTENT,
    ) {}

    public function name(): string
    {
        return 'growth_fetch_task';
    }

    public function description(): Stringable|string
    {
        return 'Fetch the growth tasks assigned to you. Pass no slug to list every open one, or a slug to read a single task with the action it serves. The growth plan is the standing record of what somebody decided was worth doing, so read it before you invent work of your own. This tool only returns tasks assigned to your specialty, it cannot change a task, and it cannot close one: a human closes tasks in the admin.';
    }

    public function handle(Request $request): Stringable|string
    {
        $arguments = $request->all();

        if (is_string($arguments['slug'] ?? null)) {
            $arguments['slug'] = trim($arguments['slug']) === '' ? null : trim($arguments['slug']);
        }

        $validator = Validator::make($arguments, [
            'slug' => ['nullable', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return $this->json(['error' => $validator->errors()->first()]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        $slug = $validated['slug'] ?? null;

        if ($slug === null) {
            return $this->json($this->openTasks());
        }

        return $this->json($this->task($slug));
    }

    /**
     * @return array<string, mixed>
     */
    private function openTasks(): array
    {
        $tasks = $this->plans->openTasksFor($this->agent);

        return [
            'agent' => $this->agent,
            'open_tasks' => $tasks,
            'note' => $tasks === []
                ? "No open growth tasks are assigned to {$this->agent}. That is not an instruction to invent some: say so, and ask what the human wants rather than filling the silence with work nobody asked for."
                : 'Everything here is outstanding, whatever it looks like. A task open a long time is not evidence it was done. Doing the work does not close the task: report what you produced and let a human close it in the admin.',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function task(string $slug): array
    {
        $task = $this->plans->taskBySlug($slug);

        if ($task === null) {
            return ['error' => "No growth task exists with slug '{$slug}'. Call this tool with no slug to see the open tasks assigned to you."];
        }

        if ($task->agent !== $this->agent) {
            return ['error' => "Growth task '{$slug}' is assigned to {$task->agent}, not to {$this->agent}. Do not do it and do not produce a substitute for it: it belongs to another specialist, or to a person who has to do it themselves."];
        }

        return [
            'agent' => $this->agent,
            'task' => $this->plans->taskDetail($task),
        ];
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'slug' => $schema->string()
                ->nullable()
                ->description('Slug of a single growth task to read. Omit to list every open task assigned to you.'),
        ];
    }
}
