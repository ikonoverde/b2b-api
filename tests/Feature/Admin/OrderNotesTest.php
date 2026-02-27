<?php

use App\Models\Order;
use App\Models\User;

test('admin can add note to order', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create();

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/notes", [
        'content' => 'Cliente llamó para preguntar por el estado',
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('flash.success', 'Nota agregada exitosamente.')
        ->where('order.notes', fn ($notes) => count($notes) === 1)
    );

    $this->assertDatabaseHas('order_notes', [
        'order_id' => $order->id,
        'admin_id' => $admin->id,
        'content' => 'Cliente llamó para preguntar por el estado',
    ]);
});

test('super_admin can add note to order', function () {
    $superAdmin = User::factory()->superAdmin()->create();
    $order = Order::factory()->create();

    $response = $this->actingAs($superAdmin)->post("/admin/orders/{$order->id}/notes", [
        'content' => 'Nota del super admin',
    ]);

    $response->assertSuccessful();
});

test('customer cannot add note to order', function () {
    $customer = User::factory()->create();
    $order = Order::factory()->create();

    $response = $this->actingAs($customer)->post("/admin/orders/{$order->id}/notes", [
        'content' => 'Test note',
    ]);

    $response->assertForbidden();
});

test('note requires content field', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create();

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/notes", []);

    $response->assertSessionHasErrors(['content']);
});

test('note content cannot exceed 2000 characters', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create();

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/notes", [
        'content' => str_repeat('A', 2001),
    ]);

    $response->assertSessionHasErrors(['content']);
});

test('multiple notes can be added to same order', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create();

    $this->actingAs($admin)->post("/admin/orders/{$order->id}/notes", [
        'content' => 'First note',
    ]);

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/notes", [
        'content' => 'Second note',
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('order.notes', fn ($notes) => count($notes) === 2)
    );
});

test('note includes admin name in response', function () {
    $admin = User::factory()->admin()->create(['name' => 'Admin User']);
    $order = Order::factory()->create();

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/notes", [
        'content' => 'Test note',
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('order.notes.0.admin_name', 'Admin User')
    );
});

test('note returns 404 for non-existent order', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/orders/99999/notes', [
        'content' => 'Test note',
    ]);

    $response->assertNotFound();
});
