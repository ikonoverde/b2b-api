<?php

namespace App\Models;

use Database\Factories\GrowthTaskFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One unit of work under an action, assigned to exactly one agent.
 */
class GrowthTask extends Model
{
    /** @use HasFactory<GrowthTaskFactory> */
    use HasFactory;

    public const AGENT_CONTENT = 'content';

    public const AGENT_KEYWORDS = 'keywords';

    public const AGENT_PAID_ACQUISITION = 'paid-acquisition';

    public const AGENT_SOCIAL_MEDIA = 'social-media';

    /**
     * An AI agent can do this, but none of the four specialists is the right one: mining conversation
     * notes for phrasing, drafting a target list from the catalog.
     */
    public const AGENT_GENERIC = 'generic';

    /**
     * No agent can do this, however capable. Photographing a real bottle, flipping the GA4
     * internal-traffic filter in the Admin console, signing off on a product claim, telephoning a spa.
     * The blocker is physical, or a credential, or judgement a person must own.
     */
    public const AGENT_HUMAN = 'human';

    /**
     * The only legal assignees. Ask one question to choose: if I spawn an agent with the right tools
     * and walk away, does this get done? If yes, one of the specialists, or generic. If it stalls
     * waiting on a body, a login, or a signature, human.
     *
     * The mislabel is expensive in one direction. A human task handed to an agent does not fail
     * cleanly — the agent produces something adjacent and plausible, an AI image standing in for a
     * product photograph, and that reaches a buyer as a claim about a physical object. A generic task
     * mislabelled human merely waits for somebody who did not need to be involved.
     *
     * Never meta, google-analytics, conversion, or brand: the first two only observe, and the last two
     * are gates that run against finished work rather than producing it.
     *
     * @var string[]
     */
    public const AGENTS = [
        self::AGENT_CONTENT,
        self::AGENT_KEYWORDS,
        self::AGENT_PAID_ACQUISITION,
        self::AGENT_SOCIAL_MEDIA,
        self::AGENT_GENERIC,
        self::AGENT_HUMAN,
    ];

    public const STATUS_OPEN = 'open';

    public const STATUS_DONE = 'done';

    public const STATUS_DROPPED = 'dropped';

    /** @var string[] */
    public const STATUSES = [
        self::STATUS_OPEN,
        self::STATUS_DONE,
        self::STATUS_DROPPED,
    ];

    /**
     * A marketing report observed that the work landed, and GrowthPlanService verified that claim
     * against the metric itself before writing it here.
     */
    public const CLOSED_BY_REPORT = 'report';

    /** A person said so. */
    public const CLOSED_BY_HUMAN = 'human';

    /** @var string[] */
    public const CLOSED_BY = [
        self::CLOSED_BY_REPORT,
        self::CLOSED_BY_HUMAN,
    ];

    public const COLUMN_TODO = 'todo';

    public const COLUMN_IN_PROGRESS = 'in_progress';

    public const COLUMN_REVIEW = 'review';

    public const COLUMN_DONE = 'done';

    /**
     * The kanban columns, and they are a reading of existing state rather than a new one. To Do and In
     * Progress split open tasks by started_at, Review is the open tasks waiting on a closure decision,
     * and Done is the closed ones. Dropped tasks are on no column: they were discarded, not finished.
     *
     * @var string[]
     */
    public const COLUMNS = [
        self::COLUMN_TODO,
        self::COLUMN_IN_PROGRESS,
        self::COLUMN_REVIEW,
        self::COLUMN_DONE,
    ];

    protected $fillable = [
        'growth_action_id',
        'slug',
        'name',
        'body',
        'agent',
        'status',
        'started_at',
        'source_marketing_report_id',
        'created_by_growth_plan_id',
        'updated_by_growth_plan_id',
        'closed_at',
        'closed_by',
        'close_evidence',
        'closure_proposed_at',
        'closure_proposal_reason',
        'closure_proposed_by_growth_plan_id',
        'drop_reason',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'closed_at' => 'datetime',
            'closure_proposed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<GrowthAction, $this>
     */
    public function action(): BelongsTo
    {
        return $this->belongsTo(GrowthAction::class, 'growth_action_id');
    }

    /**
     * @return BelongsTo<MarketingReport, $this>
     */
    public function sourceReport(): BelongsTo
    {
        return $this->belongsTo(MarketingReport::class, 'source_marketing_report_id');
    }

    /**
     * @return BelongsTo<GrowthPlan, $this>
     */
    public function closureProposedByPlan(): BelongsTo
    {
        return $this->belongsTo(GrowthPlan::class, 'closure_proposed_by_growth_plan_id');
    }

    /**
     * @param  Builder<GrowthTask>  $query
     */
    public function scopeOpen(Builder $query): void
    {
        $query->where('status', self::STATUS_OPEN);
    }

    /**
     * Tasks an agent wanted to close and could not prove. These are the only rows in this table
     * waiting on a person.
     *
     * @param  Builder<GrowthTask>  $query
     */
    public function scopeAwaitingClosureDecision(Builder $query): void
    {
        $query->where('status', self::STATUS_OPEN)->whereNotNull('closure_proposed_at');
    }

    public function isOpen(): bool
    {
        return $this->status === self::STATUS_OPEN;
    }

    public function isDone(): bool
    {
        return $this->status === self::STATUS_DONE;
    }

    public function hasProposedClosure(): bool
    {
        return $this->isOpen() && $this->closure_proposed_at !== null;
    }

    /**
     * Where this task sits on the kanban board, or null for a dropped task, which sits nowhere.
     */
    public function boardColumn(): ?string
    {
        if ($this->isDone()) {
            return self::COLUMN_DONE;
        }

        if ($this->hasProposedClosure()) {
            return self::COLUMN_REVIEW;
        }

        if ($this->isOpen()) {
            return $this->started_at === null ? self::COLUMN_TODO : self::COLUMN_IN_PROGRESS;
        }

        return null;
    }
}
