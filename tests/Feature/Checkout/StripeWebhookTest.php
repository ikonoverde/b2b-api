<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Laravel\Cashier\Events\WebhookReceived;

function checkoutCompletedPayload(array $metadata = [], ?string $paymentIntent = 'pi_test_123'): array
{
    return [
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'metadata' => $metadata,
                'payment_intent' => $paymentIntent,
            ],
        ],
    ];
}

function checkoutExpiredPayload(array $metadata = []): array
{
    return [
        'type' => 'checkout.session.expired',
        'data' => [
            'object' => [
                'metadata' => $metadata,
            ],
        ],
    ];
}

function chargeRefundedPayload(?string $paymentIntent = 'pi_test_123'): array
{
    return [
        'type' => 'charge.refunded',
        'data' => [
            'object' => [
                'payment_intent' => $paymentIntent,
            ],
        ],
    ];
}

// checkout.session.completed

it('updates order status and payment status on checkout completed', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);

    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
        paymentIntent: 'pi_test_webhook_123',
    )));

    $order->refresh();
    expect($order->payment_status)->toBe('completed');
    expect($order->status)->toBe('processing');
    expect($order->payment_intent_id)->toBe('pi_test_webhook_123');
});

it('clears user cart on checkout completed', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    $product = Product::factory()->create();
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
    ]);

    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    expect($cart->fresh()->status)->toBe('completed');
    expect($cart->items()->count())->toBe(0);
});

it('is idempotent when order already completed', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'processing',
        'payment_status' => 'completed',
        'payment_intent_id' => 'pi_test_original',
    ]);

    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
        paymentIntent: 'pi_test_different',
    )));

    $order->refresh();
    expect($order->payment_intent_id)->toBe('pi_test_original');
    expect($order->payment_status)->toBe('completed');
});

it('ignores checkout completed with missing metadata', function () {
    event(new WebhookReceived(checkoutCompletedPayload(metadata: [])));

    expect(Order::where('payment_status', 'completed')->count())->toBe(0);
});

it('ignores checkout completed for nonexistent order', function () {
    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['order_id' => 99999, 'user_id' => 99999],
    )));

    expect(Order::where('payment_status', 'completed')->count())->toBe(0);
});

// checkout.session.expired

it('marks pending order as failed and cancelled on checkout expired', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);

    event(new WebhookReceived(checkoutExpiredPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    $order->refresh();
    expect($order->payment_status)->toBe('failed');
    expect($order->status)->toBe('cancelled');
});

it('does not affect already completed orders on checkout expired', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'processing',
        'payment_status' => 'completed',
    ]);

    event(new WebhookReceived(checkoutExpiredPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    $order->refresh();
    expect($order->payment_status)->toBe('completed');
    expect($order->status)->toBe('processing');
});

it('does not clear cart on checkout expired', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    $product = Product::factory()->create();
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
    ]);

    event(new WebhookReceived(checkoutExpiredPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    expect($cart->fresh()->status)->toBe('active');
    expect($cart->items()->count())->toBe(1);
});

// charge.refunded

it('marks completed order as refunded on charge refunded', function () {
    $order = Order::factory()->create([
        'payment_status' => 'completed',
        'payment_intent_id' => 'pi_test_refund',
    ]);

    event(new WebhookReceived(chargeRefundedPayload(paymentIntent: 'pi_test_refund')));

    expect($order->fresh()->payment_status)->toBe('refunded');
});

it('does not refund non-completed orders', function () {
    $order = Order::factory()->create([
        'payment_status' => 'pending',
        'payment_intent_id' => 'pi_test_pending_refund',
    ]);

    event(new WebhookReceived(chargeRefundedPayload(paymentIntent: 'pi_test_pending_refund')));

    expect($order->fresh()->payment_status)->toBe('pending');
});

it('ignores charge refunded with unknown payment intent', function () {
    Order::factory()->create([
        'payment_status' => 'completed',
        'payment_intent_id' => 'pi_test_known',
    ]);

    event(new WebhookReceived(chargeRefundedPayload(paymentIntent: 'pi_test_unknown')));

    $this->assertDatabaseHas('orders', [
        'payment_intent_id' => 'pi_test_known',
        'payment_status' => 'completed',
    ]);
});

// Unrecognized events

it('silently ignores unrecognized event types', function () {
    event(new WebhookReceived([
        'type' => 'invoice.payment_succeeded',
        'data' => ['object' => []],
    ]));

    expect(true)->toBeTrue();
});
