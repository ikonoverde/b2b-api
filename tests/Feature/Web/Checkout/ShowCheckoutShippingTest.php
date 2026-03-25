<?php

use App\Models\Address;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;

it('requires authentication', function () {
    $this->get('/checkout/shipping')->assertRedirect('/login');
});

it('redirects to cart when cart is empty', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/checkout/shipping')
        ->assertRedirect(route('cart'));
});

it('redirects to cart when no cart exists', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/checkout/shipping')
        ->assertRedirect(route('cart'));
});

it('shows shipping page with cart items', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 100]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 100,
    ]);

    $this->actingAs($user)->get('/checkout/shipping')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Checkout/Shipping')
            ->has('cart.items', 1)
            ->has('cart.totals')
        );
});

it('includes saved addresses in the response', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 100]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 100,
    ]);

    Address::factory()->count(2)->create(['user_id' => $user->id]);

    $this->actingAs($user)->get('/checkout/shipping')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Checkout/Shipping')
            ->has('addresses', 2)
        );
});

it('returns empty addresses when user has none', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 100]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 100,
    ]);

    $this->actingAs($user)->get('/checkout/shipping')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Checkout/Shipping')
            ->has('addresses', 0)
        );
});

it('returns default address first', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 100]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 100,
    ]);

    Address::factory()->create(['user_id' => $user->id, 'label' => 'Oficina', 'is_default' => false]);
    Address::factory()->create(['user_id' => $user->id, 'label' => 'Casa', 'is_default' => true]);

    $this->actingAs($user)->get('/checkout/shipping')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Checkout/Shipping')
            ->has('addresses', 2)
            ->where('addresses.0.is_default', true)
            ->where('addresses.0.label', 'Casa')
        );
});
