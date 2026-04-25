<?php

use App\Services\OutscraperService;

use function Pest\Laravel\mock;

test('startSearch submits async request and returns the request id', function () {
    $captured = null;

    $client = mock(\OutscraperClient::class);
    $client->shouldReceive('google_maps_search')
        ->once()
        ->andReturnUsing(function (...$args) use (&$captured) {
            $captured = $args;

            return ['id' => 'req-123', 'status' => 'Pending'];
        });

    $service = new OutscraperService($client);

    $requestId = $service->startSearch(['spa, Merida, Mexico']);

    expect($requestId)->toBe('req-123');
    expect($captured[0])->toBe(['spa, Merida, Mexico']);
    expect($captured[1])->toBe('es');
    expect($captured[2])->toBe('MX');
    expect($captured[3])->toBe(100);
});

test('startSearch returns null when the client throws', function () {
    $client = mock(\OutscraperClient::class);
    $client->shouldReceive('google_maps_search')
        ->once()
        ->andThrow(new Exception('boom'));

    $service = new OutscraperService($client);

    expect($service->startSearch(['spa, Merida, Mexico']))->toBeNull();
});

test('getRequestStatus returns pending when archive is still processing', function () {
    $client = mock(\OutscraperClient::class);
    $client->shouldReceive('get_request_archive')
        ->once()
        ->with('req-123')
        ->andReturn(['status' => 'Pending']);

    $service = new OutscraperService($client);

    expect($service->getRequestStatus('req-123'))->toBe([
        'status' => 'Pending',
        'items' => null,
    ]);
});

test('getRequestStatus flattens multi-query result data on success', function () {
    $client = mock(\OutscraperClient::class);
    $client->shouldReceive('get_request_archive')
        ->once()
        ->with('req-123')
        ->andReturn([
            'status' => 'Success',
            'data' => [
                [['place_id' => 'a'], ['place_id' => 'b']],
                [['place_id' => 'c']],
            ],
        ]);

    $service = new OutscraperService($client);

    $result = $service->getRequestStatus('req-123');

    expect($result['status'])->toBe('Success');
    expect($result['items'])->toHaveCount(3);
    expect($result['items'][0]['place_id'])->toBe('a');
    expect($result['items'][2]['place_id'])->toBe('c');
});

test('getRequestStatus passes through already-flat data on success', function () {
    $client = mock(\OutscraperClient::class);
    $client->shouldReceive('get_request_archive')
        ->once()
        ->andReturn([
            'status' => 'Success',
            'data' => [
                ['place_id' => 'a'],
                ['place_id' => 'b'],
            ],
        ]);

    $service = new OutscraperService($client);

    $result = $service->getRequestStatus('req-123');

    expect($result['items'])->toHaveCount(2);
});

test('getRequestStatus returns null when the client throws', function () {
    $client = mock(\OutscraperClient::class);
    $client->shouldReceive('get_request_archive')
        ->once()
        ->andThrow(new Exception('network'));

    $service = new OutscraperService($client);

    expect($service->getRequestStatus('req-123'))->toBeNull();
});
