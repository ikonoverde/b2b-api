<?php

use App\Services\Ads\MetaGraphService;
use Illuminate\Support\Facades\Http;

it('gets facebook page info from the configured graph api', function () {
    Http::fake([
        'graph.facebook.test/v21.0/page-123*' => Http::response([
            'id' => 'page-123',
            'name' => 'Ikonoverde',
            'fan_count' => 1500,
        ]),
    ]);

    $result = new MetaGraphService(
        accessToken: 'token-123',
        apiVersion: 'v21.0',
        baseUrl: 'https://graph.facebook.test',
    )->pageInfo('page-123');

    expect($result['name'])->toBe('Ikonoverde')
        ->and($result['fan_count'])->toBe(1500);

    Http::assertSent(function ($request): bool {
        return $request->method() === 'GET'
            && str_starts_with($request->url(), 'https://graph.facebook.test/v21.0/page-123')
            && $request['access_token'] === 'token-123'
            && str_contains($request['fields'], 'fan_count');
    });
});

it('gets instagram media insights with requested metrics', function () {
    Http::fake([
        'graph.facebook.test/v21.0/media-123/insights*' => Http::response([
            'data' => [
                ['name' => 'reach', 'values' => [['value' => 100]]],
            ],
        ]),
    ]);

    $result = new MetaGraphService(
        accessToken: 'token-123',
        apiVersion: 'v21.0',
        baseUrl: 'https://graph.facebook.test',
    )->instagramPostInsights('media-123', ['reach', 'saved']);

    expect($result['data'][0]['name'])->toBe('reach');

    Http::assertSent(fn ($request): bool => $request['metric'] === 'reach,saved');
});

it('returns normalized meta errors', function () {
    Http::fake([
        'graph.facebook.test/v21.0/page-123*' => Http::response([
            'error' => ['message' => 'Invalid token'],
        ], 401),
    ]);

    $result = new MetaGraphService(
        accessToken: 'bad-token',
        apiVersion: 'v21.0',
        baseUrl: 'https://graph.facebook.test',
    )->pageInfo('page-123');

    expect($result['error'])->toBeTrue()
        ->and($result['status'])->toBe(401)
        ->and($result['response']['error']['message'])->toBe('Invalid token');
});
