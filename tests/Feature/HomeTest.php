<?php

use App\Models\Product;
use App\Models\User;

it('renders the home page for guests', function () {
    $response = $this->get('/');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('Home'));
});

it('passes featured products to the home page', function () {
    Product::factory(3)->create(['is_active' => true, 'is_featured' => true]);
    Product::factory(2)->create(['is_active' => false]);

    $response = $this->get('/');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('featuredProducts', 3)
        ->has('featuredProducts.0', fn ($product) => $product
            ->has('id')
            ->has('name')
            ->has('category')
            ->has('image_url')
            ->missing('price')
        )
    );
});

it('limits featured products to 4', function () {
    Product::factory(10)->create(['is_active' => true]);

    $response = $this->get('/');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('featuredProducts', 4)
    );
});

it('does not include inactive products', function () {
    Product::factory(2)->create(['is_active' => false]);

    $response = $this->get('/');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('featuredProducts', 0)
    );
});

it('shows home page to authenticated users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('Home'));
});
