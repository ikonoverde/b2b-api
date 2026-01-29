<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;

// ============================================================================
// GET CART TESTS
// ============================================================================

test('authenticated user gets empty cart when no cart exists', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/cart');

    $response->assertSuccessful();
    $response->assertJsonPath('data.status', 'active');
    $response->assertJsonPath('data.items', []);
    $response->assertJsonPath('data.totals.subtotal', 0);
    $response->assertJsonPath('data.totals.item_count', 0);
    $response->assertJsonPath('data.totals.total_quantity', 0);
});

test('authenticated user gets cart with items', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 50.00, 'stock' => 100]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 3,
        'unit_price' => 50.00,
    ]);

    $response = $this->actingAs($user)->getJson('/api/cart');

    $response->assertSuccessful();
    $response->assertJsonPath('data.status', 'active');
    $response->assertJsonCount(1, 'data.items');
    $response->assertJsonPath('data.items.0.quantity', 3);
    $response->assertJsonPath('data.items.0.unit_price', 50);
    $response->assertJsonPath('data.items.0.subtotal', 150);
    $response->assertJsonPath('data.totals.subtotal', 150);
    $response->assertJsonPath('data.totals.item_count', 1);
    $response->assertJsonPath('data.totals.total_quantity', 3);
});

test('unauthenticated user cannot get cart', function () {
    $response = $this->getJson('/api/cart');

    $response->assertUnauthorized();
});

// ============================================================================
// ADD ITEM TO CART TESTS
// ============================================================================

test('authenticated user can add item to cart creating new cart', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 45.00, 'stock' => 100]);

    $response = $this->actingAs($user)->postJson('/api/cart/items', [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response->assertCreated();
    $response->assertJsonPath('data.status', 'active');
    $response->assertJsonCount(1, 'data.items');
    $response->assertJsonPath('data.items.0.product_id', $product->id);
    $response->assertJsonPath('data.items.0.quantity', 2);
    $response->assertJsonPath('data.items.0.unit_price', 45);
    $response->assertJsonPath('data.items.0.subtotal', 90);
    $response->assertJsonPath('data.totals.subtotal', 90);

    $this->assertDatabaseHas('carts', [
        'user_id' => $user->id,
        'status' => 'active',
    ]);
    $this->assertDatabaseHas('cart_items', [
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 45.00,
    ]);
});

test('adding same product updates existing cart item quantity', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 45.00, 'stock' => 100]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 45.00,
    ]);

    $response = $this->actingAs($user)->postJson('/api/cart/items', [
        'product_id' => $product->id,
        'quantity' => 3,
    ]);

    $response->assertCreated();
    $response->assertJsonCount(1, 'data.items');
    $response->assertJsonPath('data.items.0.quantity', 3);
    $response->assertJsonPath('data.items.0.subtotal', 135);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 3,
    ]);
    $this->assertDatabaseCount('cart_items', 1);
});

test('adding item requires product_id field', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/cart/items', [
        'quantity' => 2,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['product_id']);
});

test('adding item requires quantity field', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/cart/items', [
        'product_id' => $product->id,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['quantity']);
});

test('adding item validates product exists', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/cart/items', [
        'product_id' => 99999,
        'quantity' => 2,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['product_id']);
});

test('adding item validates quantity is at least 1', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/cart/items', [
        'product_id' => $product->id,
        'quantity' => 0,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['quantity']);
});

test('adding item validates stock availability', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['stock' => 5, 'price' => 20.00]);

    $response = $this->actingAs($user)->postJson('/api/cart/items', [
        'product_id' => $product->id,
        'quantity' => 10,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonPath('message', 'Not enough stock available');
    $response->assertJsonPath('errors.quantity.0', 'Only 5 items available in stock');
});

test('unauthenticated user cannot add item to cart', function () {
    $product = Product::factory()->create();

    $response = $this->postJson('/api/cart/items', [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response->assertUnauthorized();
});

// ============================================================================
// UPDATE CART ITEM TESTS
// ============================================================================

test('authenticated user can update cart item quantity', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 50.00, 'stock' => 100]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    $item = CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 50.00,
    ]);

    $response = $this->actingAs($user)->putJson("/api/cart/items/{$item->id}", [
        'quantity' => 5,
    ]);

    $response->assertSuccessful();
    $response->assertJsonPath('data.items.0.quantity', 5);
    $response->assertJsonPath('data.items.0.subtotal', 250);
    $response->assertJsonPath('data.totals.subtotal', 250);

    $this->assertDatabaseHas('cart_items', [
        'id' => $item->id,
        'quantity' => 5,
    ]);
});

test('updating cart item requires quantity field', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['stock' => 100]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    $item = CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response = $this->actingAs($user)->putJson("/api/cart/items/{$item->id}", []);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['quantity']);
});

test('updating cart item validates stock availability', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['stock' => 5, 'price' => 20.00]);
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    $item = CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response = $this->actingAs($user)->putJson("/api/cart/items/{$item->id}", [
        'quantity' => 10,
    ]);

    $response->assertUnprocessable();
    $response->assertJsonPath('message', 'Not enough stock available');
    $response->assertJsonPath('errors.quantity.0', 'Only 5 items available in stock');
});

test('user cannot update other users cart item', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $product = Product::factory()->create(['stock' => 100]);
    $otherCart = Cart::factory()->create(['user_id' => $otherUser->id, 'status' => 'active']);
    $item = CartItem::factory()->create([
        'cart_id' => $otherCart->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response = $this->actingAs($user)->putJson("/api/cart/items/{$item->id}", [
        'quantity' => 5,
    ]);

    $response->assertForbidden();
    $response->assertJsonPath('message', 'This item does not belong to your cart');
});

test('unauthenticated user cannot update cart item', function () {
    $response = $this->putJson('/api/cart/items/1', [
        'quantity' => 5,
    ]);

    $response->assertUnauthorized();
});

// ============================================================================
// REMOVE CART ITEM TESTS
// ============================================================================

test('authenticated user can remove cart item', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    $item = CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response = $this->actingAs($user)->deleteJson("/api/cart/items/{$item->id}");

    $response->assertSuccessful();
    $response->assertJsonCount(0, 'data.items');
    $response->assertJsonPath('data.totals.item_count', 0);

    $this->assertDatabaseMissing('cart_items', [
        'id' => $item->id,
    ]);
});

test('user cannot remove other users cart item', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $product = Product::factory()->create();
    $otherCart = Cart::factory()->create(['user_id' => $otherUser->id, 'status' => 'active']);
    $item = CartItem::factory()->create([
        'cart_id' => $otherCart->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response = $this->actingAs($user)->deleteJson("/api/cart/items/{$item->id}");

    $response->assertForbidden();
    $response->assertJsonPath('message', 'This item does not belong to your cart');

    $this->assertDatabaseHas('cart_items', [
        'id' => $item->id,
    ]);
});

test('unauthenticated user cannot remove cart item', function () {
    $response = $this->deleteJson('/api/cart/items/1');

    $response->assertUnauthorized();
});

// ============================================================================
// CLEAR CART TESTS
// ============================================================================

test('authenticated user can clear cart', function () {
    $user = User::factory()->create();
    $product1 = Product::factory()->create();
    $product2 = Product::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product1->id,
        'quantity' => 2,
    ]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product2->id,
        'quantity' => 3,
    ]);

    $response = $this->actingAs($user)->deleteJson('/api/cart');

    $response->assertSuccessful();
    $response->assertJsonCount(0, 'data.items');
    $response->assertJsonPath('data.totals.item_count', 0);
    $response->assertJsonPath('data.totals.total_quantity', 0);

    $this->assertDatabaseCount('cart_items', 0);
});

test('clearing cart preserves cart record', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'active']);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $this->actingAs($user)->deleteJson('/api/cart');

    $this->assertDatabaseHas('carts', [
        'id' => $cart->id,
        'user_id' => $user->id,
        'status' => 'active',
    ]);
});

test('clearing empty cart returns empty response', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->deleteJson('/api/cart');

    $response->assertSuccessful();
    $response->assertJsonCount(0, 'data.items');
});

test('unauthenticated user cannot clear cart', function () {
    $response = $this->deleteJson('/api/cart');

    $response->assertUnauthorized();
});
