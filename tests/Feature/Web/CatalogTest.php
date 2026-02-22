<?php

use App\Models\Product;

it('shows catalog page to guests', function () {
    $response = $this->get('/catalog');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('Catalog'));
});

it('shows catalog page to authenticated users', function () {
    $user = \App\Models\User::factory()->create();

    $response = $this->actingAs($user)->get('/catalog');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('Catalog'));
});

it('lists active products', function () {
    Product::factory(3)->create(['is_active' => true]);
    Product::factory(2)->create(['is_active' => false]);

    $response = $this->get('/catalog');

    $response->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->has('products', 3)
    );
});

it('includes expected product fields', function () {
    Product::factory()->create(['is_active' => true]);

    $response = $this->get('/catalog');

    $response->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->has('products.0', fn ($product) => $product
            ->has('id')
            ->has('name')
            ->has('sku')
            ->has('category')
            ->has('price')
            ->has('image')
            ->has('is_featured')
        )
    );
});
