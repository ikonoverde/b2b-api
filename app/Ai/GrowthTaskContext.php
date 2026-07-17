<?php

namespace App\Ai;

use App\Jobs\ExecuteGrowthTask;
use App\Models\Artifact;
use App\Models\GrowthTask;

/**
 * The single growth task an agent is executing right now, held for the length of one
 * {@see ExecuteGrowthTask} run so that anything the agent files through its tools can be
 * stamped with the task that produced it.
 *
 * Registered as a container singleton and read by {@see Artifact} at creation time. Outside
 * a task run — the human-gated MCP and admin paths — nothing sets it, so those artifacts stay unlinked.
 * The job must clear it in a `finally`: a queue worker is long-lived, and a task left here would be
 * stamped onto the next job's artifacts.
 */
class GrowthTaskContext
{
    private ?GrowthTask $current = null;

    public function set(GrowthTask $task): void
    {
        $this->current = $task;
    }

    public function clear(): void
    {
        $this->current = null;
    }

    public function current(): ?GrowthTask
    {
        return $this->current;
    }
}
