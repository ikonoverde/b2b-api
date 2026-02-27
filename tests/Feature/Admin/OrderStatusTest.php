<?php

use App\Models\Order;
use App\Models\User;

test('admin can transition order from pending to processing', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create(['status' => 'pending']);

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
        'status' => 'processing',
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('order.status', 'processing')
        ->where('flash.success', 'Estado del pedido actualizado exitosamente.')
    );

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'processing',
    ]);
});

test('admin can transition order from pending to cancelled', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create(['status' => 'pending']);

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
        'status' => 'cancelled',
    ]);

    $response->assertSuccessful();
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'cancelled',
    ]);
});

test('admin can transition order from processing to shipped', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create();

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
        'status' => 'shipped',
    ]);

    $response->assertSuccessful();
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'shipped',
    ]);
});

test('admin can transition order from shipped to delivered', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->shipped()->create();

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
        'status' => 'delivered',
    ]);

    $response->assertSuccessful();
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'delivered',
    ]);
});

test('admin cannot transition delivered order', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->delivered()->create();

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
        'status' => 'processing',
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('flash.error', fn ($msg) => str_contains($msg, 'No se puede cambiar'))
    );

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'delivered',
    ]);
});

test('admin cannot transition cancelled order', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->cancelled()->create();

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
        'status' => 'pending',
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('flash.error', fn ($msg) => str_contains($msg, 'No se puede cambiar'))
    );
});

test('admin cannot skip status transition', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create(['status' => 'pending']);

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
        'status' => 'shipped',
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('flash.error', fn ($msg) => str_contains($msg, 'No se puede cambiar'))
    );
});

test('status transition creates history record', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create(['status' => 'pending']);

    $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
        'status' => 'processing',
    ]);

    $this->assertDatabaseHas('order_status_histories', [
        'order_id' => $order->id,
        'admin_id' => $admin->id,
        'from_status' => 'pending',
        'to_status' => 'processing',
    ]);
});

test('super_admin can update order status', function () {
    $superAdmin = User::factory()->superAdmin()->create();
    $order = Order::factory()->create(['status' => 'pending']);

    $response = $this->actingAs($superAdmin)->patch("/admin/orders/{$order->id}/status", [
        'status' => 'processing',
    ]);

    $response->assertSuccessful();
});

test('customer cannot update order status', function () {
    $customer = User::factory()->create();
    $order = Order::factory()->create(['status' => 'pending']);

    $response = $this->actingAs($customer)->patch("/admin/orders/{$order->id}/status", [
        'status' => 'processing',
    ]);

    $response->assertForbidden();
});

test('status update requires valid status value', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create(['status' => 'pending']);

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
        'status' => 'invalid_status',
    ]);

    $response->assertSessionHasErrors(['status']);
});

test('status update requires status field', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create(['status' => 'pending']);

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", []);

    $response->assertSessionHasErrors(['status']);
});

test('payment_pending order can transition to pending', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create(['status' => 'payment_pending']);

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
        'status' => 'pending',
    ]);

    $response->assertSuccessful();
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'pending',
    ]);
});

test('payment_pending order can transition to cancelled', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create(['status' => 'payment_pending']);

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
        'status' => 'cancelled',
    ]);

    $response->assertSuccessful();
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'cancelled',
    ]);
});
