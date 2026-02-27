<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

it('requires authentication to download invoice', function () {
    $order = Order::factory()->create();

    $this->getJson("/api/orders/{$order->id}/invoice")
        ->assertUnauthorized();
});

it('returns 403 when downloading invoice for another user\'s order', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user, 'sanctum')
        ->getJson("/api/orders/{$order->id}/invoice")
        ->assertForbidden()
        ->assertJsonPath('message', 'Forbidden');
});

it('returns 404 for non-existent order', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->getJson('/api/orders/99999/invoice')
        ->assertNotFound();
});

it('returns HTML invoice for user\'s order', function () {
    $user = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'delivered',
        'payment_status' => 'completed',
        'total_amount' => 250.00,
        'shipping_cost' => 25.00,
        'shipping_address' => [
            'street' => '123 Main St',
            'city' => 'Springfield',
            'state' => 'IL',
            'zip' => '62701',
        ],
    ]);

    $product1 = Product::factory()->create(['name' => 'Product 1', 'price' => 100.00]);
    $product2 = Product::factory()->create(['name' => 'Product 2', 'price' => 50.00]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product1->id,
        'product_name' => 'Product 1',
        'quantity' => 2,
        'unit_price' => 100.00,
        'subtotal' => 200.00,
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product2->id,
        'product_name' => 'Product 2',
        'quantity' => 1,
        'unit_price' => 50.00,
        'subtotal' => 50.00,
    ]);

    $response = $this->actingAs($user, 'sanctum')
        ->get("/api/orders/{$order->id}/invoice");

    $response->assertSuccessful()
        ->assertHeader('Content-Type', 'text/html; charset=UTF-8')
        ->assertSee('FACTURA')
        ->assertSee('Test User')
        ->assertSee('test@example.com')
        ->assertSee('Product 1')
        ->assertSee('Product 2')
        ->assertSee('$250.00')
        ->assertSee('$25.00')
        ->assertSee('123 Main St')
        ->assertSee('Entregado');
});

it('includes tracking information in invoice when available', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'shipped',
        'tracking_number' => 'TRACK123456',
        'shipping_carrier' => 'DHL',
    ]);

    OrderItem::factory()->create(['order_id' => $order->id]);

    $response = $this->actingAs($user, 'sanctum')
        ->get("/api/orders/{$order->id}/invoice");

    $response->assertSuccessful()
        ->assertSee('TRACK123456')
        ->assertSee('DHL')
        ->assertSee('Enviado');
});

it('includes refunded amount in invoice if applicable', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'delivered',
        'total_amount' => 200.00,
        'refunded_amount' => 50.00,
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'subtotal' => 200.00,
    ]);

    $response = $this->actingAs($user, 'sanctum')
        ->get("/api/orders/{$order->id}/invoice");

    $response->assertSuccessful()
        ->assertSee('Reembolsado')
        ->assertSee('$50.00');
});

it('displays correct status badge for different order statuses', function (string $status, string $expectedLabel) {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => $status,
    ]);

    OrderItem::factory()->create(['order_id' => $order->id]);

    $response = $this->actingAs($user, 'sanctum')
        ->get("/api/orders/{$order->id}/invoice");

    $response->assertSuccessful()
        ->assertSee($expectedLabel);
})->with([
    ['pending', 'Pendiente'],
    ['processing', 'Procesando'],
    ['shipped', 'Enviado'],
    ['delivered', 'Entregado'],
    ['cancelled', 'Cancelado'],
    ['payment_pending', 'Pago Pendiente'],
]);

it('displays correct payment status in invoice', function (string $paymentStatus, string $expectedLabel) {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'payment_status' => $paymentStatus,
    ]);

    OrderItem::factory()->create(['order_id' => $order->id]);

    $response = $this->actingAs($user, 'sanctum')
        ->get("/api/orders/{$order->id}/invoice");

    $response->assertSuccessful()
        ->assertSee($expectedLabel);
})->with([
    ['completed', 'Completado'],
    ['pending', 'Pendiente'],
    ['failed', 'Fallido'],
    ['refunded', 'Reembolsado'],
]);
