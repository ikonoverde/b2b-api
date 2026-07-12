<?php

use App\Jobs\CreateShippingLabel;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Notifications\Order\NewOrderReceived;
use App\Notifications\Order\OrderConfirmation;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Laravel\Cashier\Events\WebhookReceived;

beforeEach(function () {
    config([
        'services.meta_pixel.conversions_api_access_token' => null,
        'services.meta_pixel.test_event_code' => null,
    ]);
});

/**
 * Stamp this site's key onto webhook metadata the way the checkout controllers
 * stamp it onto Stripe objects. Pass an explicit `site` to simulate an event
 * from the retail storefront on the shared Stripe account.
 */
function siteMetadata(array $metadata): array
{
    return array_merge(['site' => config('shop.site_key')], $metadata);
}

function checkoutCompletedPayload(array $metadata = [], ?string $paymentIntent = 'pi_test_123'): array
{
    return [
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'metadata' => siteMetadata($metadata),
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
                'metadata' => siteMetadata($metadata),
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

// Stock management

it('decrements product stock when checkout is completed', function () {
    $user = User::factory()->create();
    $product1 = Product::factory()->create(['stock' => 50]);
    $product2 = Product::factory()->create(['stock' => 30]);
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product1->id,
        'quantity' => 5,
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product2->id,
        'quantity' => 3,
    ]);

    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    expect($product1->fresh()->stock)->toBe(45);
    expect($product2->fresh()->stock)->toBe(27);
});

it('does not double-decrement stock on duplicate webhook', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['stock' => 50]);
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 10,
    ]);

    $payload = checkoutCompletedPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    );

    event(new WebhookReceived($payload));
    event(new WebhookReceived($payload));

    expect($product->fresh()->stock)->toBe(40);
});

it('does not change stock when checkout session expires', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['stock' => 50]);
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 10,
    ]);

    event(new WebhookReceived(checkoutExpiredPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    expect($product->fresh()->stock)->toBe(50);
});

it('restores product stock when charge is refunded', function () {
    $product1 = Product::factory()->create(['stock' => 45]);
    $product2 = Product::factory()->create(['stock' => 27]);
    $order = Order::factory()->create([
        'payment_status' => 'completed',
        'payment_intent_id' => 'pi_test_refund_stock',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product1->id,
        'quantity' => 5,
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product2->id,
        'quantity' => 3,
    ]);

    event(new WebhookReceived(chargeRefundedPayload(paymentIntent: 'pi_test_refund_stock')));

    expect($product1->fresh()->stock)->toBe(50);
    expect($product2->fresh()->stock)->toBe(30);
});

it('does not restore stock for non-completed orders on refund', function () {
    $product = Product::factory()->create(['stock' => 50]);
    $order = Order::factory()->create([
        'payment_status' => 'pending',
        'payment_intent_id' => 'pi_test_pending_stock',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 10,
    ]);

    event(new WebhookReceived(chargeRefundedPayload(paymentIntent: 'pi_test_pending_stock')));

    expect($product->fresh()->stock)->toBe(50);
});

// payment_intent.succeeded

function paymentIntentSucceededPayload(string $paymentIntentId = 'pi_test_123', array $metadata = []): array
{
    return [
        'type' => 'payment_intent.succeeded',
        'data' => [
            'object' => [
                'id' => $paymentIntentId,
                'metadata' => siteMetadata($metadata),
            ],
        ],
    ];
}

it('fulfills order on payment_intent.succeeded', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['stock' => 50]);
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'payment_pending',
        'payment_status' => 'pending',
        'payment_intent_id' => 'pi_test_web_123',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 5,
    ]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $product->id]);

    event(new WebhookReceived(paymentIntentSucceededPayload(
        paymentIntentId: 'pi_test_web_123',
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    $order->refresh();
    expect($order->payment_status)->toBe('completed');
    expect($order->status)->toBe('processing');
    expect($product->fresh()->stock)->toBe(45);
    expect($cart->fresh()->status)->toBe('completed');
    expect($cart->items()->count())->toBe(0);
});

it('is idempotent for payment_intent.succeeded on already completed order', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['stock' => 45]);
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'processing',
        'payment_status' => 'completed',
        'payment_intent_id' => 'pi_test_idempotent',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 5,
    ]);

    event(new WebhookReceived(paymentIntentSucceededPayload(
        paymentIntentId: 'pi_test_idempotent',
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    expect($product->fresh()->stock)->toBe(45);
    expect($order->fresh()->payment_status)->toBe('completed');
});

// Meta Conversions API

it('sends a meta conversions api purchase event on checkout completed', function () {
    config([
        'services.meta_pixel.enabled' => true,
        'services.meta_pixel.pixel_id' => 'pixel-123',
        'services.meta_pixel.conversions_api_access_token' => 'token-123',
        'services.meta_pixel.api_version' => 'v21.0',
        'services.meta_pixel.currency' => 'MXN',
    ]);

    Http::fake([
        'graph.facebook.com/*' => Http::response(['events_received' => 1]),
    ]);

    $user = User::factory()->create([
        'email' => 'Buyer@example.com',
        'phone' => '+52 (999) 123-4567',
    ]);
    $product = Product::factory()->create(['stock' => 50]);
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
        'total_amount' => 123.45,
        'shipping_cost' => 10.00,
        'client_ip_address' => '203.0.113.10',
        'client_user_agent' => 'Mozilla/5.0 Conversion Test',
        'meta_fbp' => 'fb.1.1710000000000.123456789',
        'meta_fbc' => 'fb.1.1710000000000.AbCdEf',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 56.72,
        'subtotal' => 113.44,
    ]);

    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    Http::assertSent(function ($request) use ($order, $product, $user): bool {
        $data = $request->data();
        $event = $data['data'][0] ?? [];

        return $request->method() === 'POST'
            && $request->url() === 'https://graph.facebook.com/v21.0/pixel-123/events'
            && $data['access_token'] === 'token-123'
            && $event['event_name'] === 'Purchase'
            && $event['event_id'] === "order_{$order->id}"
            && $event['action_source'] === 'website'
            && $event['event_source_url'] === route('checkout.thank-you', ['order' => $order->id])
            && $event['user_data']['em'] === hash('sha256', 'buyer@example.com')
            && $event['user_data']['ph'] === hash('sha256', '529991234567')
            && $event['user_data']['external_id'] === hash('sha256', (string) $user->id)
            && $event['user_data']['client_ip_address'] === '203.0.113.10'
            && $event['user_data']['client_user_agent'] === 'Mozilla/5.0 Conversion Test'
            && $event['user_data']['fbp'] === 'fb.1.1710000000000.123456789'
            && $event['user_data']['fbc'] === 'fb.1.1710000000000.AbCdEf'
            && $event['custom_data']['currency'] === 'MXN'
            && $event['custom_data']['value'] === 123.45
            && $event['custom_data']['order_id'] === (string) $order->id
            && $event['custom_data']['content_type'] === 'product'
            && $event['custom_data']['content_ids'] === [(string) $product->id]
            && $event['custom_data']['contents'] === [[
                'id' => (string) $product->id,
                'quantity' => 2,
                'item_price' => 56.72,
            ]]
            && $event['custom_data']['num_items'] === 2;
    });
});

it('does not send a meta conversions api event without an access token', function () {
    config(['services.meta_pixel.pixel_id' => 'pixel-123']);

    Http::fake();

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);

    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    Http::assertNothingSent();
});

it('ignores payment_intent.succeeded with missing metadata', function () {
    event(new WebhookReceived(paymentIntentSucceededPayload(metadata: [])));

    expect(Order::where('payment_status', 'completed')->count())->toBe(0);
});

// Shipping label dispatch

it('dispatches CreateShippingLabel job for skydropx orders on checkout completed', function () {
    Bus::fake(CreateShippingLabel::class);

    $user = User::factory()->create();
    $order = Order::factory()->withSkydropxShipping()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);

    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    Bus::assertDispatched(CreateShippingLabel::class, fn ($job) => $job->order->id === $order->id);
});

it('does not dispatch CreateShippingLabel job for static shipping orders', function () {
    Bus::fake(CreateShippingLabel::class);

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
        'shipping_quote_source' => 'static',
    ]);

    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    Bus::assertNotDispatched(CreateShippingLabel::class);
});

it('dispatches CreateShippingLabel job on payment_intent.succeeded for skydropx orders', function () {
    Bus::fake(CreateShippingLabel::class);

    $user = User::factory()->create();
    $order = Order::factory()->withSkydropxShipping()->create([
        'user_id' => $user->id,
        'status' => 'payment_pending',
        'payment_status' => 'pending',
        'payment_intent_id' => 'pi_test_label_dispatch',
    ]);

    event(new WebhookReceived(paymentIntentSucceededPayload(
        paymentIntentId: 'pi_test_label_dispatch',
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    Bus::assertDispatched(CreateShippingLabel::class, fn ($job) => $job->order->id === $order->id);
});

// Order confirmation notification

it('sends order confirmation notification on checkout completed', function () {
    Notification::fake();

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);

    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    Notification::assertSentTo($user, OrderConfirmation::class, function ($notification) use ($order) {
        return $notification->order->id === $order->id;
    });
});

it('sends order confirmation notification on payment_intent.succeeded', function () {
    Notification::fake();

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'payment_pending',
        'payment_status' => 'pending',
        'payment_intent_id' => 'pi_test_confirm_pi',
    ]);

    event(new WebhookReceived(paymentIntentSucceededPayload(
        paymentIntentId: 'pi_test_confirm_pi',
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    Notification::assertSentTo($user, OrderConfirmation::class);
});

it('does not send order confirmation notification for already completed orders', function () {
    Notification::fake();

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'processing',
        'payment_status' => 'completed',
        'payment_intent_id' => 'pi_test_already_done',
    ]);

    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
        paymentIntent: 'pi_test_different',
    )));

    Notification::assertNothingSent();
});

// Staff new-order notification

it('notifies active admin and super_admin staff of new order on checkout completed', function () {
    Notification::fake();

    $admin = User::factory()->admin()->create();
    $superAdmin = User::factory()->superAdmin()->create();
    $inactiveAdmin = User::factory()->admin()->inactive()->create();

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);

    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    Notification::assertSentTo($admin, NewOrderReceived::class, function ($notification) use ($order) {
        return $notification->order->id === $order->id;
    });
    Notification::assertSentTo($superAdmin, NewOrderReceived::class);
    Notification::assertNotSentTo($inactiveAdmin, NewOrderReceived::class);
    Notification::assertNotSentTo($user, NewOrderReceived::class);
});

it('notifies staff of new order on payment_intent.succeeded', function () {
    Notification::fake();

    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'payment_pending',
        'payment_status' => 'pending',
        'payment_intent_id' => 'pi_test_staff_pi',
    ]);

    event(new WebhookReceived(paymentIntentSucceededPayload(
        paymentIntentId: 'pi_test_staff_pi',
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    Notification::assertSentTo($admin, NewOrderReceived::class);
});

it('does not notify staff for already completed orders', function () {
    Notification::fake();

    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'processing',
        'payment_status' => 'completed',
        'payment_intent_id' => 'pi_test_staff_done',
    ]);

    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
        paymentIntent: 'pi_test_different',
    )));

    Notification::assertNotSentTo($admin, NewOrderReceived::class);
});

// Shared Stripe account: events from the retail storefront

it('does not fulfill an order when checkout completed belongs to the retail site', function () {
    Bus::fake(CreateShippingLabel::class);
    Notification::fake();

    $user = User::factory()->create();
    $product = Product::factory()->create(['stock' => 50]);
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 5,
    ]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $product->id]);

    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['site' => 'retail', 'order_id' => $order->id, 'user_id' => $user->id],
    )));

    $order->refresh();
    expect($order->payment_status)->toBe('pending');
    expect($order->status)->toBe('pending');
    expect($product->fresh()->stock)->toBe(50);
    expect($cart->fresh()->status)->toBe('active');
    Bus::assertNotDispatched(CreateShippingLabel::class);
    Notification::assertNothingSent();
});

it('does not fulfill an order when payment_intent.succeeded belongs to the retail site', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'payment_pending',
        'payment_status' => 'pending',
        'payment_intent_id' => 'pi_test_retail',
    ]);

    event(new WebhookReceived(paymentIntentSucceededPayload(
        paymentIntentId: 'pi_test_retail',
        metadata: ['site' => 'retail', 'order_id' => $order->id, 'user_id' => $user->id],
    )));

    expect($order->fresh()->payment_status)->toBe('pending');
});

it('does not cancel an order when checkout expired belongs to the retail site', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);

    event(new WebhookReceived(checkoutExpiredPayload(
        metadata: ['site' => 'retail', 'order_id' => $order->id, 'user_id' => $user->id],
    )));

    $order->refresh();
    expect($order->payment_status)->toBe('pending');
    expect($order->status)->toBe('pending');
});

it('ignores events with no site metadata rather than assuming they are ours', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);

    event(new WebhookReceived([
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'metadata' => ['order_id' => $order->id, 'user_id' => $user->id],
                'payment_intent' => 'pi_test_unstamped',
            ],
        ],
    ]));

    expect($order->fresh()->payment_status)->toBe('pending');
});

it('fulfills an order when the site key is configured to something other than the default', function () {
    config(['shop.site_key' => 'some-other-site']);

    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);

    event(new WebhookReceived(checkoutCompletedPayload(
        metadata: ['order_id' => $order->id, 'user_id' => $user->id],
    )));

    expect($order->fresh()->payment_status)->toBe('completed');
});

// Unrecognized events

it('silently ignores unrecognized event types', function () {
    event(new WebhookReceived([
        'type' => 'invoice.payment_succeeded',
        'data' => ['object' => []],
    ]));

    expect(true)->toBeTrue();
});
