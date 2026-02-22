<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;

it('requires authentication', function () {
    $response = $this->get('/checkout');

    $response->assertRedirect('/login');
});

it('redirects to cart when cart is empty', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/checkout');

    $response->assertRedirect(route('cart'));
});

it('shows checkout page with cart items', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 100]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 100,
    ]);

    $response = $this->actingAs($user)->get('/checkout');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Checkout')
            ->has('cart.items', 1)
            ->has('cart.totals')
        );
});

it('creates an order from checkout', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 100]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 100,
    ]);

    $response = $this->actingAs($user)->post('/checkout', [
        'name' => 'Juan Perez',
        'address_line_1' => 'Calle 123',
        'address_line_2' => 'Piso 2',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '06600',
        'phone' => '5551234567',
    ]);

    $response->assertRedirect(route('orders'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);

    $this->assertDatabaseHas('order_items', [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);
});

it('validates checkout fields', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    CartItem::factory()->create(['cart_id' => $cart->id]);

    $response = $this->actingAs($user)->post('/checkout', []);

    $response->assertSessionHasErrors(['name', 'address_line_1', 'city', 'state', 'postal_code', 'phone']);
});

it('clears cart after successful checkout', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 50]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'unit_price' => 50,
    ]);

    $this->actingAs($user)->post('/checkout', [
        'name' => 'Juan Perez',
        'address_line_1' => 'Calle 123',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '06600',
        'phone' => '5551234567',
    ]);

    expect($cart->fresh()->status)->toBe('completed');
    expect($cart->items()->count())->toBe(0);
});
