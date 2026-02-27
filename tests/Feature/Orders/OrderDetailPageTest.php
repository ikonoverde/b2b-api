<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use App\Models\User;

it('requires authentication to view order detail page', function () {
    $order = Order::factory()->create();

    $this->get("/orders/{$order->id}")
        ->assertRedirect('/login');
});

it('returns 403 when viewing another user\'s order', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)
        ->get("/orders/{$order->id}")
        ->assertForbidden();
});

it('displays order detail page with order data', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'delivered',
        'total_amount' => 150.00,
        'shipping_cost' => 15.00,
        'tracking_number' => '123456789',
        'shipping_carrier' => 'DHL',
    ]);

    $product = Product::factory()->create(['name' => 'Test Product']);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => 'Test Product',
        'quantity' => 2,
        'unit_price' => 75.00,
        'subtotal' => 150.00,
    ]);

    OrderStatusHistory::factory()->create([
        'order_id' => $order->id,
        'from_status' => null,
        'to_status' => 'pending',
        'created_at' => now()->subDays(3),
    ]);

    OrderStatusHistory::factory()->create([
        'order_id' => $order->id,
        'from_status' => 'pending',
        'to_status' => 'delivered',
        'created_at' => now(),
    ]);

    $response = $this->actingAs($user)->get("/orders/{$order->id}");

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Orders/Show')
            ->has('order')
            ->where('order.id', $order->id)
            ->where('order.status', 'delivered')
            ->where('order.tracking_number', '123456789')
            ->where('order.shipping_carrier', 'DHL')
            ->has('order.items', 1)
            ->has('order.status_histories', 2)
        );
});

it('displays order detail page with shipping address', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'shipping_address' => [
            'street' => '123 Main St',
            'city' => 'Springfield',
            'state' => 'IL',
            'zip' => '62701',
            'country' => 'USA',
        ],
    ]);

    OrderItem::factory()->create(['order_id' => $order->id]);

    $response = $this->actingAs($user)->get("/orders/{$order->id}");

    $response->assertInertia(fn ($page) => $page
        ->where('order.shipping_address.street', '123 Main St')
        ->where('order.shipping_address.city', 'Springfield')
    );
});

it('displays order detail page without tracking info for pending orders', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
        'tracking_number' => null,
        'shipping_carrier' => null,
    ]);

    OrderItem::factory()->create(['order_id' => $order->id]);

    $response = $this->actingAs($user)->get("/orders/{$order->id}");

    $response->assertInertia(fn ($page) => $page
        ->where('order.status', 'pending')
        ->where('order.tracking_number', null)
    );
});

it('returns 404 for non-existent order', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/orders/99999')
        ->assertNotFound();
});

it('displays cancelled order status correctly', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'cancelled',
    ]);

    OrderItem::factory()->create(['order_id' => $order->id]);
    OrderStatusHistory::factory()->create([
        'order_id' => $order->id,
        'to_status' => 'cancelled',
    ]);

    $response = $this->actingAs($user)->get("/orders/{$order->id}");

    $response->assertInertia(fn ($page) => $page
        ->where('order.status', 'cancelled')
    );
});

it('displays order items with images', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    $product = Product::factory()->create();
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => 'Product with Image',
        'quantity' => 1,
        'unit_price' => 100.00,
        'subtotal' => 100.00,
        'image' => 'products/test-image.jpg',
    ]);

    $response = $this->actingAs($user)->get("/orders/{$order->id}");

    $response->assertInertia(fn ($page) => $page
        ->has('order.items', 1)
        ->where('order.items.0.product_name', 'Product with Image')
        ->where('order.items.0.quantity', 1)
    );
});
