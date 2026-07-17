<?php

use App\Ai\Agents\ContentAgent;
use App\Ai\GrowthTaskContext;
use App\Jobs\ExecuteGrowthTask;
use App\Models\AdProposal;
use App\Models\Banner;
use App\Models\BlogPost;
use App\Models\GrowthTask;
use App\Models\Report;
use App\Models\SocialPostDraft;
use App\Models\StaticPage;

function growthContext(): GrowthTaskContext
{
    return app(GrowthTaskContext::class);
}

/**
 * The whole point of the abstraction: while a task runs, anything an agent files is stamped with the
 * task that produced it — without the agent's tools passing the task through.
 */
it('links an artifact an agent files during a run to the running task', function () {
    $task = GrowthTask::factory()->agent(GrowthTask::AGENT_CONTENT)->started()->create();

    ContentAgent::fake(function () use ($task): string {
        BlogPost::factory()->create();

        expect(growthContext()->current()->id)->toBe($task->id);

        return 'A draft is filed.';
    });

    new ExecuteGrowthTask($task)->handle();

    expect(BlogPost::sole()->growth_task_id)->toBe($task->id);
});

it('clears the running task from context once the run ends', function () {
    $task = GrowthTask::factory()->agent(GrowthTask::AGENT_CONTENT)->started()->create();

    ContentAgent::fake(['A draft is filed.']);

    new ExecuteGrowthTask($task)->handle();

    expect(growthContext()->current())->toBeNull();
});

it('clears the context even when the agent run throws', function () {
    $task = GrowthTask::factory()->agent(GrowthTask::AGENT_CONTENT)->started()->create();

    ContentAgent::fake(function (): string {
        throw new RuntimeException('boom');
    });

    expect(fn () => new ExecuteGrowthTask($task)->handle())->toThrow(RuntimeException::class);

    expect(growthContext()->current())->toBeNull();
});

/**
 * The MCP and admin paths create the same records through the same services, but outside any run. Those
 * must stay unlinked, or a hand-drafted proposal would claim to be an agent's task output.
 */
it('leaves an artifact created outside a run unlinked', function () {
    $proposal = AdProposal::factory()->create();

    expect($proposal->growth_task_id)->toBeNull();
});

it('stamps every artifact type created while a task is in context', function () {
    $task = GrowthTask::factory()->create();
    growthContext()->set($task);

    try {
        $artifacts = [
            AdProposal::factory()->create(),
            BlogPost::factory()->create(),
            SocialPostDraft::factory()->create(),
            Banner::factory()->create(),
            StaticPage::factory()->create(),
            Report::factory()->create(),
        ];
    } finally {
        growthContext()->clear();
    }

    foreach ($artifacts as $artifact) {
        expect($artifact->fresh()->growth_task_id)->toBe($task->id);
    }
});

it('does not overwrite a growth task explicitly set on the artifact', function () {
    $running = GrowthTask::factory()->create();
    $explicit = GrowthTask::factory()->create();
    growthContext()->set($running);

    try {
        $proposal = AdProposal::factory()->create(['growth_task_id' => $explicit->id]);
    } finally {
        growthContext()->clear();
    }

    expect($proposal->growth_task_id)->toBe($explicit->id);
});

it('gathers a task\'s artifacts across their separate tables, newest first', function () {
    $task = GrowthTask::factory()->create();
    $other = GrowthTask::factory()->create();

    $older = AdProposal::factory()->create(['growth_task_id' => $task->id, 'created_at' => now()->subDay()]);
    $newer = BlogPost::factory()->create(['growth_task_id' => $task->id, 'created_at' => now()]);
    AdProposal::factory()->create(['growth_task_id' => $other->id]);
    AdProposal::factory()->create();

    $artifacts = $task->artifacts();

    expect($artifacts)->toHaveCount(2)
        ->and($artifacts->first())->toBeInstanceOf(BlogPost::class)
        ->and($artifacts->first()->id)->toBe($newer->id)
        ->and($artifacts->last()->id)->toBe($older->id);
});
