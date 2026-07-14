<?php

namespace App\Models;

use Database\Factories\GrowthPlanFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * One planning run: what GrowthStrategyAgent recommended, and the baseline it read to get there.
 *
 * The plan itself is the actions and tasks, which outlive any run. This row is the argument that
 * produced them, kept whole so a task can always be traced back to the numbers that justified it.
 */
class GrowthPlan extends Model
{
    /** @use HasFactory<GrowthPlanFactory> */
    use HasFactory;

    /** Paid acquisition is appropriate now, subject to the preconditions the agent named. */
    public const PAID_GATE_OPEN = 'open';

    /**
     * Spend nothing yet. While this stands, no paid-acquisition task may be open — not softened into a
     * small test, and not created to balance a channel list that looks lopsided without one.
     */
    public const PAID_GATE_CLOSED = 'closed';

    /** @var string[] */
    public const PAID_GATES = [
        self::PAID_GATE_OPEN,
        self::PAID_GATE_CLOSED,
    ];

    protected $fillable = [
        'planned_on',
        'marketing_report_id',
        'body',
        'paid_gate',
        'paid_gate_reason',
        'paid_gate_preconditions',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'planned_on' => 'date',
            'paid_gate_preconditions' => 'array',
        ];
    }

    /**
     * @return BelongsTo<MarketingReport, $this>
     */
    public function sourceReport(): BelongsTo
    {
        return $this->belongsTo(MarketingReport::class, 'marketing_report_id');
    }

    /**
     * @return HasMany<GrowthAction, $this>
     */
    public function createdActions(): HasMany
    {
        return $this->hasMany(GrowthAction::class, 'created_by_growth_plan_id');
    }

    /**
     * @return HasMany<GrowthTask, $this>
     */
    public function createdTasks(): HasMany
    {
        return $this->hasMany(GrowthTask::class, 'created_by_growth_plan_id');
    }

    /**
     * @return HasMany<GrowthTask, $this>
     */
    public function updatedTasks(): HasMany
    {
        return $this->hasMany(GrowthTask::class, 'updated_by_growth_plan_id');
    }

    public function paidGateIsOpen(): bool
    {
        return $this->paid_gate === self::PAID_GATE_OPEN;
    }

    /**
     * The run that stands. Runs accumulate rather than overwrite, so the standing verdict is the
     * newest one, and the rows underneath it are the record of what changed its mind.
     */
    public static function current(): ?self
    {
        return self::query()
            ->orderByDesc('planned_on')
            ->orderByDesc('id')
            ->first();
    }
}
