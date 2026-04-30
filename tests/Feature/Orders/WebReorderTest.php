<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

it('redirects to cart with success flash when all items are added', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 50.00, 'stock' => 10, 'is_active' => true]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'unit_price' => 50.00,
        'subtotal' => 100.00,
    ]);

    $response = $this->actingAs($user)
        ->post("/account/orders/{$order->id}/reorder");

    $response->assertRedirect(route('cart'));
    $response->assertSessionHas('success');
    $response->assertSessionMissing('reorder_warnings');
});

it('flashes reorder_warnings when some items are unavailable', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $available = Product::factory()->create(['price' => 25.00, 'stock' => 10, 'is_active' => true]);
    $outOfStock = Product::factory()->create(['price' => 40.00, 'stock' => 0, 'is_active' => true]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $available->id,
        'product_name' => $available->name,
        'quantity' => 1,
        'unit_price' => 25.00,
        'subtotal' => 25.00,
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $outOfStock->id,
        'product_name' => $outOfStock->name,
        'quantity' => 1,
        'unit_price' => 40.00,
        'subtotal' => 40.00,
    ]);

    $response = $this->actingAs($user)
        ->post("/account/orders/{$order->id}/reorder");

    $response->assertRedirect(route('cart'));
    $response->assertSessionHas('success');
    $response->assertSessionHas('reorder_warnings');

    $warnings = session('reorder_warnings');
    expect($warnings['unavailable'])->toHaveCount(1)
        ->and($warnings['unavailable'][0]['product_id'])->toBe($outOfStock->id)
        ->and($warnings['unavailable'][0]['reason'])->toBe('out_of_stock');
});

it('flashes reorder_warnings when price changes are detected', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 60.00, 'stock' => 10, 'is_active' => true]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 1,
        'unit_price' => 45.00,
        'subtotal' => 45.00,
    ]);

    $response = $this->actingAs($user)
        ->post("/account/orders/{$order->id}/reorder");

    $response->assertRedirect(route('cart'));
    $response->assertSessionHas('reorder_warnings');

    $warnings = session('reorder_warnings');
    expect($warnings['price_changes'])->toHaveCount(1)
        ->and((float) $warnings['price_changes'][0]['original_price'])->toBe(45.00)
        ->and((float) $warnings['price_changes'][0]['current_price'])->toBe(60.00);
});

it('does not flash reorder_warnings when all items added without issues', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 50.00, 'stock' => 10, 'is_active' => true]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'unit_price' => 50.00,
        'subtotal' => 100.00,
    ]);

    $response = $this->actingAs($user)
        ->post("/account/orders/{$order->id}/reorder");

    $response->assertSessionMissing('reorder_warnings');
});

it('returns back with error when no items can be added', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $inactive = Product::factory()->create(['price' => 30.00, 'stock' => 10, 'is_active' => false]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $inactive->id,
        'product_name' => $inactive->name,
        'quantity' => 1,
        'unit_price' => 30.00,
        'subtotal' => 30.00,
    ]);

    $response = $this->actingAs($user)
        ->post("/account/orders/{$order->id}/reorder");

    $response->assertSessionHas('error');
    $response->assertSessionMissing('success');
    $response->assertSessionMissing('reorder_warnings');
});

it('requires authentication to reorder via web', function () {
    $order = Order::factory()->create();

    $this->post("/account/orders/{$order->id}/reorder")->assertRedirect('/login');
});

it('returns 403 for another user\'s order via web', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)
        ->post("/account/orders/{$order->id}/reorder")
        ->assertForbidden();
});
