<?php

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
