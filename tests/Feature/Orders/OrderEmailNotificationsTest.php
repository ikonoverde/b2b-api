<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Notifications\Order\OrderConfirmation;
use App\Notifications\Order\OrderStatusChanged;
use Illuminate\Support\Facades\Notification;
use Stripe\StripeClient;

beforeEach(function () {
    $this->mockStripeClient = Mockery::mock(StripeClient::class);
    $this->app->bind(StripeClient::class, fn () => $this->mockStripeClient);
    Notification::fake();
});

// Order Confirmation Email Tests
describe('Order Confirmation Email', function () {
    it('sends confirmation email when checkout is verified and paid', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'checkout_session_id' => 'cs_test_paid',
            'payment_status' => 'pending',
            'status' => 'pending',
        ]);
        OrderItem::factory()->create(['order_id' => $order->id]);

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
        Notification::assertSentTo($user, OrderConfirmation::class, function ($notification) use ($order) {
            return $notification->order->id === $order->id;
        });
    });

    it('does not send confirmation email when session is not paid', function () {
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
        Notification::assertNothingSent();
    });

    it('does not send duplicate confirmation email for already completed orders', function () {
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
        Notification::assertNothingSent();
    });
});

// Order Status Change Email Tests
describe('Order Status Change Email', function () {
    it('sends status change email when admin updates order status', function () {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $customer->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
            'status' => 'processing',
        ]);

        $response->assertSuccessful();
        Notification::assertSentTo($customer, OrderStatusChanged::class, function ($notification) use ($order) {
            return $notification->order->id === $order->id
                && $notification->previousStatus === 'pending';
        });
    });

    it('sends status change email for pending to cancelled transition', function () {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $customer->id,
            'status' => 'pending',
        ]);

        $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
            'status' => 'cancelled',
        ]);

        Notification::assertSentTo($customer, OrderStatusChanged::class, function ($notification) {
            return $notification->previousStatus === 'pending'
                && $notification->order->status === 'cancelled';
        });
    });

    it('sends status change email for processing to shipped transition', function () {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $customer->id,
            'status' => 'processing',
        ]);

        $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
            'status' => 'shipped',
        ]);

        Notification::assertSentTo($customer, OrderStatusChanged::class, function ($notification) {
            return $notification->previousStatus === 'processing'
                && $notification->order->status === 'shipped';
        });
    });

    it('sends status change email for shipped to delivered transition', function () {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $customer->id,
            'status' => 'shipped',
        ]);

        $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
            'status' => 'delivered',
        ]);

        Notification::assertSentTo($customer, OrderStatusChanged::class, function ($notification) {
            return $notification->previousStatus === 'shipped'
                && $notification->order->status === 'delivered';
        });
    });

    it('does not send status change email for invalid transitions', function () {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $customer->id,
            'status' => 'delivered',
        ]);

        $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
            'status' => 'processing',
        ]);

        Notification::assertNothingSent();
    });
});

// Order Tracking Email Tests
describe('Order Tracking Email', function () {
    it('sends status change email with tracking info when adding tracking', function () {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $customer->id,
            'status' => 'processing',
        ]);

        $this->actingAs($admin)->patch("/admin/orders/{$order->id}/tracking", [
            'tracking_number' => '1234567890',
            'shipping_carrier' => 'DHL',
            'tracking_url' => 'https://www.dhl.com/track?id=1234567890',
        ]);

        Notification::assertSentTo($customer, OrderStatusChanged::class, function ($notification) {
            return $notification->previousStatus === 'processing'
                && $notification->order->status === 'shipped'
                && $notification->trackingNumber === '1234567890'
                && $notification->shippingCarrier === 'DHL'
                && $notification->trackingUrl === 'https://www.dhl.com/track?id=1234567890';
        });
    });

    it('sends status change email without tracking url when not provided', function () {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $customer->id,
            'status' => 'processing',
        ]);

        $this->actingAs($admin)->patch("/admin/orders/{$order->id}/tracking", [
            'tracking_number' => 'ABC123',
            'shipping_carrier' => 'FedEx',
        ]);

        Notification::assertSentTo($customer, OrderStatusChanged::class, function ($notification) {
            return $notification->trackingNumber === 'ABC123'
                && $notification->shippingCarrier === 'FedEx'
                && $notification->trackingUrl === null;
        });
    });

    it('does not send status change email when tracking update fails', function () {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $customer->id,
            'status' => 'pending', // Not processing, so should fail
        ]);

        $this->actingAs($admin)->patch("/admin/orders/{$order->id}/tracking", [
            'tracking_number' => '1234567890',
            'shipping_carrier' => 'DHL',
        ]);

        Notification::assertNothingSent();
    });
});

// Email Content Tests
describe('Email Content', function () {
    it('order confirmation email contains correct order details', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
            'total_amount' => 150.00,
            'shipping_cost' => 10.00,
        ]);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_name' => 'Test Product',
            'quantity' => 2,
            'unit_price' => 70.00,
            'subtotal' => 140.00,
        ]);

        $notification = new OrderConfirmation($order);
        $mailMessage = $notification->toMail($user);

        expect($mailMessage->subject)->toContain('Confirmación de Pedido');
        expect($mailMessage->subject)->toContain((string) $order->id);
    });

    it('status change email contains correct status information', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'processing',
        ]);

        $notification = new OrderStatusChanged($order, 'pending');
        $mailMessage = $notification->toMail($user);

        expect($mailMessage->subject)->toContain('Actualización de Estado');
        expect($mailMessage->subject)->toContain((string) $order->id);
    });

    it('status change email includes tracking info when provided', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'shipped',
        ]);

        $notification = new OrderStatusChanged(
            $order,
            'processing',
            '1234567890',
            'DHL',
            'https://www.dhl.com/track?id=1234567890'
        );
        $mailMessage = $notification->toMail($user);

        expect($mailMessage->subject)->toContain('Actualización de Estado');
    });
});

// Queue Tests
describe('Email Queue', function () {
    it('order confirmation implements ShouldQueue', function () {
        $notification = new OrderConfirmation(Order::factory()->make());

        expect($notification)->toBeInstanceOf(\Illuminate\Contracts\Queue\ShouldQueue::class);
    });

    it('order status changed implements ShouldQueue', function () {
        $notification = new OrderStatusChanged(
            Order::factory()->make(),
            'pending'
        );

        expect($notification)->toBeInstanceOf(\Illuminate\Contracts\Queue\ShouldQueue::class);
    });
});
