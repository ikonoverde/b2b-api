<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Services\ShippingQuoteService;
use Stripe\StripeClient;

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
        'quote_id' => 'skydropx_123',
        'rate_id' => 'rate_abc',
    ], $overrides);
}

function mockSkydropxQuote(float $price, string $providerDisplay = 'FedEx', string $providerService = 'Express', string $rateId = 'rate_abc'): void
{
    test()->mock(ShippingQuoteService::class)
        ->shouldReceive('getQuote')
        ->once()
        ->andReturn([
            'id' => 'skydropx_123',
            'rates' => [
                [
                    'id' => $rateId,
                    'provider_display_name' => $providerDisplay,
                    'provider_service_name' => $providerService,
                    'total' => $price,
                    'days' => 2,
                    'success' => true,
                ],
            ],
            'packages' => [[
                'width' => 10,
                'height' => 10,
                'length' => 10,
                'weight' => 1,
            ]],
        ]);
}

function mockStripePaymentIntent(): void
{
    $mockPaymentIntent = new \stdClass;
    $mockPaymentIntent->id = 'pi_test_123';
    $mockPaymentIntent->client_secret = 'pi_test_123_secret_456';

    $mockPaymentIntents = Mockery::mock(\Stripe\Service\PaymentIntentService::class);
    $mockPaymentIntents->shouldReceive('create')->andReturn($mockPaymentIntent);

    $mockStripe = Mockery::mock(StripeClient::class);
    $mockStripe->paymentIntents = $mockPaymentIntents;

    app()->bind(StripeClient::class, fn () => $mockStripe);
}

test('checkout stores order with server-validated shipping cost', function () {
    $user = User::factory()->create();
    createCartWithItems($user);

    mockSkydropxQuote(150.00);
    mockStripePaymentIntent();

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

    mockSkydropxQuote(200.00);
    mockStripePaymentIntent();

    $response = $this->actingAs($user)->post('/checkout/shipping', validCheckoutData());

    $response->assertRedirect();

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'shipping_cost' => 200.00,
    ]);
});

test('falls back to static shipping when submitted quote_id is not found', function () {
    $user = User::factory()->create();
    createCartWithItems($user);

    $this->mock(ShippingQuoteService::class)
        ->shouldReceive('getQuote')
        ->once()
        ->andReturnNull();

    mockStripePaymentIntent();

    $response = $this->actingAs($user)->post('/checkout/shipping', validCheckoutData([
        'quote_id' => 'skydropx_expired',
    ]));

    $response->assertRedirect();

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'shipping_cost' => (float) config('shop.shipping_cost'),
        'shipping_carrier' => 'Envío estándar',
    ]);
});

test('static fallback stores static carrier when rate_id does not match', function () {
    $user = User::factory()->create();
    createCartWithItems($user);

    ShippingMethod::factory()->create([
        'name' => 'Envío Nacional',
        'description' => 'Envío estándar',
        'cost' => 99.00,
        'estimated_delivery_days' => 7,
    ]);

    mockSkydropxQuote(150.00, rateId: 'rate_other');
    mockStripePaymentIntent();

    $response = $this->actingAs($user)->post('/checkout/shipping', validCheckoutData([
        'rate_id' => 'rate_missing',
    ]));

    $response->assertRedirect();

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'shipping_cost' => (float) config('shop.shipping_cost'),
        'shipping_carrier' => 'Envío estándar',
    ]);
});

test('checkout requires shipping quote fields', function () {
    $user = User::factory()->create();
    createCartWithItems($user);

    $response = $this->actingAs($user)->post('/checkout/shipping', [
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'address_line_2' => 'Piso 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '06600',
        'phone' => '5551234567',
    ]);

    $response->assertSessionHasErrors(['quote_id', 'rate_id']);
});

test('checkout with empty cart redirects to cart', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/checkout/shipping', validCheckoutData());

    $response->assertRedirect(route('cart'));
});
