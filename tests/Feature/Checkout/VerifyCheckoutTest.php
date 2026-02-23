<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Stripe\StripeClient;

beforeEach(function () {
    $this->mockStripeClient = Mockery::mock(StripeClient::class);
    $this->app->bind(StripeClient::class, fn () => $this->mockStripeClient);
});

it('requires authentication', function () {
    $response = $this->getJson('/api/checkout/verify?session_id=cs_test_123');

    $response->assertUnauthorized();
});

it('requires session_id', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/checkout/verify');

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['session_id']);
});

it('returns 404 when order not found for session', function () {
    $user = User::factory()->create();

    $mockSession = (object) [
        'id' => 'cs_test_nonexistent',
        'payment_status' => 'unpaid',
    ];

    $mockSessions = Mockery::mock();
    $mockSessions->shouldReceive('retrieve')->once()->andReturn($mockSession);

    $this->mockStripeClient->checkout = (object) ['sessions' => $mockSessions];

    $response = $this->actingAs($user)->getJson('/api/checkout/verify?session_id=cs_test_nonexistent');

    $response->assertNotFound();
    $response->assertJsonPath('message', 'Order not found for this checkout session');
});

it('returns pending status when session not yet paid', function () {
    $user = User::factory()->create();
    Order::factory()->create([
        'user_id' => $user->id,
        'checkout_session_id' => 'cs_test_pending',
        'payment_status' => 'pending',
    ]);

    $mockSession = (object) [
        'id' => 'cs_test_pending',
        'payment_status' => 'unpaid',
    ];

    $mockSessions = Mockery::mock();
    $mockSessions->shouldReceive('retrieve')->once()->andReturn($mockSession);

    $this->mockStripeClient->checkout = (object) ['sessions' => $mockSessions];

    $response = $this->actingAs($user)->getJson('/api/checkout/verify?session_id=cs_test_pending');

    $response->assertSuccessful();
    $response->assertJsonPath('status', 'pending');
    $response->assertJsonPath('data.payment_status', 'pending');
});

it('returns paid status and updates order when session is paid', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'checkout_session_id' => 'cs_test_paid',
        'payment_status' => 'pending',
    ]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    $product = Product::factory()->create();
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $mockSession = (object) [
        'id' => 'cs_test_paid',
        'payment_status' => 'paid',
        'payment_intent' => 'pi_test_intent_123',
    ];

    $mockSessions = Mockery::mock();
    $mockSessions->shouldReceive('retrieve')->once()->andReturn($mockSession);

    $this->mockStripeClient->checkout = (object) ['sessions' => $mockSessions];

    $response = $this->actingAs($user)->getJson('/api/checkout/verify?session_id=cs_test_paid');

    $response->assertSuccessful();
    $response->assertJsonPath('status', 'paid');
    $response->assertJsonPath('data.payment_status', 'completed');

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'payment_status' => 'completed',
        'payment_intent_id' => 'pi_test_intent_123',
    ]);

    expect($cart->fresh()->status)->toBe('completed');
    expect($cart->items()->count())->toBe(0);
});

it('handles already completed order idempotently', function () {
    $user = User::factory()->create();
    Order::factory()->create([
        'user_id' => $user->id,
        'checkout_session_id' => 'cs_test_completed',
        'payment_status' => 'completed',
        'payment_intent_id' => 'pi_test_existing',
    ]);

    $mockSession = (object) [
        'id' => 'cs_test_completed',
        'payment_status' => 'paid',
    ];

    $mockSessions = Mockery::mock();
    $mockSessions->shouldReceive('retrieve')->once()->andReturn($mockSession);

    $this->mockStripeClient->checkout = (object) ['sessions' => $mockSessions];

    $response = $this->actingAs($user)->getJson('/api/checkout/verify?session_id=cs_test_completed');

    $response->assertSuccessful();
    $response->assertJsonPath('status', 'paid');
    $response->assertJsonPath('data.payment_status', 'completed');

    $this->assertDatabaseHas('orders', [
        'checkout_session_id' => 'cs_test_completed',
        'payment_intent_id' => 'pi_test_existing',
    ]);
});
