<?php

use App\Ai\Agents\GrowthStrategyAgent;
use App\Ai\Tools\GetMarketingMetricHistory;
use App\Ai\Tools\GetMarketingReports;
use App\Ai\Tools\SaveMarketingReport;
use App\Models\MarketingReport;
use App\Models\MarketingReportMetric;
use Laravel\Ai\Tools\Request;

/**
 * @param  array<string, mixed>  $arguments
 * @return array<string, mixed>
 */
function saveReport(array $arguments = []): array
{
    return json_decode((string) app(SaveMarketingReport::class)->handle(new Request([
        'reported_on' => '2026-07-11',
        'window_start' => '2026-06-11',
        'window_end' => '2026-07-11',
        'ga4_property_id' => '540477820',
        'body' => "# Ikonoverde marketing baseline\n\nOBSERVED   ga4.sessions = 30\n",
        'agents_run' => ['google-analytics', 'meta'],
        'reachability' => ['ga4' => 'ok', 'meta_graph' => 'ok'],
        'compared_against' => ['2026-07-09'],
        ...$arguments,
    ])), true, 512, JSON_THROW_ON_ERROR);
}

/**
 * @return array<string, mixed>
 */
function observedMetric(string $key, float $value): array
{
    return ['key' => $key, 'provenance' => 'observed', 'numeric_value' => $value];
}

it('saves a report with its full text and every tagged value', function () {
    $payload = saveReport([
        'metrics' => [
            observedMetric('ga4.sessions', 30),
            observedMetric('ig.followers', 0),
            ['key' => 'ga4.internal_filter_state', 'provenance' => 'unknown', 'text_value' => 'human must check ACTIVE vs Testing'],
        ],
    ]);

    expect($payload['saved'])->toBeTrue()
        ->and($payload['metrics_recorded'])->toBe(3);

    $report = MarketingReport::query()->sole();

    expect($report->reported_on->toDateString())->toBe('2026-07-11')
        ->and($report->window_start->toDateString())->toBe('2026-06-11')
        ->and($report->body)->toContain('OBSERVED   ga4.sessions = 30')
        ->and($report->agents_run)->toBe(['google-analytics', 'meta'])
        ->and($report->reachability)->toBe(['ga4' => 'ok', 'meta_graph' => 'ok'])
        ->and($report->compared_against)->toBe(['2026-07-09'])
        ->and($report->ga4_sessions)->toBe(30)
        // A real zero: somebody looked, and there was nobody there.
        ->and($report->ig_followers)->toBe(0);
});

it('projects headline columns from observed metrics only', function () {
    // The report says 30 sessions but only estimates that nearly all of them are internal. If the
    // estimate could reach a headline column, it would be filterable as though it were measured.
    saveReport([
        'metrics' => [
            observedMetric('ga4.sessions', 30),
            ['key' => 'ga4.total_users', 'provenance' => 'estimated', 'numeric_value' => 17],
        ],
    ]);

    $report = MarketingReport::query()->sole();

    expect($report->ga4_sessions)->toBe(30)
        ->and($report->ga4_total_users)->toBeNull();

    // The estimate is still on file — it is just not a number anything can chart.
    $estimate = $report->metrics()->where('key', 'ga4.total_users')->sole();

    expect($estimate->provenance)->toBe(MarketingReportMetric::PROVENANCE_ESTIMATED)
        ->and($estimate->numeric_value)->toBeNull();
});

it('records an unreachable account as unknown rather than as zero', function () {
    // The failure this table exists to prevent: a dead Graph API stored as an account with no
    // followers, which every delta computed afterwards would then inherit.
    saveReport([
        'reachability' => ['ga4' => 'ok', 'meta_graph' => 'unreachable'],
        'metrics' => [
            observedMetric('ga4.sessions', 30),
            ['key' => 'ig.followers', 'provenance' => 'unknown', 'text_value' => 'unreachable'],
        ],
    ]);

    $report = MarketingReport::query()->sole();

    expect($report->ig_followers)->toBeNull()
        ->and($report->fb_fans)->toBeNull();

    $follower = $report->metrics()->where('key', 'ig.followers')->sole();

    expect($follower->numeric_value)->toBeNull()
        ->and($follower->text_value)->toBe('unreachable');
});

it('refuses to overwrite a report that already stands for the date', function () {
    saveReport(['metrics' => [observedMetric('ga4.sessions', 30)]]);

    $payload = saveReport(['metrics' => [observedMetric('ga4.sessions', 99)]]);

    expect($payload)->toHaveKey('error')
        ->and($payload['error'])->toContain('already stands')
        ->and($payload['reports_on_file'])->toBe(['2026-07-11'])
        ->and(MarketingReport::query()->count())->toBe(1)
        ->and(MarketingReport::query()->sole()->ga4_sessions)->toBe(30);
});

it('supersedes the earlier run rather than destroying it when asked', function () {
    saveReport(['metrics' => [observedMetric('ga4.sessions', 30)]]);

    $payload = saveReport([
        'supersede' => true,
        'metrics' => [observedMetric('ga4.sessions', 32)],
    ]);

    expect($payload['saved'])->toBeTrue()
        ->and(MarketingReport::query()->count())->toBe(2);

    $current = MarketingReport::query()->current()->sole();

    expect($current->ga4_sessions)->toBe(32)
        ->and($current->id)->toBe($payload['report_id']);

    // The first run is kept: the two may have observed different things.
    expect(MarketingReport::query()->whereNotNull('superseded_at')->sole()->ga4_sessions)->toBe(30);
});

it('rejects a metric key repeated within one report', function () {
    $payload = saveReport([
        'metrics' => [
            observedMetric('ga4.sessions', 30),
            observedMetric('ga4.sessions', 31),
        ],
    ]);

    expect($payload['error'])->toContain('ga4.sessions')
        ->and(MarketingReport::query()->count())->toBe(0);
});

it('rejects an unrecognised provenance tag', function () {
    $payload = saveReport([
        'metrics' => [['key' => 'ga4.sessions', 'provenance' => 'probably', 'numeric_value' => 30]],
    ]);

    expect($payload)->toHaveKey('error')
        ->and(MarketingReport::query()->count())->toBe(0);
});

it('lists the most recent reports and excludes superseded runs', function () {
    MarketingReport::factory()->create(['reported_on' => '2026-07-09', 'ga4_sessions' => 33]);
    MarketingReport::factory()->superseded()->create(['reported_on' => '2026-07-11', 'ga4_sessions' => 1]);
    MarketingReport::factory()->create(['reported_on' => '2026-07-11', 'ga4_sessions' => 30]);

    $payload = json_decode((string) app(GetMarketingReports::class)->handle(new Request([])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload['count'])->toBe(2)
        ->and($payload['reports'][0]['reported_on'])->toBe('2026-07-11')
        ->and($payload['reports'][0]['headlines']['ga4.sessions'])->toBe(30)
        ->and($payload['reports'][1]['reported_on'])->toBe('2026-07-09')
        ->and($payload['reports'][0])->not->toHaveKey('body');
});

it('returns one report in full, with its metrics, by date', function () {
    saveReport([
        'metrics' => [
            observedMetric('ga4.sessions', 30),
            ['key' => 'ga4.internal_filter_state', 'provenance' => 'unknown', 'text_value' => 'human must check'],
        ],
    ]);

    $payload = json_decode((string) app(GetMarketingReports::class)->handle(new Request([
        'reported_on' => '2026-07-11',
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload['found'])->toBeTrue()
        ->and($payload['body'])->toContain('ga4.sessions = 30')
        ->and($payload['metrics'])->toHaveCount(2)
        ->and(collect($payload['metrics'])->firstWhere('key', 'ga4.internal_filter_state'))
        ->toMatchArray(['provenance' => 'unknown', 'numeric_value' => null, 'text_value' => 'human must check']);
});

it('says a missing report is an absence of measurement, not a zero', function () {
    $payload = json_decode((string) app(GetMarketingReports::class)->handle(new Request([
        'reported_on' => '2026-01-01',
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload['found'])->toBeFalse()
        ->and($payload['message'])->toContain('not a zero');
});

it('reports a measured change between two observed readings', function () {
    $older = MarketingReport::factory()->create(['reported_on' => '2026-07-09']);
    $newer = MarketingReport::factory()->create(['reported_on' => '2026-07-11']);

    MarketingReportMetric::factory()->for($older, 'report')->create(['key' => 'ig.followers', 'numeric_value' => 0]);
    MarketingReportMetric::factory()->for($newer, 'report')->create(['key' => 'ig.followers', 'numeric_value' => 3]);

    $payload = json_decode((string) app(GetMarketingMetricHistory::class)->handle(new Request([
        'key' => 'ig.followers',
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload['count'])->toBe(2)
        // Oldest first, so the series reads forward in time.
        ->and($payload['points'][0]['reported_on'])->toBe('2026-07-09')
        ->and($payload['points'][0]['change_since_previous'])->toBeNull()
        ->and($payload['points'][1]['change_since_previous'])->toMatchArray([
            'provenance' => 'observed',
            'delta' => 3.0,
            'from' => 0.0,
            'to' => 3.0,
        ]);
});

it('returns a gap, not a delta, when an endpoint was never observed', function () {
    // Last week the account was unreachable. There is no measured change here — there is a hole,
    // and subtracting across it would invent movement that nobody saw.
    $older = MarketingReport::factory()->create(['reported_on' => '2026-07-09']);
    $newer = MarketingReport::factory()->create(['reported_on' => '2026-07-11']);

    MarketingReportMetric::factory()->for($older, 'report')->unknown()->create(['key' => 'ig.followers']);
    MarketingReportMetric::factory()->for($newer, 'report')->create(['key' => 'ig.followers', 'numeric_value' => 3]);

    $payload = json_decode((string) app(GetMarketingMetricHistory::class)->handle(new Request([
        'key' => 'ig.followers',
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload['points'][1]['change_since_previous'])->toMatchArray([
        'provenance' => 'unknown',
        'delta' => null,
        'from_provenance' => 'unknown',
        'to_provenance' => 'observed',
    ])->and($payload['points'][1]['change_since_previous']['message'])->toContain('not observed');
});

it('does not chain a delta through a superseded report', function () {
    $superseded = MarketingReport::factory()->superseded()->create(['reported_on' => '2026-07-10']);
    $current = MarketingReport::factory()->create(['reported_on' => '2026-07-11']);

    MarketingReportMetric::factory()->for($superseded, 'report')->create(['key' => 'ig.followers', 'numeric_value' => 99]);
    MarketingReportMetric::factory()->for($current, 'report')->create(['key' => 'ig.followers', 'numeric_value' => 3]);

    $payload = json_decode((string) app(GetMarketingMetricHistory::class)->handle(new Request([
        'key' => 'ig.followers',
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload['count'])->toBe(1)
        ->and($payload['points'][0]['value'])->toEqual(3)
        ->and($payload['points'][0]['change_since_previous'])->toBeNull();
});

it('says an unrecorded metric key has no measurement rather than returning zero', function () {
    $payload = json_decode((string) app(GetMarketingMetricHistory::class)->handle(new Request([
        'key' => 'ga4.sessions',
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload['count'])->toBe(0)
        ->and($payload['message'])->toContain('not a zero')
        ->and($payload['headline_keys'])->toContain('ga4.sessions');
});

it('gives the growth strategy agent the report tools', function () {
    $tools = collect(new GrowthStrategyAgent([])->tools())
        ->map(fn (object $tool): string => $tool::class);

    expect($tools)
        ->toContain(GetMarketingReports::class)
        ->toContain(GetMarketingMetricHistory::class)
        ->toContain(SaveMarketingReport::class);
});

it('tells the agent never to store an unobserved value as zero', function () {
    expect((string) new GrowthStrategyAgent([])->instructions())
        ->toContain('Never save an unobserved value as 0')
        ->toContain('both endpoints were observed');
});
