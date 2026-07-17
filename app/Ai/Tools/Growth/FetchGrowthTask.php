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
 *
 * A null `$agent` lifts the scope: the growth strategist coordinates across every specialist and reads
 * the whole plan, not one lane of it. The guarantee still holds for the scoped specialists that execute.
 */
class FetchGrowthTask implements Tool
{
    use FormatsToolResponses;

    public function __construct(
        private GrowthPlanService $plans,
        private ?string $agent = GrowthTask::AGENT_CONTENT,
    ) {}

    public function name(): string
    {
        return 'growth_fetch_task';
    }

    public function description(): Stringable|string
    {
        if ($this->agent === null) {
            return 'Fetch growth tasks across every specialist. Pass no arguments to list every open task with the agent each is assigned to, or an id or slug to read a single task with the action it serves. The growth plan is the standing record of what somebody decided was worth doing, so read it before you invent work of your own. This is a coordinator view for planning: it cannot change a task, and it cannot close one, a human closes tasks in the admin.';
        }

        return 'Fetch the growth tasks assigned to you. Pass no arguments to list every open one, or an id or slug to read a single task with the action it serves. The growth plan is the standing record of what somebody decided was worth doing, so read it before you invent work of your own. This tool only returns tasks assigned to your specialty, it cannot change a task, and it cannot close one: a human closes tasks in the admin.';
    }

    public function handle(Request $request): Stringable|string
    {
        $arguments = $request->all();

        if (is_string($arguments['slug'] ?? null)) {
            $arguments['slug'] = trim($arguments['slug']) === '' ? null : trim($arguments['slug']);
        }

        $validator = Validator::make($arguments, [
            'id' => ['nullable', 'integer'],
            'slug' => ['nullable', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return $this->json(['error' => $validator->errors()->first()]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        $id = $validated['id'] ?? null;
        $slug = $validated['slug'] ?? null;

        if ($id !== null) {
            return $this->json($this->taskById((int) $id));
        }

        if ($slug !== null) {
            return $this->json($this->taskBySlug($slug));
        }

        return $this->json($this->openTasks());
    }

    /**
     * @return array<string, mixed>
     */
    private function openTasks(): array
    {
        if ($this->agent === null) {
            $tasks = $this->plans->openTasks();

            return [
                'agent' => 'all',
                'open_tasks' => $tasks,
                'note' => $tasks === []
                    ? 'No growth tasks are open for any specialist right now. That is not an instruction to invent some: say so, and ask what the human wants rather than filling the silence with work nobody asked for.'
                    : 'Every open task across all specialists is here, each labelled with the agent it belongs to. This is a coordinator view for planning, not a queue to work: doing a task does not close it, and a human closes tasks in the admin.',
            ];
        }

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
    private function taskBySlug(string $slug): array
    {
        $task = $this->plans->taskBySlug($slug);

        if ($task === null) {
            return ['error' => "No growth task exists with slug '{$slug}'. Call this tool with no arguments to see the open tasks assigned to you."];
        }

        return $this->present($task, "'{$slug}'");
    }

    /**
     * @return array<string, mixed>
     */
    private function taskById(int $id): array
    {
        $task = $this->plans->taskById($id);

        if ($task === null) {
            return ['error' => "No growth task exists with id {$id}. Call this tool with no arguments to see the open tasks assigned to you."];
        }

        return $this->present($task, "#{$id}");
    }

    /**
     * Guard the assignee scope before handing a single task over, whichever way it was looked up.
     *
     * @return array<string, mixed>
     */
    private function present(GrowthTask $task, string $reference): array
    {
        if ($this->agent !== null && $task->agent !== $this->agent) {
            return ['error' => "Growth task {$reference} is assigned to {$task->agent}, not to {$this->agent}. Do not do it and do not produce a substitute for it: it belongs to another specialist, or to a person who has to do it themselves."];
        }

        return [
            'agent' => $task->agent,
            'task' => $this->plans->taskDetail($task),
        ];
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()
                ->nullable()
                ->description('Id of a single growth task to read. Takes precedence over slug. Omit both to list every open task assigned to you.'),
            'slug' => $schema->string()
                ->nullable()
                ->description('Slug of a single growth task to read. Omit both id and slug to list every open task assigned to you.'),
        ];
    }
}
