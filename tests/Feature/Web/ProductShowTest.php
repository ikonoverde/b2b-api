<?php

use App\Models\PricingTier;
use App\Models\Product;
use App\Models\User;

it('requires authentication', function () {
    $product = Product::factory()->create();

    $response = $this->get("/product/{$product->id}");

    $response->assertRedirect('/login');
});

it('shows product details', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $response = $this->actingAs($user)->get("/product/{$product->id}");

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Product/Show')
            ->has('product', fn ($p) => $p
                ->where('id', $product->id)
                ->where('name', $product->name)
                ->has('category')
                ->has('price')
                ->has('images')
                ->has('pricing_tiers')
                ->etc()
            )
        );
});

it('includes pricing tiers', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    PricingTier::factory(3)->create(['product_id' => $product->id]);

    $response = $this->actingAs($user)->get("/product/{$product->id}");

    $response->assertInertia(fn ($page) => $page
        ->has('product.pricing_tiers', 3)
    );
});

it('returns 404 for non-existent product', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/product/99999');

    $response->assertNotFound();
});
