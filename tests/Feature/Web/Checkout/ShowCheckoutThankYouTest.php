<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;

it('requires authentication', function () {
    $this->get('/checkout/thank-you?order=1')->assertRedirect('/login');
});

it('returns 404 for another users order', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)->get("/checkout/thank-you?order={$order->id}")
        ->assertNotFound();
});

it('shows confirmation for users order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'processing',
        'payment_status' => 'completed',
    ]);
    $orderItem = OrderItem::factory()->create(['order_id' => $order->id]);

    $this->actingAs($user)->get("/checkout/thank-you?order={$order->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Checkout/ThankYou')
            ->has('order')
            ->where('order.id', $order->id)
            ->where('order.payment_status', 'completed')
            ->where('order.meta_purchase_event_id', "order_{$order->id}")
            ->where('order.items.0.product_id', $orderItem->product_id)
        );
});

it('does not expose purchase event id for pending payment', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'payment_pending',
        'payment_status' => 'pending',
    ]);

    $this->actingAs($user)->get("/checkout/thank-you?order={$order->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Checkout/ThankYou')
            ->where('order.payment_status', 'pending')
            ->where('order.meta_purchase_event_id', null)
        );
});

it('exposes purchase event id after a pending payment completes on reload', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'payment_pending',
        'payment_status' => 'pending',
    ]);

    $response = $this->actingAs($user)->get("/checkout/thank-you?order={$order->id}")
        ->assertSuccessful();

    $order->update([
        'status' => 'processing',
        'payment_status' => 'completed',
    ]);

    $response->assertInertia(fn ($page) => $page
        ->component('Checkout/ThankYou')
        ->where('order.payment_status', 'pending')
        ->where('order.meta_purchase_event_id', null)
        ->reloadOnly('order', fn ($reload) => $reload
            ->where('order.payment_status', 'completed')
            ->where('order.meta_purchase_event_id', "order_{$order->id}")
        )
    );
});

it('shows failed payment status for users order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'payment_pending',
        'payment_status' => 'failed',
    ]);

    $this->actingAs($user)->get("/checkout/thank-you?order={$order->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Checkout/ThankYou')
            ->where('order.payment_status', 'failed')
            ->where('order.meta_purchase_event_id', null)
        );
});
