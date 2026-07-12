<?php

namespace App\Models;

use Database\Factories\MarketingReportFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A marketing status report: the full markdown, plus every value it observed.
 *
 * Reports are read in sequence — each run compares against the previous few — so a value recorded
 * here is not read once but chained. A laundered number does not mislead a single reader; it
 * propagates into every delta computed after it.
 */
class MarketingReport extends Model
{
    /** @use HasFactory<MarketingReportFactory> */
    use HasFactory;

    /**
     * Metric keys projected onto this table's own columns, so common filters and sorts do not need
     * a join. Populated from OBSERVED numeric metrics only; anything else leaves the column null.
     *
     * @var array<string, string>
     */
    public const HEADLINE_METRICS = [
        'ga4.sessions' => 'ga4_sessions',
        'ga4.total_users' => 'ga4_total_users',
        'ga4.screen_page_views' => 'ga4_page_views',
        'ga4.purchase_events' => 'ga4_purchase_events',
        'meta.Purchase.total' => 'meta_purchase_events',
        'fb.fans' => 'fb_fans',
        'ig.followers' => 'ig_followers',
    ];

    protected $fillable = [
        'reported_on',
        'window_start',
        'window_end',
        'ga4_property_id',
        'body',
        'agents_run',
        'reachability',
        'compared_against',
        'ga4_sessions',
        'ga4_total_users',
        'ga4_page_views',
        'ga4_purchase_events',
        'meta_purchase_events',
        'fb_fans',
        'ig_followers',
        'superseded_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'reported_on' => 'date',
            'window_start' => 'date',
            'window_end' => 'date',
            'agents_run' => 'array',
            'reachability' => 'array',
            'compared_against' => 'array',
            'ga4_sessions' => 'integer',
            'ga4_total_users' => 'integer',
            'ga4_page_views' => 'integer',
            'ga4_purchase_events' => 'integer',
            'meta_purchase_events' => 'integer',
            'fb_fans' => 'integer',
            'ig_followers' => 'integer',
            'superseded_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<MarketingReportMetric, $this>
     */
    public function metrics(): HasMany
    {
        return $this->hasMany(MarketingReportMetric::class);
    }

    /**
     * Reports that still stand. A superseded report is kept for the record but must never be read
     * as the reading for its day, and must never be an endpoint of a delta.
     *
     * @param  Builder<MarketingReport>  $query
     */
    public function scopeCurrent(Builder $query): void
    {
        $query->whereNull('superseded_at');
    }

    public function isSuperseded(): bool
    {
        return $this->superseded_at !== null;
    }
}
