<?php

namespace App\Models;

use Database\Factories\MarketingReportMetricFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One tagged value from one report: ga4.sessions = 30, OBSERVED.
 */
class MarketingReportMetric extends Model
{
    /** @use HasFactory<MarketingReportMetricFactory> */
    use HasFactory;

    /**
     * A tool returned this value on that run. The only provenance a delta may be computed from.
     */
    public const PROVENANCE_OBSERVED = 'observed';

    /**
     * A judgement, not a measurement — model priors, inference from context. Recording it is useful;
     * subtracting it from an observation and calling the difference movement is not.
     */
    public const PROVENANCE_ESTIMATED = 'estimated';

    /**
     * Nobody could see it. The account was unreachable, the tool never loaded, or the value lives
     * somewhere no API can read (the GA4 internal-traffic filter state, for one).
     *
     * This is why zero is not the null of this table. An unreachable account and an account with
     * nothing in it produce identical downstream numbers and mean opposite things.
     */
    public const PROVENANCE_UNKNOWN = 'unknown';

    /** @var string[] */
    public const PROVENANCES = [
        self::PROVENANCE_OBSERVED,
        self::PROVENANCE_ESTIMATED,
        self::PROVENANCE_UNKNOWN,
    ];

    protected $fillable = [
        'marketing_report_id',
        'key',
        'provenance',
        'numeric_value',
        'text_value',
        'note',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'marketing_report_id' => 'integer',
            'numeric_value' => 'decimal:4',
        ];
    }

    /**
     * @return BelongsTo<MarketingReport, $this>
     */
    public function report(): BelongsTo
    {
        return $this->belongsTo(MarketingReport::class, 'marketing_report_id');
    }

    /**
     * @param  Builder<MarketingReportMetric>  $query
     */
    public function scopeObserved(Builder $query): void
    {
        $query->where('provenance', self::PROVENANCE_OBSERVED);
    }

    public function isObserved(): bool
    {
        return $this->provenance === self::PROVENANCE_OBSERVED;
    }
}
