<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderNote;
use App\Models\OrderStatusHistory;
use App\Models\User;

test('admin can view order details page', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create();

    $response = $this->actingAs($admin)->get("/admin/orders/{$order->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/orders/Show')
        ->where('order.id', $order->id)
    );
});

test('super_admin can view order details page', function () {
    $superAdmin = User::factory()->superAdmin()->create();
    $order = Order::factory()->create();

    $response = $this->actingAs($superAdmin)->get("/admin/orders/{$order->id}");

    $response->assertSuccessful();
});

test('customer cannot access order details page', function () {
    $customer = User::factory()->create();
    $order = Order::factory()->create();

    $response = $this->actingAs($customer)->get("/admin/orders/{$order->id}");

    $response->assertForbidden();
});

test('unauthenticated user is redirected to login when accessing order details', function () {
    $order = Order::factory()->create();

    $response = $this->get("/admin/orders/{$order->id}");

    $response->assertRedirect('/admin/login');
});

test('order details returns 404 for non-existent order', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/admin/orders/99999');

    $response->assertNotFound();
});

test('order details includes customer information', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->create(['name' => 'Test Customer']);
    $order = Order::factory()->create(['user_id' => $customer->id]);

    $response = $this->actingAs($admin)->get("/admin/orders/{$order->id}");

    $response->assertInertia(fn ($page) => $page
        ->where('order.customer.name', 'Test Customer')
        ->where('order.customer.email', $customer->email)
    );
});

test('order details includes items', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create();
    OrderItem::factory(3)->create(['order_id' => $order->id]);

    $response = $this->actingAs($admin)->get("/admin/orders/{$order->id}");

    $response->assertInertia(fn ($page) => $page
        ->where('order.items', fn ($items) => count($items) === 3)
    );
});

test('order details includes status histories and notes', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create();
    OrderStatusHistory::factory()->create(['order_id' => $order->id, 'admin_id' => $admin->id]);
    OrderNote::factory()->create(['order_id' => $order->id, 'admin_id' => $admin->id]);

    $response = $this->actingAs($admin)->get("/admin/orders/{$order->id}");

    $response->assertInertia(fn ($page) => $page
        ->where('order.status_histories', fn ($histories) => count($histories) === 1)
        ->where('order.notes', fn ($notes) => count($notes) === 1)
    );
});
