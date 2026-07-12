<?php

use App\Models\MarketingReport;
use App\Models\MarketingReportMetric;
use App\Models\User;
use Illuminate\Testing\TestResponse;

/**
 * Metric keys carry dots (`ga4.sessions`), which the fluent Inertia assertions read as nesting.
 * Reach for the prop itself rather than reshaping the payload to suit the test.
 *
 * @return array<string, int|null>
 */
function previousHeadlines(TestResponse $response): array
{
    return $response->viewData('page')['props']['previous']['headlines'];
}

test('admin can view the marketing reports list', function () {
    $admin = User::factory()->admin()->create();

    MarketingReport::factory()->create([
        'reported_on' => '2026-07-12',
        'ga4_sessions' => 30,
    ]);

    $response = $this->actingAs($admin)->get('/admin/marketing-reports');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/marketing-reports/Index')
        ->where('reports.total', 1)
        ->where('reports.data.0.reported_on', '2026-07-12')
        ->where('reports.data.0.ga4_sessions', 30)
        ->where('filters.superseded', false)
    );
});

test('the list orders reports newest first', function () {
    $admin = User::factory()->admin()->create();

    MarketingReport::factory()->create(['reported_on' => '2026-07-10']);
    MarketingReport::factory()->create(['reported_on' => '2026-07-12']);
    MarketingReport::factory()->create(['reported_on' => '2026-07-11']);

    $response = $this->actingAs($admin)->get('/admin/marketing-reports');

    $response->assertInertia(fn ($page) => $page
        ->where('reports.data.0.reported_on', '2026-07-12')
        ->where('reports.data.1.reported_on', '2026-07-11')
        ->where('reports.data.2.reported_on', '2026-07-10')
    );
});

test('superseded reports are hidden until they are asked for', function () {
    $admin = User::factory()->admin()->create();

    MarketingReport::factory()->superseded()->create(['reported_on' => '2026-07-12']);
    MarketingReport::factory()->create(['reported_on' => '2026-07-12']);

    $this->actingAs($admin)
        ->get('/admin/marketing-reports')
        ->assertInertia(fn ($page) => $page
            ->where('reports.total', 1)
            ->where('reports.data.0.superseded_at', null)
            ->where('supersededCount', 1)
        );

    $this->actingAs($admin)
        ->get('/admin/marketing-reports?superseded=1')
        ->assertInertia(fn ($page) => $page
            ->where('reports.total', 2)
            ->where('filters.superseded', true)
        );
});

/**
 * The reason the headline columns are nullable. If the payload ever hands the page a 0 where the
 * account was unreachable, every downstream reading of that row is a lie, and the page has no way
 * left to tell the reader that nobody looked.
 */
test('an unobserved headline reaches the page as null, never as zero', function () {
    $admin = User::factory()->admin()->create();

    MarketingReport::factory()->metaUnreachable()->create([
        'reported_on' => '2026-07-12',
        'ga4_purchase_events' => 0,
    ]);

    $response = $this->actingAs($admin)->get('/admin/marketing-reports');

    $response->assertInertia(fn ($page) => $page
        ->where('reports.data.0.ig_followers', null)
        ->where('reports.data.0.ga4_purchase_events', 0)
    );
});

test('admin can view a report with its tagged metrics', function () {
    $admin = User::factory()->admin()->create();

    $report = MarketingReport::factory()->create(['reported_on' => '2026-07-12']);

    MarketingReportMetric::factory()->for($report, 'report')->create([
        'key' => 'ga4.sessions',
        'provenance' => MarketingReportMetric::PROVENANCE_OBSERVED,
        'numeric_value' => 30,
    ]);

    MarketingReportMetric::factory()->for($report, 'report')->create([
        'key' => 'ig.followers',
        'provenance' => MarketingReportMetric::PROVENANCE_UNKNOWN,
        'numeric_value' => null,
        'note' => 'Graph API inalcanzable',
    ]);

    $response = $this->actingAs($admin)->get("/admin/marketing-reports/{$report->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/marketing-reports/Show')
        ->where('report.id', $report->id)
        ->where('report.reported_on', '2026-07-12')
        ->has('report.metrics', 2)
        ->where('report.metrics.0.key', 'ga4.sessions')
        ->where('report.metrics.0.provenance', 'observed')
        ->where('report.metrics.1.key', 'ig.followers')
        ->where('report.metrics.1.provenance', 'unknown')
        ->where('report.metrics.1.numeric_value', null)
        ->where('report.metrics.1.note', 'Graph API inalcanzable')
        ->has('report.reachability')
        ->has('report.agents_run')
    );
});

test('the previous reading is the newest standing report before this one', function () {
    $admin = User::factory()->admin()->create();

    MarketingReport::factory()->create(['reported_on' => '2026-07-10', 'ga4_sessions' => 10]);
    MarketingReport::factory()->create(['reported_on' => '2026-07-11', 'ga4_sessions' => 20]);
    $report = MarketingReport::factory()->create(['reported_on' => '2026-07-12']);

    $response = $this->actingAs($admin)->get("/admin/marketing-reports/{$report->id}");

    $response->assertInertia(fn ($page) => $page->where('previous.reported_on', '2026-07-11'));

    expect(previousHeadlines($response)['ga4.sessions'])->toBe(20);
});

/**
 * A superseded report is kept for the record but must never be an endpoint of a delta. If it could
 * be the previous reading, a run that was later replaced would silently become the baseline the
 * next day's movement is measured from.
 */
test('a superseded report is never the previous reading', function () {
    $admin = User::factory()->admin()->create();

    MarketingReport::factory()->create(['reported_on' => '2026-07-10', 'ga4_sessions' => 10]);
    MarketingReport::factory()->superseded()->create(['reported_on' => '2026-07-11', 'ga4_sessions' => 999]);
    $report = MarketingReport::factory()->create(['reported_on' => '2026-07-12']);

    $response = $this->actingAs($admin)->get("/admin/marketing-reports/{$report->id}");

    $response->assertInertia(fn ($page) => $page->where('previous.reported_on', '2026-07-10'));

    expect(previousHeadlines($response)['ga4.sessions'])->toBe(10);
});

test('the first report has no previous reading', function () {
    $admin = User::factory()->admin()->create();

    $report = MarketingReport::factory()->create(['reported_on' => '2026-07-12']);

    $this->actingAs($admin)
        ->get("/admin/marketing-reports/{$report->id}")
        ->assertInertia(fn ($page) => $page->where('previous', null));
});

test('an unobserved previous headline stays null so no delta can be computed from it', function () {
    $admin = User::factory()->admin()->create();

    MarketingReport::factory()->metaUnreachable()->create(['reported_on' => '2026-07-11']);
    $report = MarketingReport::factory()->create(['reported_on' => '2026-07-12', 'ig_followers' => 4]);

    $response = $this->actingAs($admin)->get("/admin/marketing-reports/{$report->id}");

    expect(previousHeadlines($response)['ig.followers'])->toBeNull();
});

test('non-admin cannot access marketing reports', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/admin/marketing-reports')->assertForbidden();

    $report = MarketingReport::factory()->create();

    $this->actingAs($user)->get("/admin/marketing-reports/{$report->id}")->assertForbidden();
});
