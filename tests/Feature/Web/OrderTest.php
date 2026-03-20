<?php

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

it('requires authentication', function () {
    $response = $this->get('/account/orders');

    $response->assertRedirect('/login');
});

it('shows orders page with paginated orders', function () {
    $user = User::factory()->create();
    Order::factory(3)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get('/account/orders');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Orders/Index')
            ->has('orders.data', 3)
            ->has('orders.current_page')
            ->has('orders.last_page')
        );
});

it('does not show other users orders', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Order::factory(2)->create(['user_id' => $user->id]);
    Order::factory(3)->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->get('/account/orders');

    $response->assertInertia(fn ($page) => $page
        ->has('orders.data', 2)
    );
});

it('reorders items from a previous order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 50.00, 'stock' => 20, 'is_active' => true]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'unit_price' => 50.00,
        'subtotal' => 100.00,
    ]);

    $response = $this->actingAs($user)->post("/account/orders/{$order->id}/reorder");

    $response->assertRedirect(route('cart'))
        ->assertSessionHas('success');

    $cart = Cart::where('user_id', $user->id)->where('status', 'active')->first();
    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);
});

it('redirects back with error when all products are unavailable', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 50.00, 'stock' => 0, 'is_active' => true]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'unit_price' => 50.00,
        'subtotal' => 100.00,
    ]);

    $response = $this->actingAs($user)
        ->from('/account/orders')
        ->post("/account/orders/{$order->id}/reorder");

    $response->assertRedirect('/account/orders')
        ->assertSessionHas('error');
});

it('prevents reordering another user\'s order', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->post("/account/orders/{$order->id}/reorder");

    $response->assertForbidden();
});

it('requires authentication for reorder', function () {
    $order = Order::factory()->create();

    $response = $this->post("/account/orders/{$order->id}/reorder");

    $response->assertRedirect('/login');
});

it('downloads invoice for own order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get("/account/orders/{$order->id}/invoice");

    $response->assertSuccessful();
    $response->assertHeader('Content-Type', 'text/html; charset=UTF-8');
});

it('prevents downloading invoice for another user order', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->get("/account/orders/{$order->id}/invoice");

    $response->assertForbidden();
});
