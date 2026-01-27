<?php

use App\Models\User;

test('authenticated user can view products page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/products');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products')
        ->has('products')
    );
});

test('unauthenticated user is redirected to login', function () {
    $response = $this->get('/products');

    $response->assertRedirect('/login');
});

test('products page returns expected product data structure', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/products');

    $response->assertInertia(fn ($page) => $page
        ->component('Products')
        ->has('products', 6)
        ->has('products.0', fn ($product) => $product
            ->has('id')
            ->has('name')
            ->has('sku')
            ->has('category')
            ->has('price')
            ->has('stock')
            ->has('status')
            ->has('image')
        )
    );
});
