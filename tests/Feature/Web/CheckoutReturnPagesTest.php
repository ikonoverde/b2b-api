<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;

describe('Checkout Return Pages', function () {
    it('redirects unauthenticated users away from the thank-you page', function () {
        $response = $this->get('/checkout/thank-you?order=1');

        $response->assertRedirect('/login');
    });

    it('renders the thank-you page for the order owner', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);
        OrderItem::factory()->create(['order_id' => $order->id]);

        $response = $this->actingAs($user)->get("/checkout/thank-you?order={$order->id}");

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Checkout/ThankYou')
                ->where('order.id', $order->id)
            );
    });

    it('returns 404 when accessing another user\'s order on the thank-you page', function () {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->get("/checkout/thank-you?order={$order->id}");

        $response->assertNotFound();
    });
});
