<?php

use App\Services\ProductionApiService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->service = new ProductionApiService(
        baseUrl: 'https://produccion.test',
        clientId: 'test-client',
        clientSecret: 'test-secret',
    );
    Cache::forget('produccion_api_token');
    Cache::forget('produccion_api_formulas');
});

test('getAccessToken fetches and caches token', function () {
    Http::fake([
        'produccion.test/oauth/token' => Http::response([
            'access_token' => 'test-token-123',
            'token_type' => 'Bearer',
        ]),
    ]);

    $token = $this->service->getAccessToken();

    expect($token)->toBe('test-token-123');
    expect(Cache::has('produccion_api_token'))->toBeTrue();

    Http::assertSentCount(1);

    // Second call should use cache
    $token2 = $this->service->getAccessToken();
    expect($token2)->toBe('test-token-123');
    Http::assertSentCount(1);
});

test('getAccessToken returns null on failure and does not cache it', function () {
    Http::fake([
        'produccion.test/oauth/token' => Http::response([], 500),
    ]);

    $token = $this->service->getAccessToken();

    expect($token)->toBeNull();
    expect(Cache::has('produccion_api_token'))->toBeFalse();
});

test('getFormulas returns formulas on success', function () {
    Http::fake([
        'produccion.test/oauth/token' => Http::response([
            'access_token' => 'test-token',
        ]),
        'produccion.test/api/formulas' => Http::response([
            ['id' => 1, 'name' => 'Formula A'],
            ['id' => 2, 'name' => 'Formula B'],
        ]),
    ]);

    $formulas = $this->service->getFormulas();

    expect($formulas)->toHaveCount(2);
    expect($formulas[0]['name'])->toBe('Formula A');
});

test('getFormulas returns empty array when token fails', function () {
    Http::fake([
        'produccion.test/oauth/token' => Http::response([], 500),
    ]);

    $formulas = $this->service->getFormulas();

    expect($formulas)->toBe([]);
});

test('getFormulas retries once on 401', function () {
    Http::fake([
        'produccion.test/oauth/token' => Http::sequence()
            ->push(['access_token' => 'expired-token'])
            ->push(['access_token' => 'fresh-token']),
        'produccion.test/api/formulas' => Http::sequence()
            ->push([], 401)
            ->push([['id' => 1, 'name' => 'Formula A']]),
    ]);

    $formulas = $this->service->getFormulas();

    expect($formulas)->toHaveCount(1);
    expect($formulas[0]['name'])->toBe('Formula A');
});

test('getFormulas returns empty array on non-401 failure', function () {
    Http::fake([
        'produccion.test/oauth/token' => Http::response([
            'access_token' => 'test-token',
        ]),
        'produccion.test/api/formulas' => Http::response([], 500),
    ]);

    $formulas = $this->service->getFormulas();

    expect($formulas)->toBe([]);
});
