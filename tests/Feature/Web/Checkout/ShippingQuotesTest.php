<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use App\Services\ShippingQuoteService;

function validQuotesPayload(array $overrides = []): array
{
    return array_merge([
        'postal_code' => '64000',
        'city' => 'Monterrey',
        'state' => 'Nuevo León',
        'neighborhood' => 'Centro',
    ], $overrides);
}

test('unauthenticated user cannot fetch shipping quotes', function () {
    $response = $this->postJson('/checkout/shipping-quotes', validQuotesPayload());

    $response->assertUnauthorized();
});

test('returns validation error for invalid postal code', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/checkout/shipping-quotes', validQuotesPayload([
        'postal_code' => '123',
    ]));

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('postal_code');
});

test('returns validation error when city, state, or neighborhood is missing', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->postJson('/checkout/shipping-quotes', validQuotesPayload([
        'city' => '',
        'state' => '',
        'neighborhood' => '',
    ]))->assertJsonValidationErrors(['city', 'state', 'neighborhood']);
});

test('returns error when cart is empty', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/checkout/shipping-quotes', validQuotesPayload());

    $response->assertStatus(422)
        ->assertJson(['error' => 'Tu carrito está vacío.']);
});

test('returns quotes for valid request', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->for($user)->create(['status' => 'active']);
    $product = Product::factory()->withDimensions()->create(['stock' => 100]);
    CartItem::factory()->for($cart)->for($product)->create(['quantity' => 2]);

    $this->mock(ShippingQuoteService::class)
        ->shouldReceive('getQuotes')
        ->once()
        ->andReturn([
            'quotes' => [
                [
                    'carrier' => 'FedEx',
                    'service' => 'Express',
                    'price' => 150.0,
                    'estimated_days' => 2,
                    'quote_id' => 'skydropx_123',
                    'shipping_method_id' => null,
                ],
            ],
            'source' => 'skydropx',
        ]);

    $response = $this->actingAs($user)->postJson('/checkout/shipping-quotes', validQuotesPayload());

    $response->assertSuccessful()
        ->assertJsonPath('source', 'skydropx')
        ->assertJsonCount(1, 'quotes')
        ->assertJsonPath('quotes.0.carrier', 'FedEx');
});

test('postal code must be exactly 5 characters', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->postJson('/checkout/shipping-quotes', validQuotesPayload([
        'postal_code' => '1234',
    ]))->assertJsonValidationErrors('postal_code');

    $this->actingAs($user)->postJson('/checkout/shipping-quotes', validQuotesPayload([
        'postal_code' => '123456',
    ]))->assertJsonValidationErrors('postal_code');
});
