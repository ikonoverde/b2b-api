<?php

use App\Services\SkydropxService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    Cache::flush();

    $this->service = new SkydropxService(
        baseUrl: 'https://api.skydropx.com/v1',
        apiKey: 'test-key',
        apiSecret: 'test-secret',
    );

    $this->oauthResponse = [
        'access_token' => 'fake-token',
        'expires_in' => 3600,
        'refresh_token' => 'fake-refresh',
    ];

    $this->destination = [
        'postal_code' => '64000',
        'city' => 'Monterrey',
        'state' => 'Nuevo León',
        'neighborhood' => 'Centro',
    ];
});

function fakeQuotesResponse(array ...$rates): \GuzzleHttp\Promise\PromiseInterface
{
    $rateData = array_map(fn (array $rate, int $i) => [
        'success' => $rate['success'] ?? true,
        'id' => $rate['id'] ?? 'rate_'.($i + 1),
        'provider_name' => strtolower($rate['provider'] ?? 'unknown'),
        'provider_display_name' => $rate['provider'],
        'provider_service_name' => $rate['service'] ?? 'Estándar',
        'provider_service_code' => strtolower($rate['service'] ?? 'standard'),
        'status' => ($rate['success'] ?? true) ? 'completed' : 'pending',
        'currency_code' => 'MXN',
        'amount' => $rate['price'] ?? null,
        'total' => $rate['price'] ?? null,
        'days' => $rate['days'] ?? 5,
    ], $rates, array_keys($rates));

    return Http::response([
        'id' => 'quote_'.uniqid(),
        'is_completed' => true,
        'rates' => $rateData,
    ]);
}

test('returns normalized quotes from successful response', function () {
    Http::fake([
        '*/oauth/token' => Http::response($this->oauthResponse),
        '*/quotations' => fakeQuotesResponse(
            ['provider' => 'FedEx', 'service' => 'Express', 'price' => '150.50', 'days' => 2],
            ['provider' => 'Estafeta', 'service' => 'Terrestre', 'price' => '89.00', 'days' => 5],
        ),
    ]);

    $quotes = $this->service->getQuotes($this->destination, [
        'weight' => 2.5, 'height' => 30, 'width' => 20, 'length' => 15,
    ]);

    expect($quotes)->toHaveCount(2)
        ->and($quotes[0]['carrier'])->toBe('Estafeta')
        ->and($quotes[0]['price'])->toBe(89.0)
        ->and($quotes[1]['carrier'])->toBe('FedEx')
        ->and($quotes[1]['price'])->toBe(150.50)
        ->and($quotes[0]['quote_id'])->toStartWith('quote_');
});

test('returns empty array on quotation api error', function () {
    Http::fake([
        '*/oauth/token' => Http::response($this->oauthResponse),
        '*/quotations' => Http::response([], 500),
    ]);

    $quotes = $this->service->getQuotes($this->destination, [
        'weight' => 1.0, 'height' => 10, 'width' => 10, 'length' => 10,
    ]);

    expect($quotes)->toBeEmpty();
});

test('returns empty array when oauth fails', function () {
    Http::fake([
        '*/oauth/token' => Http::response([], 401),
    ]);

    $quotes = $this->service->getQuotes($this->destination, [
        'weight' => 1.0, 'height' => 10, 'width' => 10, 'length' => 10,
    ]);

    expect($quotes)->toBeEmpty();
});

test('returns empty array on timeout', function () {
    Http::fake([
        '*/oauth/token' => Http::response($this->oauthResponse),
        '*/quotations' => fn () => throw new \Illuminate\Http\Client\ConnectionException('Timeout'),
    ]);

    $quotes = $this->service->getQuotes($this->destination, [
        'weight' => 1.0, 'height' => 10, 'width' => 10, 'length' => 10,
    ]);

    expect($quotes)->toBeEmpty();
});

test('caches quotes for same parameters', function () {
    Http::fake([
        '*/oauth/token' => Http::response($this->oauthResponse),
        '*/quotations' => fakeQuotesResponse(
            ['provider' => 'FedEx', 'service' => 'Express', 'price' => '100.00', 'days' => 2],
        ),
    ]);

    $parcel = ['weight' => 1.0, 'height' => 10, 'width' => 10, 'length' => 10];

    $this->service->getQuotes($this->destination, $parcel);
    $this->service->getQuotes($this->destination, $parcel);

    // 1 oauth + 1 quotation = 2 total (second getQuotes is fully cached)
    Http::assertSentCount(2);
});

test('caches oauth token and reuses it', function () {
    Http::fake([
        '*/oauth/token' => Http::response($this->oauthResponse),
        '*/quotations' => fakeQuotesResponse(
            ['provider' => 'FedEx', 'service' => 'Express', 'price' => '100.00', 'days' => 2],
        ),
    ]);

    // Different parcels so quote cache doesn't kick in
    $this->service->getQuotes($this->destination, ['weight' => 1.0, 'height' => 10, 'width' => 10, 'length' => 10]);
    $this->service->getQuotes($this->destination, ['weight' => 2.0, 'height' => 20, 'width' => 20, 'length' => 20]);

    // Only 1 oauth call, 2 quotation calls
    Http::assertSentCount(3);
});

test('retries with fresh token on 401 quotation response', function () {
    $callCount = 0;

    Http::fake([
        '*/oauth/token' => Http::response($this->oauthResponse),
        '*/quotations' => function () use (&$callCount) {
            $callCount++;

            if ($callCount === 1) {
                return Http::response([], 401);
            }

            return fakeQuotesResponse(
                ['provider' => 'DHL', 'service' => 'Express', 'price' => '120.00', 'days' => 3],
            );
        },
    ]);

    // Pre-cache a token so the first call uses it, then gets 401
    Cache::put('skydropx_access_token', 'expired-token', 3600);

    $quotes = $this->service->getQuotes($this->destination, [
        'weight' => 1.0, 'height' => 10, 'width' => 10, 'length' => 10,
    ]);

    expect($quotes)->toHaveCount(1)
        ->and($quotes[0]['carrier'])->toBe('DHL');
});

test('filters out zero-price rates', function () {
    Http::fake([
        '*/oauth/token' => Http::response($this->oauthResponse),
        '*/quotations' => fakeQuotesResponse(
            ['provider' => 'FedEx', 'service' => 'Express', 'price' => '0', 'days' => 2],
            ['provider' => 'Estafeta', 'service' => 'Terrestre', 'price' => '89.00', 'days' => 5],
        ),
    ]);

    $quotes = $this->service->getQuotes($this->destination, [
        'weight' => 1.0, 'height' => 10, 'width' => 10, 'length' => 10,
    ]);

    expect($quotes)->toHaveCount(1)
        ->and($quotes[0]['carrier'])->toBe('Estafeta');
});

test('filters out rates with success false', function () {
    Http::fake([
        '*/oauth/token' => Http::response($this->oauthResponse),
        '*/quotations' => fakeQuotesResponse(
            ['provider' => 'FedEx', 'service' => 'Express', 'price' => '150.00', 'days' => 2],
            ['provider' => 'DHL', 'service' => 'Standard', 'price' => '100.00', 'days' => 5, 'success' => false],
        ),
    ]);

    $quotes = $this->service->getQuotes($this->destination, [
        'weight' => 1.0, 'height' => 10, 'width' => 10, 'length' => 10,
    ]);

    expect($quotes)->toHaveCount(1)
        ->and($quotes[0]['carrier'])->toBe('FedEx');
});

test('uses refresh token when access token is expired', function () {
    Cache::put('skydropx_refresh_token', 'stored-refresh-token', 7200);

    $oauthCalls = [];

    Http::fake([
        '*/oauth/token' => function ($request) use (&$oauthCalls) {
            $oauthCalls[] = $request->data();

            return Http::response([
                'access_token' => 'refreshed-token',
                'expires_in' => 3600,
                'refresh_token' => 'new-refresh-token',
            ]);
        },
        '*/quotations' => fakeQuotesResponse(
            ['provider' => 'FedEx', 'service' => 'Express', 'price' => '100.00', 'days' => 2],
        ),
    ]);

    $this->service->getQuotes($this->destination, [
        'weight' => 1.0, 'height' => 10, 'width' => 10, 'length' => 10,
    ]);

    expect($oauthCalls)->toHaveCount(1)
        ->and($oauthCalls[0]['grant_type'])->toBe('refresh_token')
        ->and($oauthCalls[0]['refresh_token'])->toBe('stored-refresh-token');

    expect(Cache::get('skydropx_refresh_token'))->toBe('new-refresh-token');
});
