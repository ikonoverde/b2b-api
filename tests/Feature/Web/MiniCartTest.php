<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;

it('returns null miniCart for unauthenticated users', function () {
    $response = $this->get('/catalog');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('miniCart', null)
        );
});

it('returns empty miniCart when user has no cart', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/catalog');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('miniCart', fn ($miniCart) => $miniCart
                ->where('items', [])
                ->where('subtotal', 0)
                ->where('totalCount', 0)
            )
        );
});

it('returns miniCart with items', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 25.00]);

    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 25.00,
    ]);

    $response = $this->actingAs($user)->get('/catalog');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('miniCart', fn ($miniCart) => $miniCart
                ->has('items', 1)
                ->where('subtotal', 50)
                ->where('totalCount', 1)
                ->has('items.0', fn ($item) => $item
                    ->where('name', $product->name)
                    ->where('price', 25)
                    ->where('quantity', 2)
                    ->where('subtotal', 50)
                    ->etc()
                )
            )
        );
});

it('limits miniCart to 3 most recent items', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);

    // Create 5 items with staggered creation times
    for ($i = 1; $i <= 5; $i++) {
        $product = Product::factory()->create(['price' => $i * 10.00]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'unit_price' => $i * 10.00,
            'created_at' => now()->subMinutes(6 - $i),
        ]);
    }

    $response = $this->actingAs($user)->get('/catalog');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('miniCart', fn ($miniCart) => $miniCart
                ->has('items', 3)
                ->where('subtotal', 150) // Sum of all 5 items: 10+20+30+40+50
                ->where('totalCount', 5)
            )
        );
});

it('does not include items from completed carts', function () {
    $user = User::factory()->create();
    Cart::factory()->create([
        'user_id' => $user->id,
        'status' => 'completed',
    ]);

    $response = $this->actingAs($user)->get('/catalog');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('miniCart', fn ($miniCart) => $miniCart
                ->where('items', [])
                ->where('subtotal', 0)
                ->where('totalCount', 0)
            )
        );
});
