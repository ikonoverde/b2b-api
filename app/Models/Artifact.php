<?php

namespace App\Models;

use App\Ai\GrowthTaskContext;
use App\Jobs\ExecuteGrowthTask;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Anything an agent generates during an {@see ExecuteGrowthTask} run: a blog draft, an ad
 * proposal, a social post draft. Every artifact carries the growth task that produced it, so the task
 * details page can show what a run actually filed.
 *
 * The link is stamped once, on creation, from the ambient {@see GrowthTaskContext}. During a task run
 * the job sets that context, so every artifact created in the run is linked without any tool or service
 * having to pass the task through. Outside a run — the human-gated MCP and admin paths — the context is
 * empty and `growth_task_id` stays null.
 */
abstract class Artifact extends Model
{
    /**
     * The concrete artifact models, used to gather every artifact a task produced across their separate
     * tables. Adding a model here is what makes it show up on the task details page.
     *
     * @var list<class-string<Artifact>>
     */
    public const ARTIFACT_MODELS = [
        AdProposal::class,
        BlogPost::class,
        SocialPostDraft::class,
        Banner::class,
        StaticPage::class,
        Report::class,
    ];

    protected static function booted(): void
    {
        static::creating(function (Artifact $artifact): void {
            if ($artifact->growth_task_id === null) {
                $artifact->growth_task_id = app(GrowthTaskContext::class)->current()?->id;
            }
        });
    }

    /**
     * @return BelongsTo<GrowthTask, $this>
     */
    public function growthTask(): BelongsTo
    {
        return $this->belongsTo(GrowthTask::class);
    }

    /**
     * The kind of artifact this is, for the badge on the task details page.
     */
    abstract public function artifactLabel(): string;

    /**
     * The artifact's own human-readable title.
     */
    abstract public function artifactTitle(): string;

    /**
     * A link to this artifact's own admin detail page, or null when it has none.
     */
    abstract public function adminUrl(): ?string;
}
