<?php

namespace App\Http\Controllers\Admin\MarketingReports;

use App\Http\Controllers\Controller;
use App\Models\MarketingReport;
use App\Models\MarketingReportMetric;
use Inertia\Inertia;
use Inertia\Response;

class ShowMarketingReportController extends Controller
{
    public function __invoke(MarketingReport $marketingReport): Response
    {
        $marketingReport->load(['metrics' => fn ($query) => $query->orderBy('key')]);

        return Inertia::render('admin/marketing-reports/Show', [
            'report' => [
                'id' => $marketingReport->id,
                'reported_on' => $marketingReport->reported_on->toDateString(),
                'window_start' => $marketingReport->window_start?->toDateString(),
                'window_end' => $marketingReport->window_end?->toDateString(),
                'ga4_property_id' => $marketingReport->ga4_property_id,
                'body' => $marketingReport->body,
                'agents_run' => $marketingReport->agents_run,
                'reachability' => $marketingReport->reachability,
                'compared_against' => $marketingReport->compared_against ?? [],
                'superseded_at' => $marketingReport->superseded_at?->toISOString(),
                'created_at' => $marketingReport->created_at?->toISOString(),
                'metrics' => $marketingReport->metrics
                    ->map(fn (MarketingReportMetric $metric): array => [
                        'id' => $metric->id,
                        'key' => $metric->key,
                        'provenance' => $metric->provenance,
                        'numeric_value' => $metric->numeric_value,
                        'text_value' => $metric->text_value,
                        'note' => $metric->note,
                    ])
                    ->all(),
            ],
            'previous' => $this->previousReading($marketingReport),
        ]);
    }

    /**
     * The reading this report's numbers may be compared against: the newest standing report before
     * it. A superseded report is never an endpoint of a delta, so it can never be the previous one.
     *
     * The headline columns are the only values safe to subtract, because the service projects them
     * from OBSERVED metrics alone. Null still means nobody looked; the page must not subtract it.
     *
     * @return array<string, mixed>|null
     */
    private function previousReading(MarketingReport $report): ?array
    {
        $previous = MarketingReport::query()
            ->current()
            ->whereDate('reported_on', '<', $report->reported_on)
            ->orderByDesc('reported_on')
            ->orderByDesc('id')
            ->first();

        if ($previous === null) {
            return null;
        }

        return [
            'id' => $previous->id,
            'reported_on' => $previous->reported_on->toDateString(),
            'headlines' => collect(MarketingReport::HEADLINE_METRICS)
                ->mapWithKeys(fn (string $column, string $key): array => [$key => $previous->{$column}])
                ->all(),
        ];
    }
}
