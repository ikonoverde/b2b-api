<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Services\ShippingQuoteService;
use App\Services\SkydropxService;

function makeQuote(string $quoteId, float $price, int $days, string $carrier = 'Carrier'): array
{
    return [
        'carrier' => $carrier,
        'service' => 'Standard',
        'price' => $price,
        'estimated_days' => $days,
        'quote_id' => $quoteId,
        'shipping_method_id' => null,
    ];
}

function makeServiceWithQuotes(array $quotes): ShippingQuoteService
{
    $skydropx = Mockery::mock(SkydropxService::class);
    $skydropx->shouldReceive('getQuotes')->andReturn($quotes);

    return new ShippingQuoteService($skydropx);
}

function cartItemsForService(): \Illuminate\Support\Collection
{
    $product = Product::factory()->withDimensions()->create(['stock' => 10]);
    $cart = Cart::factory()->create(['status' => 'active']);
    CartItem::factory()->for($cart)->for($product)->create(['quantity' => 1]);

    return $cart->items()->with('product')->get();
}

$destination = [
    'postal_code' => '64000',
    'city' => 'Monterrey',
    'state' => 'Nuevo León',
    'neighborhood' => 'Centro',
];

test('returns all quotes when 3 or fewer', function () use ($destination) {
    $quotes = [
        makeQuote('q1', 100, 3),
        makeQuote('q2', 150, 2),
        makeQuote('q3', 200, 1),
    ];

    $service = makeServiceWithQuotes($quotes);
    $result = $service->getQuotes($destination, cartItemsForService());

    expect($result['quotes'])->toHaveCount(3);
});

test('selects cheapest, fastest and middle from many quotes', function () use ($destination) {
    $quotes = [
        makeQuote('cheap', 89, 3, 'Paquetexpress'),   // cheapest
        makeQuote('mid1', 136, 3, 'FedEx'),
        makeQuote('mid2', 165, 3, 'Estafeta'),
        makeQuote('fast', 178, 1, 'Paquetexpress'),   // fastest
        makeQuote('exp1', 213, 3, 'Paquetexpress'),
        makeQuote('exp2', 260, 2, 'Paquetexpress'),
        makeQuote('exp3', 400, 1, 'DHL'),
    ];

    $service = makeServiceWithQuotes($quotes);
    $result = $service->getQuotes($destination, cartItemsForService());

    expect($result['quotes'])->toHaveCount(3);

    $ids = array_column($result['quotes'], 'quote_id');
    expect($ids)->toContain('cheap') // cheapest
        ->toContain('fast');         // fastest
});

test('does not duplicate when cheapest is also fastest', function () use ($destination) {
    $quotes = [
        makeQuote('q1', 89, 1, 'Paquetexpress'),  // cheapest AND fastest
        makeQuote('q2', 136, 3, 'FedEx'),
        makeQuote('q3', 165, 3, 'Estafeta'),
        makeQuote('q4', 213, 5, 'DHL'),
    ];

    $service = makeServiceWithQuotes($quotes);
    $result = $service->getQuotes($destination, cartItemsForService());

    $ids = array_column($result['quotes'], 'quote_id');
    expect(array_count_values($ids))->each->toBe(1) // no duplicates
        ->and($ids)->toContain('q1');
});

test('applies markup to skydropx quotes: adds 10 then rounds up to next multiple of 10', function () use ($destination) {
    $quotes = [
        makeQuote('q1', 136.33, 3, 'FedEx'),
        makeQuote('q2', 178.64, 1, 'Paquetexpress'),
        makeQuote('q3', 200.00, 2, 'Estafeta'),
    ];

    $service = makeServiceWithQuotes($quotes);
    $result = $service->getQuotes($destination, cartItemsForService());

    $prices = array_column($result['quotes'], 'price');
    // 136.33 + 10 = 146.33 → ceil to 150
    // 178.64 + 10 = 188.64 → ceil to 190
    // 200.00 + 10 = 210.00 → ceil to 210
    expect($prices)->toBe([150.0, 190.0, 210.0]);
});

test('results are sorted by price ascending', function () use ($destination) {
    $quotes = [
        makeQuote('q1', 89, 3),
        makeQuote('q2', 178, 1),
        makeQuote('q3', 136, 3),
        makeQuote('q4', 213, 5),
        makeQuote('q5', 260, 2),
    ];

    $service = makeServiceWithQuotes($quotes);
    $result = $service->getQuotes($destination, cartItemsForService());

    $prices = array_column($result['quotes'], 'price');
    expect($prices)->toBe(collect($prices)->sort()->values()->all());
});
