<?php

namespace App\Http\Controllers\Admin\MarketingReports;

use App\Http\Controllers\Controller;
use App\Models\MarketingReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexMarketingReportsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $includeSuperseded = $request->boolean('superseded');

        $reports = MarketingReport::query()
            ->unless($includeSuperseded, fn ($query) => $query->current())
            ->orderByDesc('reported_on')
            ->orderByDesc('id')
            ->paginate(20)
            ->through(fn (MarketingReport $report): array => [
                'id' => $report->id,
                'reported_on' => $report->reported_on->toDateString(),
                'window_start' => $report->window_start?->toDateString(),
                'window_end' => $report->window_end?->toDateString(),
                'ga4_sessions' => $report->ga4_sessions,
                'ga4_total_users' => $report->ga4_total_users,
                'ga4_purchase_events' => $report->ga4_purchase_events,
                'ig_followers' => $report->ig_followers,
                'superseded_at' => $report->superseded_at?->toISOString(),
                'created_at' => $report->created_at?->toISOString(),
            ])
            ->withQueryString();

        return Inertia::render('admin/marketing-reports/Index', [
            'reports' => $reports,
            'filters' => [
                'superseded' => $includeSuperseded,
            ],
            'supersededCount' => MarketingReport::query()->whereNotNull('superseded_at')->count(),
        ]);
    }
}
