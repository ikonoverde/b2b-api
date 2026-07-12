<?php

namespace App\Services;

use App\Models\MarketingReport;
use App\Models\MarketingReportMetric;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Writes and reads marketing status reports.
 *
 * The rules enforced here are the ones a model cannot be trusted to keep on its own, because
 * breaking them produces output that looks right:
 *
 *  - A headline column is written only from an OBSERVED metric. Nothing else can reach those
 *    columns, so an estimate can never harden into a historical fact by being stored next to one.
 *  - A metric with no observed value is stored with its real provenance and a null number. It is
 *    never stored as zero.
 *  - A delta is computed only between two OBSERVED endpoints. Any other pair is a gap, and this
 *    service says so rather than subtracting.
 */
class MarketingReportService
{
    public const MAX_HISTORY = 50;

    /**
     * @return array<string, string|array<int, string>>
     */
    public function rules(): array
    {
        return [
            'reported_on' => ['required', 'date_format:Y-m-d'],
            'window_start' => ['nullable', 'date_format:Y-m-d'],
            'window_end' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:window_start'],
            'ga4_property_id' => ['nullable', 'string', 'max:255'],
            'body' => ['required', 'string'],

            'agents_run' => ['required', 'array', 'min:1'],
            'agents_run.*' => ['required', 'string', 'max:255'],

            'reachability' => ['required', 'array', 'min:1'],
            'reachability.*' => ['required', 'string', 'max:255'],

            'compared_against' => ['nullable', 'array'],
            'compared_against.*' => ['required', 'date_format:Y-m-d'],

            'metrics' => ['nullable', 'array'],
            'metrics.*.key' => ['required', 'string', 'max:255'],
            'metrics.*.provenance' => ['required', 'string', 'in:'.implode(',', MarketingReportMetric::PROVENANCES)],
            'metrics.*.numeric_value' => ['nullable', 'numeric'],
            'metrics.*.text_value' => ['nullable', 'string'],
            'metrics.*.note' => ['nullable', 'string', 'max:255'],

            'supersede' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Blank strings from an agent mean "not provided", and a model asked for an array will now and
     * then hand back a JSON string of one. Collapse both before validation.
     *
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function normalize(array $arguments): array
    {
        foreach (['window_start', 'window_end', 'ga4_property_id'] as $key) {
            if (array_key_exists($key, $arguments) && is_string($arguments[$key])) {
                $arguments[$key] = trim($arguments[$key]) === '' ? null : trim($arguments[$key]);
            }
        }

        foreach (['agents_run', 'reachability', 'compared_against', 'metrics'] as $key) {
            if (array_key_exists($key, $arguments) && is_string($arguments[$key])) {
                $decoded = json_decode($arguments[$key], associative: true);

                $arguments[$key] = is_array($decoded) ? $decoded : $arguments[$key];
            }
        }

        return $arguments;
    }

    /**
     * @param  array<string, mixed>  $validated
     *
     * @throws RuntimeException when a report already stands for that date and supersede was not asked for
     */
    public function save(array $validated): MarketingReport
    {
        /** @var array<int, array<string, mixed>> $metrics */
        $metrics = Arr::get($validated, 'metrics', []) ?? [];

        $this->guardAgainstDuplicateKeys($metrics);

        return DB::transaction(function () use ($validated, $metrics): MarketingReport {
            $existing = MarketingReport::query()
                ->current()
                ->whereDate('reported_on', $validated['reported_on'])
                ->first();

            if ($existing && ! Arr::get($validated, 'supersede', false)) {
                throw new RuntimeException(sprintf(
                    'A report for %s already stands (id %d). It was not overwritten. Read it first — the two runs may have observed different things, and that difference is the interesting part. Pass supersede=true only if you mean to replace it.',
                    $validated['reported_on'],
                    $existing->id,
                ));
            }

            $existing?->update(['superseded_at' => now()]);

            $report = MarketingReport::query()->create([
                ...Arr::only($validated, [
                    'reported_on',
                    'window_start',
                    'window_end',
                    'ga4_property_id',
                    'body',
                    'agents_run',
                    'reachability',
                ]),
                'compared_against' => Arr::get($validated, 'compared_against', []),
                ...$this->headlinesFrom($metrics),
            ]);

            foreach ($metrics as $metric) {
                $report->metrics()->create([
                    'key' => $metric['key'],
                    'provenance' => $metric['provenance'],
                    'numeric_value' => $this->observedNumber($metric),
                    'text_value' => Arr::get($metric, 'text_value'),
                    'note' => Arr::get($metric, 'note'),
                ]);
            }

            return $report->load('metrics');
        });
    }

    /**
     * Project the headline columns from the metrics.
     *
     * Only OBSERVED numeric metrics land here. Everything else leaves its column null, which is what
     * null means in this table: nobody saw it. The agent never writes these columns directly — if it
     * could, an ESTIMATED session count would be one field away from being filtered on as fact.
     *
     * @param  array<int, array<string, mixed>>  $metrics
     * @return array<string, int|null>
     */
    private function headlinesFrom(array $metrics): array
    {
        $headlines = array_fill_keys(array_values(MarketingReport::HEADLINE_METRICS), null);

        foreach ($metrics as $metric) {
            $column = MarketingReport::HEADLINE_METRICS[$metric['key']] ?? null;
            $value = $this->observedNumber($metric);

            if ($column === null || $value === null) {
                continue;
            }

            $headlines[$column] = (int) $value;
        }

        return $headlines;
    }

    /**
     * The numeric value of a metric, but only when it was actually observed.
     *
     * An ESTIMATED or UNKNOWN row keeps its note and its text, and stores no number. Nothing
     * downstream can then average it, subtract it, or chart it by accident.
     *
     * @param  array<string, mixed>  $metric
     */
    private function observedNumber(array $metric): ?float
    {
        if ($metric['provenance'] !== MarketingReportMetric::PROVENANCE_OBSERVED) {
            return null;
        }

        $value = Arr::get($metric, 'numeric_value');

        return $value === null ? null : (float) $value;
    }

    /**
     * @param  array<int, array<string, mixed>>  $metrics
     *
     * @throws RuntimeException
     */
    private function guardAgainstDuplicateKeys(array $metrics): void
    {
        $keys = array_column($metrics, 'key');
        $duplicates = array_keys(array_filter(array_count_values($keys), fn (int $count): bool => $count > 1));

        if ($duplicates !== []) {
            throw new RuntimeException(sprintf(
                'Each metric key may appear once per report. Duplicated: %s.',
                implode(', ', $duplicates),
            ));
        }
    }

    /**
     * The most recent reports, newest first. Superseded runs are excluded.
     *
     * @return array<string, mixed>
     */
    public function recent(int $limit = 4, bool $withBody = false): array
    {
        $reports = MarketingReport::query()
            ->current()
            ->orderByDesc('reported_on')
            ->orderByDesc('id')
            ->limit(max(1, min($limit, self::MAX_HISTORY)))
            ->get();

        return [
            'count' => $reports->count(),
            'reports' => $reports->map(fn (MarketingReport $report): array => $this->summarize($report, $withBody))->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function show(string $reportedOn): array
    {
        $report = MarketingReport::query()
            ->current()
            ->with('metrics')
            ->whereDate('reported_on', $reportedOn)
            ->first();

        if (! $report) {
            return [
                'found' => false,
                'reported_on' => $reportedOn,
                'message' => 'No report stands for that date. This is not a zero — it is an absence of measurement.',
            ];
        }

        return [
            'found' => true,
            ...$this->summarize($report, withBody: true),
            'metrics' => $report->metrics
                ->map(fn (MarketingReportMetric $metric): array => [
                    'key' => $metric->key,
                    'provenance' => $metric->provenance,
                    'numeric_value' => $metric->numeric_value === null ? null : (float) $metric->numeric_value,
                    'text_value' => $metric->text_value,
                    'note' => $metric->note,
                ])
                ->all(),
        ];
    }

    /**
     * One metric across every report that carries it, oldest first, with the change between each
     * consecutive pair.
     *
     * This is what the reports are for. A single report is a photograph; it cannot tell you whether
     * followers are climbing from zero or sitting at it.
     *
     * @return array<string, mixed>
     */
    public function history(string $key, int $limit = 8): array
    {
        $metrics = MarketingReportMetric::query()
            ->where('key', $key)
            ->whereHas('report', fn ($query) => $query->whereNull('superseded_at'))
            ->with('report:id,reported_on')
            ->join('marketing_reports', 'marketing_reports.id', '=', 'marketing_report_metrics.marketing_report_id')
            ->orderByDesc('marketing_reports.reported_on')
            ->limit(max(2, min($limit, self::MAX_HISTORY)))
            ->select('marketing_report_metrics.*')
            ->get()
            ->reverse()
            ->values();

        $points = [];
        $previous = null;

        foreach ($metrics as $metric) {
            $points[] = [
                'reported_on' => $metric->report->reported_on->toDateString(),
                'provenance' => $metric->provenance,
                'value' => $metric->numeric_value === null ? null : (float) $metric->numeric_value,
                'text_value' => $metric->text_value,
                'note' => $metric->note,
                'change_since_previous' => $this->change($previous, $metric),
            ];

            $previous = $metric;
        }

        return [
            'key' => $key,
            'count' => count($points),
            'points' => $points,
        ];
    }

    /**
     * A change carries the provenance of the weaker of its two endpoints.
     *
     * Two observations make a measured change. Anything else — an estimate, an unreachable account,
     * no prior reading at all — makes a gap, and a gap is reported as a gap. Subtracting an estimate
     * from an observation and presenting the difference as movement is the failure this exists to
     * prevent.
     *
     * @return array<string, mixed>|null
     */
    private function change(?MarketingReportMetric $previous, MarketingReportMetric $current): ?array
    {
        if ($previous === null) {
            return null;
        }

        $bothObserved = $previous->isObserved()
            && $current->isObserved()
            && $previous->numeric_value !== null
            && $current->numeric_value !== null;

        if (! $bothObserved) {
            return [
                'provenance' => MarketingReportMetric::PROVENANCE_UNKNOWN,
                'delta' => null,
                'from_provenance' => $previous->provenance,
                'to_provenance' => $current->provenance,
                'message' => 'No measured change: at least one endpoint was not observed.',
            ];
        }

        return [
            'provenance' => MarketingReportMetric::PROVENANCE_OBSERVED,
            'delta' => (float) $current->numeric_value - (float) $previous->numeric_value,
            'from' => (float) $previous->numeric_value,
            'to' => (float) $current->numeric_value,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function summarize(MarketingReport $report, bool $withBody): array
    {
        $summary = [
            'id' => $report->id,
            'reported_on' => $report->reported_on->toDateString(),
            'window' => [
                'start' => $report->window_start?->toDateString(),
                'end' => $report->window_end?->toDateString(),
            ],
            'ga4_property_id' => $report->ga4_property_id,
            'agents_run' => $report->agents_run,
            'reachability' => $report->reachability,
            'compared_against' => $report->compared_against,
            'headlines' => $this->headlines($report),
            'headlines_note' => 'A null headline was not observed — an unreachable account, or a value this report did not carry. It is not a zero.',
        ];

        return $withBody ? [...$summary, 'body' => $report->body] : $summary;
    }

    /**
     * @return array<string, int|null>
     */
    private function headlines(MarketingReport $report): array
    {
        $headlines = [];

        foreach (MarketingReport::HEADLINE_METRICS as $key => $column) {
            $headlines[$key] = $report->{$column};
        }

        return $headlines;
    }

    /**
     * The dates of reports already on file, so a caller can see what it is about to collide with.
     *
     * @return array<int, string>
     */
    public function existingDates(int $limit = 10): array
    {
        return MarketingReport::query()
            ->current()
            ->orderByDesc('reported_on')
            ->limit($limit)
            ->pluck('reported_on')
            ->map(fn (Carbon $date): string => $date->toDateString())
            ->all();
    }
}
