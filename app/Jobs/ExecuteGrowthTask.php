<?php

namespace App\Jobs;

use App\Ai\Agents\BaseChatAgent;
use App\Ai\Agents\ContentAgent;
use App\Ai\Agents\KeywordsAgent;
use App\Ai\Agents\PaidAcquisitionAgent;
use App\Ai\Agents\SocialMediaAgent;
use App\Ai\GrowthTaskContext;
use App\Models\GrowthTask;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

/**
 * A person dragged an agent's task into En curso, so the agent is put to work on it. The drag is the
 * whole authorization: the plan already judged the work worth doing, and the drag chose to spend a run
 * on it now.
 *
 * The agent executes through its own tools, which means everything it produces lands as a draft or a
 * proposal a human still has to approve — this job adds no new way for agent output to go live. Nor a
 * new way to close: a run that finishes moves the card to En revisión, which is a proposal for a human
 * to close and not a close. The task stays open, whatever the agent produced, because closure is a
 * person's decision in the admin and doing the work has never been the same claim as proving it landed.
 */
class ExecuteGrowthTask implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    /**
     * An agent run that reads the catalog, drafts, and sends its copy through the brand reviewer is a
     * long round trip, and nothing is waiting on the result. This must stay below the connection's
     * retry_after (redis-agents allows 1800s): Redis releases a reserved job to another worker once
     * retry_after elapses, running or not, so a job that outlives it is silently run again alongside
     * itself.
     */
    public int $timeout = 900;

    /**
     * Not the default queue: a run of this takes minutes, and `default` allows a job 90 seconds before
     * it hands it to a second worker.
     */
    public function __construct(public GrowthTask $task)
    {
        $this->onConnection('redis-agents')->onQueue('agents');
    }

    /**
     * The agent class that can execute tasks assigned to this assignee, or null when none can. Only the
     * four specialists execute: `human` is blocked on a body or a credential no agent holds, and
     * `generic` is defined as work none of the four is right for — handing it to one anyway would
     * produce something adjacent and plausible instead of failing cleanly.
     *
     * @return class-string<BaseChatAgent>|null
     */
    public static function executorFor(string $agent): ?string
    {
        return match ($agent) {
            GrowthTask::AGENT_CONTENT => ContentAgent::class,
            GrowthTask::AGENT_KEYWORDS => KeywordsAgent::class,
            GrowthTask::AGENT_PAID_ACQUISITION => PaidAcquisitionAgent::class,
            GrowthTask::AGENT_SOCIAL_MEDIA => SocialMediaAgent::class,
            default => null,
        };
    }

    public function handle(): void
    {
        $task = $this->task->fresh(['action']);

        /**
         * The board may have moved on between dispatch and run: the card dragged back to Por hacer,
         * closed, or dropped. The drag into En curso was the authorization, and if the card is no
         * longer there, the authorization was withdrawn.
         */
        if ($task === null || $task->boardColumn() !== GrowthTask::COLUMN_IN_PROGRESS) {
            return;
        }

        $executor = self::executorFor($task->agent);

        if ($executor === null) {
            Log::warning('Growth task moved to En curso has no agent that can execute it.', [
                'task' => $task->slug,
                'agent' => $task->agent,
            ]);

            return;
        }

        /**
         * The task is held in ambient context for the length of the run so that every artifact the
         * agent files through its tools is stamped with the task that produced it. It must be cleared
         * afterwards: this worker is long-lived, and a task left here would be stamped onto the next
         * job's artifacts.
         */
        $context = app(GrowthTaskContext::class);
        $context->set($task);

        try {
            $response = new $executor()->prompt($this->prompt($task));
        } finally {
            $context->clear();
        }

        /**
         * The run's durable output is whatever the agent filed through its tools — a blog draft, a
         * social post draft, an ad proposal. The response text lives only here, where nothing
         * downstream can mistake it for work that shipped.
         */
        Log::info('Growth task executed by its agent.', [
            'task' => $task->slug,
            'agent' => $task->agent,
            'response' => (string) $response,
        ]);

        $this->flagForReview($task);
    }

    /**
     * The run is over and its output is filed as drafts and proposals — the exact state En revisión
     * names: an agent finished and a person now has to decide the closure. So the card is moved there
     * with a proposal, the same shape a report-driven proposal takes, never a close.
     *
     * The re-fetch is the guard the run itself needs: minutes passed while the agent worked, and a
     * person may have moved the card off En curso in that time. If they did, their move stands and this
     * does nothing — reaching only when the card is still where the drag left it.
     */
    private function flagForReview(GrowthTask $task): void
    {
        $task = $task->fresh();

        if ($task === null || $task->boardColumn() !== GrowthTask::COLUMN_IN_PROGRESS) {
            return;
        }

        $task->update([
            'closure_proposed_at' => now(),
            'closure_proposal_reason' => sprintf('El agente %s terminó de ejecutar la tarea. Lo que produjo quedó como borrador o propuesta; revisa y decide el cierre.', $task->agent),
            'closure_proposed_by_growth_plan_id' => null,
        ]);
    }

    /**
     * The rules of the specialty live in the agent's instructions, which it carries on every run,
     * whoever prompts it. What belongs here is only the task itself and what is true of an unattended
     * run.
     */
    private function prompt(GrowthTask $task): string
    {
        $action = $task->action;

        return <<<PROMPT
        A person moved the growth task '{$task->slug}' into En curso on the admin board. That drag is your instruction: the growth plan already judged this work worth doing, and somebody has now chosen to spend your run on it. Do the work, with your tools, in this run.

        The task, as the plan recorded it:

        Name: {$task->name}
        Serves the action '{$action->name}': {$action->summary}

        {$task->body}

        This is an unattended run. Nobody is here to answer a question, so do not end by asking one — decide, do, and report. Everything you produce goes through your normal tools and stays a draft or a proposal for a human to approve; never claim something went live. You cannot close this task and must not say it is done: report exactly what you produced and where it now sits, and a person will decide the closure in the admin.
        PROMPT;
    }
}
