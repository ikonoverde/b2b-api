<?php

namespace App\Ai\Tools\Growth;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Models\GrowthPlan;
use App\Models\GrowthTask;
use App\Services\Growth\GrowthPlanService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Facades\Validator;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use RuntimeException;
use Stringable;

class SaveGrowthPlan implements Tool
{
    use FormatsToolResponses;

    public function __construct(private GrowthPlanService $plans) {}

    public function name(): string
    {
        return 'growth_save_plan';
    }

    public function description(): Stringable|string
    {
        return 'File a growth plan: the recommendation in plain text, the paid-gate verdict, and the actions and tasks it produces. One call does the whole run — add what is new, update what has moved, close what the report proves is done, drop what is no longer worth doing. Everything you send lands or nothing does. Tasks are never deleted, and nothing here executes them: a human reads them and decides.';
    }

    public function handle(Request $request): Stringable|string
    {
        $validator = Validator::make(
            $this->plans->normalize($request->all()),
            $this->plans->rules(),
            $this->plans->messages(),
        );

        if ($validator->fails()) {
            return $this->json(['error' => $validator->errors()->first()]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        try {
            $result = $this->plans->save($validated);
        } catch (RuntimeException $exception) {
            return $this->json(['error' => $exception->getMessage()]);
        }

        return $this->json($this->plans->payload($result));
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'planned_on' => $schema->string()
                ->required()
                ->description('The date this plan was written, YYYY-MM-DD.'),
            'source_report_date' => $schema->string()
                ->required()
                ->description('The reported_on date of the marketing report this plan was reasoned from, YYYY-MM-DD. It must be a report that stands. Every task you file is traceable to it.'),
            'body' => $schema->string()
                ->required()
                ->description('The recommendation, in plain text or markdown, exactly as a person should read it: what you make of the baseline, what you propose, and why. Keep the provenance tags on any fact you carried over from the report — an OBSERVED session count stays OBSERVED, and everything you conclude from it is ESTIMATED. This is the part a human actually reads; the tasks below are how it gets done.'),
            'paid_gate' => $schema->string()
                ->required()
                ->description('Whether paid acquisition is appropriate at all right now: '.implode(' or ', GrowthPlan::PAID_GATES).'. This verdict is yours. If you shut it, file no paid-acquisition tasks — do not soften it into a small test, and do not create one because the channel list looks unbalanced without one.'),
            'paid_gate_reason' => $schema->string()
                ->required()
                ->description('Why the gate is where it is, in your own words. A verdict with no reasoning cannot be re-asked against the next baseline.'),
            'paid_gate_preconditions' => $schema->array()
                ->nullable()
                ->description('What would have to be true for the gate to open, or the conditions under which spend is allowed if it is already open. These are the checklist somebody has to satisfy.'),
            'actions' => $schema->array()
                ->nullable()
                ->description(
                    'The goals worth pursuing, each with the work under it. One object per action:'
                    .' {"slug":"kebab-case","name":"...","summary":"...","tasks":[{"slug":"kebab-case","name":"...","body":"...","agent":"content"}]}.'
                    .' A slug that already exists UPDATES that action or task in place; it does not create a second one. Dedupe by intent, not by title — "write a formats explainer" and "publish a page comparing professional formats" are one task, and the one already on file wins.'
                    .' agent is one of: '.implode(', ', GrowthTask::AGENTS).'.'
                    .' Assign it by asking one question: if somebody spawns an agent with the right tools and walks away, does this get done? If yes it is a specialist or generic. If it stalls waiting on a body, a login, or a signature, it is human — photographing a real bottle, flipping the GA4 internal-traffic filter, signing off on a claim.'
                    .' Prefer generic when the fit among the specialists is arguable, and human when it is arguable whether any agent can do it at all: a human task handed to an agent does not fail cleanly, it comes back with something adjacent and plausible.'
                    .' The body must be executable without this conversation: what the work is, what done looks like, and the tagged facts that motivate it.'
                ),
            'close_tasks' => $schema->array()
                ->nullable()
                ->description(
                    'Tasks the source report proves are done: [{"task_slug":"...","evidence_metric_key":"ig.display_name","reason":"..."}].'
                    .' You cannot close a task on your own judgement. Name the metric key from the source report that shows the work landed, and it is checked against that report before anything is written.'
                    .' If the report does not carry that key, or carries it as estimated or unknown rather than observed, the task is NOT closed. It stays open and your reasoning is filed as a proposal for a human to decide, and the response will tell you so. Do not then describe the task as done.'
                    .' This is not an obstacle to work around: nothing in this system executes these tasks and nothing writes back, so a task looks identical the day it is written and the day after the work ships. A closed task nobody did is a lie the next run acts on.'
                ),
            'drop_tasks' => $schema->array()
                ->nullable()
                ->description(
                    'Tasks the new baseline has made pointless: [{"task_slug":"...","reason":"..."}]. Dropping says the work is no longer worth doing — it never says it was done, so it is yours to decide, and a person can put it back.'
                    .' The reason is required and it is the only thing that stops the same idea being re-proposed next month. If the paid gate has shut after being open, drop the open paid-acquisition tasks: leaving them contradicts the verdict.'
                ),
        ];
    }
}
