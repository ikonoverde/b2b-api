<?php

namespace App\Models;

use Database\Factories\GrowthActionFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A goal worth pursuing. It has at least one task under it, and usually several.
 *
 * Actions are not owned by the plan run that proposed them. They outlive it, and every later run reads
 * them before it decides what to add — otherwise a plan is just the same few ideas re-derived each time
 * somebody asks.
 */
class GrowthAction extends Model
{
    /** @use HasFactory<GrowthActionFactory> */
    use HasFactory;

    public const STATUS_OPEN = 'open';

    public const STATUS_DONE = 'done';

    public const STATUS_DROPPED = 'dropped';

    /** @var string[] */
    public const STATUSES = [
        self::STATUS_OPEN,
        self::STATUS_DONE,
        self::STATUS_DROPPED,
    ];

    protected $fillable = [
        'slug',
        'name',
        'summary',
        'status',
        'closed_at',
        'created_by_growth_plan_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'closed_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<GrowthTask, $this>
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(GrowthTask::class);
    }

    /**
     * @return BelongsTo<GrowthPlan, $this>
     */
    public function createdByPlan(): BelongsTo
    {
        return $this->belongsTo(GrowthPlan::class, 'created_by_growth_plan_id');
    }

    /**
     * @param  Builder<GrowthAction>  $query
     */
    public function scopeOpen(Builder $query): void
    {
        $query->where('status', self::STATUS_OPEN);
    }

    public function isOpen(): bool
    {
        return $this->status === self::STATUS_OPEN;
    }
}
