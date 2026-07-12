<?php

use App\Services\Ads\MetaDatasetService;
use Illuminate\Support\Facades\Http;

/**
 * The fixtures below are trimmed captures of real Graph API v21.0 responses for dataset
 * 2222947471863923, taken on 2026-07-11. Field and aggregation names are not invented.
 */
function datasetService(): MetaDatasetService
{
    return new MetaDatasetService(
        accessToken: 'token-123',
        datasetId: 'dataset-123',
        apiVersion: 'v21.0',
        baseUrl: 'https://graph.facebook.test',
    );
}

it('reads dataset details', function () {
    Http::fake([
        'graph.facebook.test/v21.0/dataset-123?*' => Http::response([
            'id' => '2222947471863923',
            'name' => 'IkonoverdePro Web',
            'creation_time' => '2026-06-11T21:38:13-0600',
            'first_party_cookie_status' => 'first_party_cookie_enabled',
            'last_fired_time' => '2026-07-11T17:54:37-0600',
            'owner_business' => ['id' => '1204202142768360', 'name' => 'IkonoverdePro'],
        ]),
    ]);

    $result = datasetService()->details();

    expect($result['name'])->toBe('IkonoverdePro Web')
        ->and($result['last_fired_time'])->toBe('2026-07-11T17:54:37-0600')
        ->and($result['owner_business']['id'])->toBe('1204202142768360');

    Http::assertSent(fn ($request): bool => $request->method() === 'GET'
        && str_starts_with($request->url(), 'https://graph.facebook.test/v21.0/dataset-123')
        && $request['access_token'] === 'token-123'
        && str_contains($request['fields'], 'last_fired_time')
        // These two look plausible and do not exist on the node; requesting either 400s the call.
        && ! str_contains($request['fields'], 'is_active')
        && ! str_contains($request['fields'], 'server_last_fired_time'));
});

it('reads total event counts', function () {
    Http::fake([
        'graph.facebook.test/v21.0/dataset-123/stats*' => Http::response([
            'data' => [[
                'start_time' => '2026-06-13T23:22:46-0600',
                'aggregation' => 'event_total_counts',
                'data' => [
                    ['value' => 'PageView', 'count' => 67],
                    ['value' => 'Purchase', 'count' => 3],
                    ['value' => 'AddToCart', 'count' => 3],
                ],
            ]],
        ]),
    ]);

    $result = datasetService()->eventCounts();

    expect($result['data'][0]['data'][1])->toBe(['value' => 'Purchase', 'count' => 3]);

    Http::assertSent(fn ($request): bool => $request['aggregation'] === 'event_total_counts');
});

it('splits browser from server delivery, which no field on the node reports', function () {
    Http::fake([
        'graph.facebook.test/v21.0/dataset-123/stats*' => Http::response([
            'data' => [[
                'start_time' => '2026-06-17T14:00:00-0600',
                'aggregation' => 'event_source',
                'data' => [['value' => 'BROWSER', 'count' => 4]],
            ]],
        ]),
    ]);

    expect(datasetService()->eventSources()['data'][0]['data'][0]['value'])->toBe('BROWSER');

    Http::assertSent(fn ($request): bool => $request['aggregation'] === 'event_source');
});

it('reads which match keys arrived', function () {
    Http::fake([
        'graph.facebook.test/v21.0/dataset-123/stats*' => Http::response([
            'data' => [[
                'start_time' => '2026-06-17T14:00:00-0600',
                'aggregation' => 'match_keys',
                'data' => [['event' => 'PageView', 'value' => 'fr_cookie', 'count' => 4]],
            ]],
        ]),
    ]);

    expect(datasetService()->matchKeys()['data'][0]['data'][0]['value'])->toBe('fr_cookie');

    Http::assertSent(fn ($request): bool => $request['aggregation'] === 'match_keys');
});

it('rejects an unknown aggregation instead of sending a request that returns an empty result', function () {
    Http::fake();

    $result = datasetService()->stats('event_match_quality');

    expect($result['error'])->toBeTrue()
        ->and($result['message'])->toContain('Unknown aggregation [event_match_quality]');

    Http::assertNothingSent();
});

it('clamps a window beyond the 28-day lookback and says that it did', function () {
    Http::fake(['graph.facebook.test/*' => Http::response(['data' => []])]);

    $result = datasetService()->eventCounts(since: now()->subDays(90)->toIso8601String());

    expect($result['window']['truncated_to_max_lookback'])->toBeTrue();

    Http::assertSent(function ($request): bool {
        $earliest = now()->subDays(MetaDatasetService::MAX_LOOKBACK_DAYS)->getTimestamp();

        return abs((int) $request['start_time'] - $earliest) <= 5;
    });
});

it('does not claim truncation for a window inside the lookback', function () {
    Http::fake(['graph.facebook.test/*' => Http::response(['data' => []])]);

    $result = datasetService()->eventCounts(since: now()->subDays(7)->toIso8601String());

    expect($result['window']['truncated_to_max_lookback'])->toBeFalse();
});

it('returns an error payload rather than throwing when meta rejects the token', function () {
    Http::fake([
        'graph.facebook.test/*' => Http::response([
            'error' => ['message' => '(#100) Missing Permission', 'code' => 100],
        ], 400),
    ]);

    $result = datasetService()->details();

    expect($result['error'])->toBeTrue()
        ->and($result['status'])->toBe(400)
        ->and($result['response']['error']['message'])->toBe('(#100) Missing Permission');
});
