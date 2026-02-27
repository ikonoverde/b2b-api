<?php

use App\Models\Order;
use App\Models\User;
use Stripe\StripeClient;

beforeEach(function () {
    $this->mockStripeClient = Mockery::mock(StripeClient::class);
    $this->app->bind(StripeClient::class, fn () => $this->mockStripeClient);
});

test('admin can process full refund', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create([
        'total_amount' => 100.00,
        'refunded_amount' => 0,
    ]);

    $mockRefunds = Mockery::mock();
    $mockRefunds->shouldReceive('create')->once()->with([
        'payment_intent' => $order->payment_intent_id,
        'amount' => 10000,
        'reason' => 'requested_by_customer',
    ])->andReturn((object) ['id' => 'ref_123']);
    $this->mockStripeClient->refunds = $mockRefunds;

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/refund", [
        'amount' => 100.00,
        'reason' => 'Producto defectuoso',
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('flash.success', fn ($msg) => str_contains($msg, 'total'))
    );

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'refunded_amount' => 100.00,
        'payment_status' => 'refunded',
    ]);
});

test('admin can process partial refund', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create([
        'total_amount' => 200.00,
        'refunded_amount' => 0,
    ]);

    $mockRefunds = Mockery::mock();
    $mockRefunds->shouldReceive('create')->once()->andReturn((object) ['id' => 'ref_123']);
    $this->mockStripeClient->refunds = $mockRefunds;

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/refund", [
        'amount' => 50.00,
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('flash.success', fn ($msg) => str_contains($msg, 'parcial'))
    );

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'refunded_amount' => 50.00,
        'payment_status' => 'completed',
    ]);
});

test('admin can process multiple partial refunds', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create([
        'total_amount' => 100.00,
        'refunded_amount' => 30.00,
    ]);

    $mockRefunds = Mockery::mock();
    $mockRefunds->shouldReceive('create')->once()->andReturn((object) ['id' => 'ref_123']);
    $this->mockStripeClient->refunds = $mockRefunds;

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/refund", [
        'amount' => 70.00,
    ]);

    $response->assertSuccessful();

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'refunded_amount' => 100.00,
        'payment_status' => 'refunded',
    ]);
});

test('refund fails when amount exceeds remaining balance', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create([
        'total_amount' => 100.00,
        'refunded_amount' => 80.00,
    ]);

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/refund", [
        'amount' => 30.00,
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('flash.error', fn ($msg) => str_contains($msg, 'excede'))
    );
});

test('refund fails without payment_intent_id', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create([
        'payment_status' => 'completed',
        'payment_intent_id' => null,
    ]);

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/refund", [
        'amount' => 10.00,
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('flash.error', fn ($msg) => str_contains($msg, 'pago asociado'))
    );
});

test('refund fails when payment_status is not completed', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create([
        'payment_status' => 'pending',
        'payment_intent_id' => 'pi_test123',
    ]);

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/refund", [
        'amount' => 10.00,
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('flash.error', fn ($msg) => str_contains($msg, 'pago completado'))
    );
});

test('refund handles stripe error gracefully', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create([
        'total_amount' => 100.00,
        'refunded_amount' => 0,
    ]);

    $mockRefunds = Mockery::mock();
    $mockRefunds->shouldReceive('create')->once()->andThrow(new \Exception('Card declined'));
    $this->mockStripeClient->refunds = $mockRefunds;

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/refund", [
        'amount' => 100.00,
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('flash.error', fn ($msg) => str_contains($msg, 'Stripe'))
    );

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'refunded_amount' => 0,
    ]);
});

test('refund creates status history record', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create([
        'total_amount' => 100.00,
        'refunded_amount' => 0,
    ]);

    $mockRefunds = Mockery::mock();
    $mockRefunds->shouldReceive('create')->once()->andReturn((object) ['id' => 'ref_123']);
    $this->mockStripeClient->refunds = $mockRefunds;

    $this->actingAs($admin)->post("/admin/orders/{$order->id}/refund", [
        'amount' => 50.00,
        'reason' => 'Producto dañado',
    ]);

    $this->assertDatabaseHas('order_status_histories', [
        'order_id' => $order->id,
        'admin_id' => $admin->id,
    ]);
});

test('customer cannot process refund', function () {
    $customer = User::factory()->create();
    $order = Order::factory()->processing()->create();

    $response = $this->actingAs($customer)->post("/admin/orders/{$order->id}/refund", [
        'amount' => 10.00,
    ]);

    $response->assertForbidden();
});

test('refund requires amount field', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create();

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/refund", []);

    $response->assertSessionHasErrors(['amount']);
});

test('refund amount must be at least 0.01', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create();

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/refund", [
        'amount' => 0,
    ]);

    $response->assertSessionHasErrors(['amount']);
});

test('refund amount must be numeric', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create();

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/refund", [
        'amount' => 'not-a-number',
    ]);

    $response->assertSessionHasErrors(['amount']);
});

test('refund reason max length is validated', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->processing()->create();

    $response = $this->actingAs($admin)->post("/admin/orders/{$order->id}/refund", [
        'amount' => 10.00,
        'reason' => str_repeat('A', 501),
    ]);

    $response->assertSessionHasErrors(['reason']);
});

test('super_admin can process refund', function () {
    $superAdmin = User::factory()->superAdmin()->create();
    $order = Order::factory()->processing()->create([
        'total_amount' => 100.00,
        'refunded_amount' => 0,
    ]);

    $mockRefunds = Mockery::mock();
    $mockRefunds->shouldReceive('create')->once()->andReturn((object) ['id' => 'ref_123']);
    $this->mockStripeClient->refunds = $mockRefunds;

    $response = $this->actingAs($superAdmin)->post("/admin/orders/{$order->id}/refund", [
        'amount' => 50.00,
    ]);

    $response->assertSuccessful();
});
