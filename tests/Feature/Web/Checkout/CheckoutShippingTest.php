<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Services\ShippingQuoteService;

function createCartWithItems(User $user): Cart
{
    $cart = Cart::factory()->for($user)->create(['status' => 'active']);
    $product = Product::factory()->withDimensions()->create(['stock' => 100, 'price' => 50.00]);
    CartItem::factory()->for($cart)->for($product)->create([
        'quantity' => 2,
        'unit_price' => 50.00,
    ]);

    return $cart;
}

function validCheckoutData(array $overrides = []): array
{
    return array_merge([
        'name' => 'Juan Pérez',
        'address_line_1' => 'Calle Principal 123',
        'address_line_2' => 'Col. Centro',
        'city' => 'Monterrey',
        'state' => 'Nuevo León',
        'postal_code' => '64000',
        'phone' => '8181234567',
        'shipping_quote_id' => 'skydropx_123',
    ], $overrides);
}

test('checkout stores order with server-validated shipping cost', function () {
    $user = User::factory()->create();
    createCartWithItems($user);

    $this->mock(ShippingQuoteService::class)
        ->shouldReceive('getQuotes')
        ->once()
        ->andReturn([
            'quotes' => [
                [
                    'carrier' => 'FedEx',
                    'service' => 'Express',
                    'price' => 150.00,
                    'estimated_days' => 2,
                    'quote_id' => 'skydropx_123',
                    'shipping_method_id' => null,
                ],
            ],
            'source' => 'skydropx',
        ]);

    $response = $this->actingAs($user)->post('/checkout/shipping', validCheckoutData());

    $response->assertRedirect();

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'shipping_cost' => 150.00,
        'shipping_carrier' => 'FedEx - Express',
    ]);
});

test('server re-validates price even if frontend sends different amount', function () {
    $user = User::factory()->create();
    createCartWithItems($user);

    $this->mock(ShippingQuoteService::class)
        ->shouldReceive('getQuotes')
        ->once()
        ->andReturn([
            'quotes' => [
                [
                    'carrier' => 'FedEx',
                    'service' => 'Express',
                    'price' => 200.00, // real price is 200, not 50
                    'estimated_days' => 2,
                    'quote_id' => 'skydropx_123',
                    'shipping_method_id' => null,
                ],
            ],
            'source' => 'skydropx',
        ]);

    $response = $this->actingAs($user)->post('/checkout/shipping', validCheckoutData());

    $response->assertRedirect();

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'shipping_cost' => 200.00, // server used re-validated price
    ]);
});

test('falls back to cheapest quote when submitted quote_id not found', function () {
    $user = User::factory()->create();
    createCartWithItems($user);

    $this->mock(ShippingQuoteService::class)
        ->shouldReceive('getQuotes')
        ->once()
        ->andReturn([
            'quotes' => [
                [
                    'carrier' => 'Estafeta',
                    'service' => 'Terrestre',
                    'price' => 89.00,
                    'estimated_days' => 5,
                    'quote_id' => 'skydropx_999',
                    'shipping_method_id' => null,
                ],
            ],
            'source' => 'skydropx',
        ]);

    $response = $this->actingAs($user)->post('/checkout/shipping', validCheckoutData([
        'shipping_quote_id' => 'skydropx_expired',
    ]));

    $response->assertRedirect();

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'shipping_cost' => 89.00,
        'shipping_carrier' => 'Estafeta - Terrestre',
    ]);
});

test('static fallback stores shipping_method_id', function () {
    $user = User::factory()->create();
    createCartWithItems($user);

    $method = ShippingMethod::factory()->create([
        'name' => 'Envío Nacional',
        'description' => 'Envío estándar',
        'cost' => 99.00,
        'estimated_delivery_days' => 7,
    ]);

    $this->mock(ShippingQuoteService::class)
        ->shouldReceive('getQuotes')
        ->once()
        ->andReturn([
            'quotes' => [
                [
                    'carrier' => 'Envío Nacional',
                    'service' => 'Envío estándar',
                    'price' => 99.00,
                    'estimated_days' => 7,
                    'quote_id' => "static_{$method->id}",
                    'shipping_method_id' => $method->id,
                ],
            ],
            'source' => 'static',
        ]);

    $response = $this->actingAs($user)->post('/checkout/shipping', validCheckoutData([
        'shipping_quote_id' => "static_{$method->id}",
    ]));

    $response->assertRedirect();

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'shipping_method_id' => $method->id,
        'shipping_cost' => 99.00,
    ]);
});

test('checkout requires shipping quote fields', function () {
    $user = User::factory()->create();
    createCartWithItems($user);

    $response = $this->actingAs($user)->post('/checkout/shipping', [
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '06600',
        'phone' => '5551234567',
    ]);

    $response->assertSessionHasErrors(['shipping_quote_id']);
});

test('checkout with empty cart redirects to cart', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/checkout/shipping', validCheckoutData());

    $response->assertRedirect(route('cart'));
});
