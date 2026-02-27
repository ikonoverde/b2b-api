<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

it('requires authentication', function () {
    $order = Order::factory()->create();

    $this->postJson("/api/orders/{$order->id}/reorder")->assertUnauthorized();
});

it('returns 403 for another user\'s order', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user, 'sanctum')
        ->postJson("/api/orders/{$order->id}/reorder")
        ->assertForbidden()
        ->assertJsonPath('message', 'Forbidden');
});

it('returns 404 for non-existent order', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/orders/99999/reorder')
        ->assertNotFound();
});

it('reorders all items from a previous order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $product1 = Product::factory()->create(['price' => 50.00, 'stock' => 20, 'is_active' => true]);
    $product2 = Product::factory()->create(['price' => 30.00, 'stock' => 10, 'is_active' => true]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product1->id,
        'product_name' => $product1->name,
        'quantity' => 2,
        'unit_price' => 50.00,
        'subtotal' => 100.00,
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product2->id,
        'product_name' => $product2->name,
        'quantity' => 3,
        'unit_price' => 30.00,
        'subtotal' => 90.00,
    ]);

    $response = $this->actingAs($user, 'sanctum')
        ->postJson("/api/orders/{$order->id}/reorder");

    $response->assertSuccessful()
        ->assertJsonCount(2, 'data.added')
        ->assertJsonCount(0, 'data.unavailable')
        ->assertJsonCount(0, 'data.price_changes')
        ->assertJsonStructure([
            'data' => [
                'added' => [['product_id', 'product_name', 'quantity', 'unit_price']],
                'unavailable',
                'price_changes',
            ],
        ]);

    $this->assertDatabaseHas('carts', ['user_id' => $user->id, 'status' => 'active']);
    $cart = Cart::where('user_id', $user->id)->where('status', 'active')->first();
    $this->assertDatabaseHas('cart_items', ['cart_id' => $cart->id, 'product_id' => $product1->id, 'quantity' => 2]);
    $this->assertDatabaseHas('cart_items', ['cart_id' => $cart->id, 'product_id' => $product2->id, 'quantity' => 3]);
});

it('reports unavailable items when product is out of stock', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $available = Product::factory()->create(['price' => 25.00, 'stock' => 10, 'is_active' => true]);
    $outOfStock = Product::factory()->create(['price' => 40.00, 'stock' => 0, 'is_active' => true]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $available->id,
        'product_name' => $available->name,
        'quantity' => 2,
        'unit_price' => 25.00,
        'subtotal' => 50.00,
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $outOfStock->id,
        'product_name' => $outOfStock->name,
        'quantity' => 3,
        'unit_price' => 40.00,
        'subtotal' => 120.00,
    ]);

    $response = $this->actingAs($user, 'sanctum')
        ->postJson("/api/orders/{$order->id}/reorder");

    $response->assertSuccessful()
        ->assertJsonCount(1, 'data.added')
        ->assertJsonCount(1, 'data.unavailable')
        ->assertJsonPath('data.unavailable.0.product_id', $outOfStock->id)
        ->assertJsonPath('data.unavailable.0.reason', 'out_of_stock');
});

it('detects price changes and still adds items to cart', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 60.00, 'stock' => 10, 'is_active' => true]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'unit_price' => 45.00,
        'subtotal' => 90.00,
    ]);

    $response = $this->actingAs($user, 'sanctum')
        ->postJson("/api/orders/{$order->id}/reorder");

    $response->assertSuccessful()
        ->assertJsonCount(1, 'data.added')
        ->assertJsonCount(1, 'data.price_changes');

    $data = $response->json('data');
    expect((float) $data['price_changes'][0]['original_price'])->toBe(45.00)
        ->and((float) $data['price_changes'][0]['current_price'])->toBe(60.00)
        ->and((float) $data['added'][0]['unit_price'])->toBe(60.00);

    $cart = Cart::where('user_id', $user->id)->where('status', 'active')->first();
    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'unit_price' => 60.00,
    ]);
});

it('reports inactive products as unavailable', function () {
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

    $response = $this->actingAs($user, 'sanctum')
        ->postJson("/api/orders/{$order->id}/reorder");

    $response->assertSuccessful()
        ->assertJsonCount(0, 'data.added')
        ->assertJsonCount(1, 'data.unavailable')
        ->assertJsonPath('data.unavailable.0.product_id', $inactive->id)
        ->assertJsonPath('data.unavailable.0.reason', 'product_unavailable');
});

it('updates existing cart items via updateOrCreate', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 50.00, 'stock' => 20, 'is_active' => true]);

    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 45.00,
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 5,
        'unit_price' => 50.00,
        'subtotal' => 250.00,
    ]);

    $response = $this->actingAs($user, 'sanctum')
        ->postJson("/api/orders/{$order->id}/reorder");

    $response->assertSuccessful()
        ->assertJsonCount(1, 'data.added');

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 5,
        'unit_price' => 50.00,
    ]);

    expect(CartItem::where('cart_id', $cart->id)->where('product_id', $product->id)->count())->toBe(1);
});

it('handles an order with no items', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user, 'sanctum')
        ->postJson("/api/orders/{$order->id}/reorder");

    $response->assertSuccessful()
        ->assertJsonCount(0, 'data.added')
        ->assertJsonCount(0, 'data.unavailable')
        ->assertJsonCount(0, 'data.price_changes');
});

it('reports insufficient stock when quantity exceeds available stock', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 30.00, 'stock' => 2, 'is_active' => true]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 5,
        'unit_price' => 30.00,
        'subtotal' => 150.00,
    ]);

    $response = $this->actingAs($user, 'sanctum')
        ->postJson("/api/orders/{$order->id}/reorder");

    $response->assertSuccessful()
        ->assertJsonCount(0, 'data.added')
        ->assertJsonCount(1, 'data.unavailable')
        ->assertJsonPath('data.unavailable.0.product_id', $product->id)
        ->assertJsonPath('data.unavailable.0.reason', 'out_of_stock');
});
