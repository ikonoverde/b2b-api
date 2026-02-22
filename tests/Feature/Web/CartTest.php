<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;

it('requires authentication', function () {
    $response = $this->get('/cart');

    $response->assertRedirect('/login');
});

it('shows empty cart', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/cart');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Cart')
            ->has('cart.items', 0)
        );
});

it('adds item to cart', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 50.00]);

    $response = $this->actingAs($user)->post('/cart/items', [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('cart_items', [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);
});

it('increments quantity when adding existing product', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 50.00]);
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 50.00,
    ]);

    $this->actingAs($user)->post('/cart/items', [
        'product_id' => $product->id,
        'quantity' => 3,
    ]);

    $this->assertDatabaseHas('cart_items', [
        'product_id' => $product->id,
        'quantity' => 4,
    ]);
});

it('updates cart item quantity', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $item = CartItem::factory()->create([
        'cart_id' => $cart->id,
        'quantity' => 2,
    ]);

    $response = $this->actingAs($user)->post("/cart/items/{$item->id}", [
        'quantity' => 5,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('cart_items', [
        'id' => $item->id,
        'quantity' => 5,
    ]);
});

it('removes cart item', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $item = CartItem::factory()->create(['cart_id' => $cart->id]);

    $response = $this->actingAs($user)->delete("/cart/items/{$item->id}");

    $response->assertRedirect();
    $this->assertDatabaseMissing('cart_items', ['id' => $item->id]);
});

it('clears all cart items', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    CartItem::factory(3)->create(['cart_id' => $cart->id]);

    $response = $this->actingAs($user)->delete('/cart');

    $response->assertRedirect();
    expect($cart->items()->count())->toBe(0);
});

it('returns existing cart when cart has non-active status', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id, 'status' => 'completed']);

    $response = $this->actingAs($user)->get('/cart');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('Cart'));
});

it('prevents updating another user cart item', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherCart = Cart::factory()->create(['user_id' => $otherUser->id]);
    $item = CartItem::factory()->create(['cart_id' => $otherCart->id]);

    $response = $this->actingAs($user)->post("/cart/items/{$item->id}", [
        'quantity' => 5,
    ]);

    $response->assertForbidden();
});
