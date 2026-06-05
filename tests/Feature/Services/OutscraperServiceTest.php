<?php

use App\Services\OutscraperService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

function outscraperService(): OutscraperService
{
    return new OutscraperService(
        apiKey: 'test-api-key',
        baseUrl: 'https://api.outscraper.cloud',
    );
}

test('startSearch submits async request and returns the request id', function () {
    Http::fake([
        'api.outscraper.cloud/google-maps-search' => Http::response(['id' => 'req-123', 'status' => 'Pending'], 202),
    ]);

    $requestId = outscraperService()->startSearch(['spa, Merida, Mexico']);

    expect($requestId)->toBe('req-123');

    Http::assertSent(function ($request) {
        return $request->method() === 'POST'
            && $request->url() === 'https://api.outscraper.cloud/google-maps-search'
            && $request->hasHeader('X-API-KEY', 'test-api-key')
            && $request->data() === [
                'query' => ['spa, Merida, Mexico'],
                'language' => 'es',
                'region' => 'MX',
                'limit' => 100,
                'dropDuplicates' => true,
                'enrichment' => ['contacts_n_leads'],
                'async' => true,
            ];
    });
});

test('startSearch returns null when the api fails', function () {
    Http::fake([
        'api.outscraper.cloud/google-maps-search' => Http::response(['error' => true, 'errorMessage' => 'boom'], 422),
    ]);

    expect(outscraperService()->startSearch(['spa, Merida, Mexico']))->toBeNull();
});

test('startSearch returns null when the request throws', function () {
    Http::fake([
        'api.outscraper.cloud/google-maps-search' => fn () => throw new ConnectionException('network'),
    ]);

    expect(outscraperService()->startSearch(['spa, Merida, Mexico']))->toBeNull();
});

test('getRequestStatus returns pending when archive is still processing', function () {
    Http::fake([
        'api.outscraper.cloud/requests/req-123' => Http::response(['status' => 'Pending']),
    ]);

    expect(outscraperService()->getRequestStatus('req-123'))->toBe([
        'status' => 'Pending',
        'items' => null,
    ]);

    Http::assertSent(function ($request) {
        return $request->method() === 'GET'
            && $request->url() === 'https://api.outscraper.cloud/requests/req-123'
            && $request->hasHeader('X-API-KEY', 'test-api-key');
    });
});

test('getRequestStatus flattens multi-query result data on success', function () {
    Http::fake([
        'api.outscraper.cloud/requests/req-123' => Http::response([
            'status' => 'Success',
            'data' => [
                [['place_id' => 'a'], ['place_id' => 'b']],
                [['place_id' => 'c']],
            ],
        ]),
    ]);

    $result = outscraperService()->getRequestStatus('req-123');

    expect($result['status'])->toBe('Success');
    expect($result['items'])->toHaveCount(3);
    expect($result['items'][0]['place_id'])->toBe('a');
    expect($result['items'][2]['place_id'])->toBe('c');
});

test('getRequestStatus passes through already-flat data on success', function () {
    Http::fake([
        'api.outscraper.cloud/requests/req-123' => Http::response([
            'status' => 'Success',
            'data' => [
                ['place_id' => 'a'],
                ['place_id' => 'b'],
            ],
        ]),
    ]);

    $result = outscraperService()->getRequestStatus('req-123');

    expect($result['items'])->toHaveCount(2);
});

test('getRequestStatus returns null when the api fails', function () {
    Http::fake([
        'api.outscraper.cloud/requests/req-123' => Http::response(['error' => true, 'errorMessage' => 'failure'], 500),
    ]);

    expect(outscraperService()->getRequestStatus('req-123'))->toBeNull();
});

test('getRequestStatus returns null when the request throws', function () {
    Http::fake([
        'api.outscraper.cloud/requests/req-123' => fn () => throw new ConnectionException('network'),
    ]);

    expect(outscraperService()->getRequestStatus('req-123'))->toBeNull();
});
