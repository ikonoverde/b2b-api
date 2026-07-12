<?php

namespace App\Ai\Tools;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Models\MarketingReport;
use App\Models\MarketingReportMetric;
use App\Services\MarketingReportService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Facades\Validator;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use RuntimeException;
use Stringable;

class SaveMarketingReport implements Tool
{
    use FormatsToolResponses;

    public function __construct(private MarketingReportService $reports) {}

    public function name(): string
    {
        return 'marketing_save_report';
    }

    public function description(): Stringable|string
    {
        return 'Record a marketing status report: the full report text, and every value it observed, each tagged with where that value came from. Store only values a tool returned on this run. Never carry a number forward from an older report and store it as current — later runs read this row as a measurement, and a laundered value propagates into every delta computed after it.';
    }

    public function handle(Request $request): Stringable|string
    {
        $validator = Validator::make(
            $this->reports->normalize($request->all()),
            $this->reports->rules(),
        );

        if ($validator->fails()) {
            return $this->json(['error' => $validator->errors()->first()]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        try {
            $report = $this->reports->save($validated);
        } catch (RuntimeException $exception) {
            return $this->json([
                'error' => $exception->getMessage(),
                'reports_on_file' => $this->reports->existingDates(),
            ]);
        }

        return $this->json([
            'saved' => true,
            'report_id' => $report->id,
            'reported_on' => $report->reported_on->toDateString(),
            'metrics_recorded' => $report->metrics->count(),
            'headlines' => [
                'ga4_sessions' => $report->ga4_sessions,
                'ga4_total_users' => $report->ga4_total_users,
                'ga4_page_views' => $report->ga4_page_views,
                'ga4_purchase_events' => $report->ga4_purchase_events,
                'meta_purchase_events' => $report->meta_purchase_events,
                'fb_fans' => $report->fb_fans,
                'ig_followers' => $report->ig_followers,
            ],
            'headlines_note' => 'Filled from OBSERVED metrics only. A null headline means that value was not observed on this run — it is not a zero.',
        ]);
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'reported_on' => $schema->string()
                ->required()
                ->description('The date this report was written, YYYY-MM-DD.'),
            'window_start' => $schema->string()
                ->nullable()
                ->description('First day of the period the numbers describe, YYYY-MM-DD. This is not the same as reported_on, and the two diverge the moment anyone asks for last month\'s figures.'),
            'window_end' => $schema->string()
                ->nullable()
                ->description('Last day of the period the numbers describe, YYYY-MM-DD.'),
            'ga4_property_id' => $schema->string()
                ->nullable()
                ->description('The GA4 property the traffic numbers came from.'),
            'body' => $schema->string()
                ->required()
                ->description('The full report, in markdown, exactly as written. Keep the provenance tags in it: stripping them for readability is how an estimate becomes a historical fact.'),
            'agents_run' => $schema->array()
                ->required()
                ->description('The agents that produced this report, e.g. ["google-analytics", "meta"].'),
            'reachability' => $schema->object()
                ->required()
                ->description('What answered and what did not, one entry per source, e.g. {"ga4":"ok","meta_graph":"unreachable"}. A source that never answered must be recorded here — a file of zeros with no note that the API was down will be read as a measurement.'),
            'compared_against' => $schema->array()
                ->nullable()
                ->description('The dates (YYYY-MM-DD) of the prior reports this run compared against. A delta with no stated baseline cannot be chained by the next run.'),
            'metrics' => $schema->array()
                ->nullable()
                ->description(
                    'Every value this report carries, one object each: {"key":"ga4.sessions","provenance":"observed","numeric_value":30,"note":"optional"}.'
                    .' provenance is one of: '.implode(', ', MarketingReportMetric::PROVENANCES).'.'
                    .' observed = a tool returned it on this run. estimated = a judgement or model prior. unknown = nobody could see it (unreachable account, tool never loaded, value no API can read).'
                    .' Use text_value instead of numeric_value for non-numbers ("unreachable", a measurement ID, a bio).'
                    .' Do NOT record an unobserved value as 0. A zero means somebody looked and found nothing; a null means nobody looked, and the two mean opposite things downstream. Only observed numeric values are stored as numbers and only they can be filtered or charted.'
                    .' These keys are also projected onto filterable columns: '.implode(', ', array_keys(MarketingReport::HEADLINE_METRICS)).'.'
                ),
            'supersede' => $schema->boolean()
                ->nullable()
                ->description('Replace a report that already stands for this date. Defaults to false, which fails rather than overwriting. A second run of the same day supersedes the first only when a human says so — the two runs may have observed different things.'),
        ];
    }
}
