<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ShippingMethod;
use App\Models\User;
use Stripe\StripeClient;

beforeEach(function () {
    $this->mockStripeClient = Mockery::mock(StripeClient::class);
    $this->app->bind(StripeClient::class, fn () => $this->mockStripeClient);
});

it('requires authentication', function () {
    $response = $this->postJson('/api/checkout', []);

    $response->assertUnauthorized();
});

it('requires success_url and cancel_url', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/checkout', []);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['success_url', 'cancel_url']);
});

it('validates success_url is a valid url', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/checkout', [
        'success_url' => 'not-a-url',
        'cancel_url' => 'https://example.com/cancel',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['success_url']);
});

it('returns 400 when cart is empty', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/checkout', [
        'success_url' => 'https://example.com/success',
        'cancel_url' => 'https://example.com/cancel',
    ]);

    $response->assertStatus(400);
    $response->assertJsonPath('message', 'Cart is empty');
});

it('creates order and returns checkout url', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 50.00, 'stock' => 100]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 50.00,
    ]);

    $mockSession = (object) [
        'id' => 'cs_test_session_123',
        'url' => 'https://checkout.stripe.com/c/pay/cs_test_session_123',
    ];

    $mockSessions = Mockery::mock();
    $mockSessions->shouldReceive('create')->once()->andReturn($mockSession);

    $this->mockStripeClient->checkout = (object) ['sessions' => $mockSessions];

    $response = $this->actingAs($user)->postJson('/api/checkout', [
        'success_url' => 'https://example.com/success',
        'cancel_url' => 'https://example.com/cancel',
    ]);

    $response->assertCreated();
    $response->assertJsonPath('checkout_url', 'https://checkout.stripe.com/c/pay/cs_test_session_123');
    $response->assertJsonPath('data.user_id', $user->id);
    $response->assertJsonPath('data.status', 'pending');
    $response->assertJsonPath('data.payment_status', 'pending');
    $response->assertJsonStructure([
        'checkout_url',
        'data' => ['id', 'user_id', 'status', 'payment_status', 'total_amount', 'shipping_cost', 'items'],
    ]);
});

it('creates order items from cart items', function () {
    $user = User::factory()->create();
    $product1 = Product::factory()->create(['price' => 25.00, 'stock' => 100]);
    $product2 = Product::factory()->create(['price' => 75.00, 'stock' => 100]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product1->id,
        'quantity' => 2,
        'unit_price' => 25.00,
    ]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product2->id,
        'quantity' => 1,
        'unit_price' => 75.00,
    ]);

    $mockSession = (object) [
        'id' => 'cs_test_session_456',
        'url' => 'https://checkout.stripe.com/c/pay/cs_test_session_456',
    ];

    $mockSessions = Mockery::mock();
    $mockSessions->shouldReceive('create')->once()->andReturn($mockSession);

    $this->mockStripeClient->checkout = (object) ['sessions' => $mockSessions];

    $response = $this->actingAs($user)->postJson('/api/checkout', [
        'success_url' => 'https://example.com/success',
        'cancel_url' => 'https://example.com/cancel',
    ]);

    $response->assertCreated();
    $response->assertJsonCount(2, 'data.items');

    $this->assertDatabaseHas('order_items', [
        'product_id' => $product1->id,
        'quantity' => 2,
        'unit_price' => 25.00,
    ]);
    $this->assertDatabaseHas('order_items', [
        'product_id' => $product2->id,
        'quantity' => 1,
        'unit_price' => 75.00,
    ]);
});

it('stores checkout session id on order', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 50.00, 'stock' => 100]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 50.00,
    ]);

    $mockSession = (object) [
        'id' => 'cs_test_session_789',
        'url' => 'https://checkout.stripe.com/c/pay/cs_test_session_789',
    ];

    $mockSessions = Mockery::mock();
    $mockSessions->shouldReceive('create')->once()->andReturn($mockSession);

    $this->mockStripeClient->checkout = (object) ['sessions' => $mockSessions];

    $this->actingAs($user)->postJson('/api/checkout', [
        'success_url' => 'https://example.com/success',
        'cancel_url' => 'https://example.com/cancel',
    ]);

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'checkout_session_id' => 'cs_test_session_789',
    ]);
});

it('creates order with selected shipping method cost', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 50.00, 'stock' => 100]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 50.00,
    ]);

    $shippingMethod = ShippingMethod::factory()->create(['name' => 'Express', 'cost' => 25.00]);

    $mockSession = (object) [
        'id' => 'cs_test_shipping_method',
        'url' => 'https://checkout.stripe.com/c/pay/cs_test_shipping_method',
    ];

    $mockSessions = Mockery::mock();
    $mockSessions->shouldReceive('create')->once()->andReturn($mockSession);

    $this->mockStripeClient->checkout = (object) ['sessions' => $mockSessions];

    $response = $this->actingAs($user)->postJson('/api/checkout', [
        'success_url' => 'https://example.com/success',
        'cancel_url' => 'https://example.com/cancel',
        'shipping_method_id' => $shippingMethod->id,
    ]);

    $response->assertCreated();
    $response->assertJsonPath('data.shipping_cost', 25);
    $response->assertJsonPath('data.shipping_method_id', $shippingMethod->id);
    $response->assertJsonPath('data.total_amount', 125);

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'shipping_method_id' => $shippingMethod->id,
        'shipping_cost' => 25.00,
    ]);
});

it('falls back to config shipping cost when no method is provided', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 50.00, 'stock' => 100]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 50.00,
    ]);

    $mockSession = (object) [
        'id' => 'cs_test_fallback',
        'url' => 'https://checkout.stripe.com/c/pay/cs_test_fallback',
    ];

    $mockSessions = Mockery::mock();
    $mockSessions->shouldReceive('create')->once()->andReturn($mockSession);

    $this->mockStripeClient->checkout = (object) ['sessions' => $mockSessions];

    $response = $this->actingAs($user)->postJson('/api/checkout', [
        'success_url' => 'https://example.com/success',
        'cancel_url' => 'https://example.com/cancel',
    ]);

    $response->assertCreated();
    $response->assertJsonPath('data.shipping_method_id', null);

    $order = \App\Models\Order::where('user_id', $user->id)->first();
    expect((float) $order->shipping_cost)->toBe((float) config('shop.shipping_cost', 10.00));
});

it('rejects inactive shipping method', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 50.00, 'stock' => 100]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 50.00,
    ]);

    $shippingMethod = ShippingMethod::factory()->inactive()->create();

    $response = $this->actingAs($user)->postJson('/api/checkout', [
        'success_url' => 'https://example.com/success',
        'cancel_url' => 'https://example.com/cancel',
        'shipping_method_id' => $shippingMethod->id,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonPath('message', 'The selected shipping method is no longer available.');
});

it('rejects invalid shipping method id', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/checkout', [
        'success_url' => 'https://example.com/success',
        'cancel_url' => 'https://example.com/cancel',
        'shipping_method_id' => 99999,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['shipping_method_id']);
});
