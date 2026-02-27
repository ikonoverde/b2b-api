<?php

use App\Models\Order;
use App\Models\User;

test('admin can add tracking to processing order', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create();

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/tracking", [
        'tracking_number' => '1234567890',
        'shipping_carrier' => 'DHL',
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('order.tracking_number', '1234567890')
        ->where('order.shipping_carrier', 'DHL')
        ->where('order.status', 'shipped')
        ->where('flash.success', fn ($msg) => str_contains($msg, 'rastreo'))
    );

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'tracking_number' => '1234567890',
        'shipping_carrier' => 'DHL',
        'status' => 'shipped',
    ]);
});

test('tracking auto-transitions order to shipped', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create();

    $this->actingAs($admin)->patch("/admin/orders/{$order->id}/tracking", [
        'tracking_number' => 'ABC123',
        'shipping_carrier' => 'FedEx',
    ]);

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'shipped',
    ]);
});

test('tracking creates status history record', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create();

    $this->actingAs($admin)->patch("/admin/orders/{$order->id}/tracking", [
        'tracking_number' => 'ABC123',
        'shipping_carrier' => 'Estafeta',
    ]);

    $this->assertDatabaseHas('order_status_histories', [
        'order_id' => $order->id,
        'admin_id' => $admin->id,
        'from_status' => 'processing',
        'to_status' => 'shipped',
    ]);
});

test('cannot add tracking to non-processing order', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create(['status' => 'pending']);

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/tracking", [
        'tracking_number' => '1234567890',
        'shipping_carrier' => 'DHL',
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('flash.error', fn ($msg) => str_contains($msg, 'procesamiento'))
    );
});

test('cannot add tracking to shipped order', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->shipped()->create();

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/tracking", [
        'tracking_number' => '1234567890',
        'shipping_carrier' => 'DHL',
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('flash.error', fn ($msg) => str_contains($msg, 'procesamiento'))
    );
});

test('tracking requires tracking_number', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create();

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/tracking", [
        'shipping_carrier' => 'DHL',
    ]);

    $response->assertSessionHasErrors(['tracking_number']);
});

test('tracking requires shipping_carrier', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create();

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/tracking", [
        'tracking_number' => '1234567890',
    ]);

    $response->assertSessionHasErrors(['shipping_carrier']);
});

test('customer cannot add tracking', function () {
    $customer = User::factory()->create();
    $order = Order::factory()->processing()->create();

    $response = $this->actingAs($customer)->patch("/admin/orders/{$order->id}/tracking", [
        'tracking_number' => '1234567890',
        'shipping_carrier' => 'DHL',
    ]);

    $response->assertForbidden();
});

test('super_admin can add tracking', function () {
    $superAdmin = User::factory()->superAdmin()->create();
    $order = Order::factory()->processing()->create();

    $response = $this->actingAs($superAdmin)->patch("/admin/orders/{$order->id}/tracking", [
        'tracking_number' => '1234567890',
        'shipping_carrier' => 'DHL',
    ]);

    $response->assertSuccessful();
});

test('tracking number max length is validated', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create();

    $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/tracking", [
        'tracking_number' => str_repeat('A', 101),
        'shipping_carrier' => 'DHL',
    ]);

    $response->assertSessionHasErrors(['tracking_number']);
});
