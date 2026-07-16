<?php

use App\Ai\Agents\ContentAgent;
use App\Ai\Agents\KeywordsAgent;
use App\Ai\Agents\PaidAcquisitionAgent;
use App\Ai\Agents\SocialMediaAgent;
use App\Jobs\ExecuteGrowthTask;
use App\Models\GrowthTask;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Support\Facades\Queue;
use Laravel\Ai\Prompts\AgentPrompt;

function fakeEverySpecialist(): void
{
    ContentAgent::fake(['Done what I could; a draft is filed.']);
    KeywordsAgent::fake(['Research reported.']);
    PaidAcquisitionAgent::fake(['Proposal drafted.']);
    SocialMediaAgent::fake(['Draft queued for approval.']);
}

it('prompts the assigned agent with the task, the action it serves, and the closure rule', function () {
    $task = GrowthTask::factory()->started()->create();

    ContentAgent::fake(['A draft is filed.']);

    new ExecuteGrowthTask($task)->handle();

    ContentAgent::assertPrompted(fn (AgentPrompt $prompt): bool => $prompt->contains($task->slug)
        && $prompt->contains($task->name)
        && $prompt->contains($task->action->name)
        && $prompt->contains('You cannot close this task'));
});

it('routes the task to the specialist it is assigned to, and no other', function (string $agent, string $expected) {
    $task = GrowthTask::factory()->agent($agent)->started()->create();

    fakeEverySpecialist();

    new ExecuteGrowthTask($task)->handle();

    foreach ([ContentAgent::class, KeywordsAgent::class, PaidAcquisitionAgent::class, SocialMediaAgent::class] as $specialist) {
        $specialist === $expected
            ? $specialist::assertPrompted(fn (AgentPrompt $prompt): bool => $prompt->contains($task->slug))
            : $specialist::assertNeverPrompted();
    }
})->with([
    'content' => [GrowthTask::AGENT_CONTENT, ContentAgent::class],
    'keywords' => [GrowthTask::AGENT_KEYWORDS, KeywordsAgent::class],
    'paid-acquisition' => [GrowthTask::AGENT_PAID_ACQUISITION, PaidAcquisitionAgent::class],
    'social-media' => [GrowthTask::AGENT_SOCIAL_MEDIA, SocialMediaAgent::class],
]);

/**
 * The drag into En curso was the authorization, and the board may have moved on between dispatch and
 * run. If the card is no longer there, the authorization was withdrawn, and running anyway would spend
 * an agent on work nobody is claiming is in progress.
 */
it('does not run a task that has left En curso by the time the job runs', function (GrowthTask $task) {
    fakeEverySpecialist();

    new ExecuteGrowthTask($task)->handle();

    ContentAgent::assertNeverPrompted();
})->with([
    'back to Por hacer' => fn () => GrowthTask::factory()->create(),
    'awaiting a closure decision' => fn () => GrowthTask::factory()->started()->closureProposed()->create(),
    'closed' => fn () => GrowthTask::factory()->closedByHuman()->create(),
    'dropped' => fn () => GrowthTask::factory()->dropped()->create(),
]);

/**
 * `human` is blocked on a body or a credential no agent holds, and `generic` is by definition work none
 * of the four specialists is right for. Handing either to a specialist anyway would not fail cleanly —
 * it would produce something adjacent and plausible.
 */
it('runs nothing for an assignee no agent can execute for', function (string $agent) {
    $task = GrowthTask::factory()->agent($agent)->started()->create();

    fakeEverySpecialist();

    new ExecuteGrowthTask($task)->handle();

    ContentAgent::assertNeverPrompted();
    KeywordsAgent::assertNeverPrompted();
    PaidAcquisitionAgent::assertNeverPrompted();
    SocialMediaAgent::assertNeverPrompted();
})->with([
    'human' => GrowthTask::AGENT_HUMAN,
    'generic' => GrowthTask::AGENT_GENERIC,
]);

/**
 * A finished run leaves drafts and proposals for a person to decide on, which is exactly what En
 * revisión holds. So the card moves there as a closure proposal — open, named, and never a close.
 */
it('moves the task to En revisión as a proposal once the run finishes', function () {
    $task = GrowthTask::factory()->agent(GrowthTask::AGENT_SOCIAL_MEDIA)->started()->create();

    SocialMediaAgent::fake(['Draft queued for approval.']);

    new ExecuteGrowthTask($task)->handle();

    $task->refresh();

    expect($task->boardColumn())->toBe(GrowthTask::COLUMN_REVIEW)
        ->and($task->hasProposedClosure())->toBeTrue()
        ->and($task->closure_proposal_reason)->toContain(GrowthTask::AGENT_SOCIAL_MEDIA)
        ->and($task->status)->toBe(GrowthTask::STATUS_OPEN)
        ->and($task->closed_at)->toBeNull()
        ->and($task->closed_by)->toBeNull();
});

/**
 * The move to En revisión only lands if the card is still on En curso when the run ends. A person who
 * moved it during the minutes the agent worked has decided otherwise, and the finished run must not
 * undo that decision.
 */
it('does not move a card a person took off En curso while the agent worked', function () {
    $task = GrowthTask::factory()->started()->create();

    ContentAgent::fake(function (string $prompt) use ($task): string {
        GrowthTask::whereKey($task->getKey())->update([
            'status' => GrowthTask::STATUS_DONE,
            'closed_at' => now(),
            'closed_by' => GrowthTask::CLOSED_BY_HUMAN,
            'close_evidence' => 'Confirmed in the admin.',
        ]);

        return 'A draft is filed.';
    });

    new ExecuteGrowthTask($task)->handle();

    $task->refresh();

    expect($task->closure_proposed_at)->toBeNull()
        ->and($task->status)->toBe(GrowthTask::STATUS_DONE)
        ->and($task->closed_by)->toBe(GrowthTask::CLOSED_BY_HUMAN);
});

it('tells the agent the run is unattended and its output stays a draft', function () {
    $task = GrowthTask::factory()->started()->create();

    ContentAgent::fake(['...']);

    new ExecuteGrowthTask($task)->handle();

    ContentAgent::assertPrompted(fn (AgentPrompt $prompt): bool => $prompt->contains('unattended run')
        && $prompt->contains('never claim something went live'));
});

it('runs on a connection that allows it to take as long as its timeout', function () {
    $job = new ExecuteGrowthTask(GrowthTask::factory()->started()->create());

    // Redis releases a reserved job to another worker once retry_after elapses, running or not, so a
    // job whose timeout exceeds it is silently run again alongside itself.
    expect($job->timeout)->toBeLessThan(config("queue.connections.{$job->connection}.retry_after"));
});

it('is queued off the default queue, where a minutes-long run would block short jobs', function () {
    Queue::fake();

    ExecuteGrowthTask::dispatch(GrowthTask::factory()->started()->create());

    Queue::assertPushedOn('agents', ExecuteGrowthTask::class);
});

it('dispatches without a uniqueness lock, so a dispatch is never silently discarded', function () {
    expect(new ExecuteGrowthTask(GrowthTask::factory()->started()->create()))
        ->not->toBeInstanceOf(ShouldBeUnique::class);
});
