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

it('sorts products by price ascending', function () {
    Product::factory()->create(['is_active' => true, 'price' => 30]);
    Product::factory()->create(['is_active' => true, 'price' => 10]);
    Product::factory()->create(['is_active' => true, 'price' => 20]);

    $response = $this->get('/catalog?sort=price_asc');

    $response->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->has('products', 3)
        ->where('selectedSort', 'price_asc')
        ->where('products.0.price', 10)
        ->where('products.1.price', 20)
        ->where('products.2.price', 30)
    );
});

it('sorts products by name descending', function () {
    Product::factory()->create(['is_active' => true, 'name' => 'Alpha']);
    Product::factory()->create(['is_active' => true, 'name' => 'Charlie']);
    Product::factory()->create(['is_active' => true, 'name' => 'Bravo']);

    $response = $this->get('/catalog?sort=name_desc');

    $response->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->where('selectedSort', 'name_desc')
        ->where('products.0.name', 'Charlie')
        ->where('products.1.name', 'Bravo')
        ->where('products.2.name', 'Alpha')
    );
});

it('ignores invalid sort parameter', function () {
    Product::factory()->create(['is_active' => true]);

    $response = $this->get('/catalog?sort=invalid');

    $response->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->where('selectedSort', null)
    );
});

it('preserves sort and category filters together', function () {
    $category = \App\Models\Category::factory()->create(['is_active' => true]);
    Product::factory()->create(['is_active' => true, 'category_id' => $category->id, 'price' => 50]);
    Product::factory()->create(['is_active' => true, 'category_id' => $category->id, 'price' => 10]);
    Product::factory()->create(['is_active' => true, 'price' => 5]);

    $response = $this->get("/catalog?category_id={$category->id}&sort=price_asc");

    $response->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->has('products', 2)
        ->where('selectedSort', 'price_asc')
        ->where('selectedCategoryId', $category->id)
        ->where('products.0.price', 10)
        ->where('products.1.price', 50)
    );
});

it('includes expected product fields', function () {
    Product::factory()->create(['is_active' => true]);

    $response = $this->get('/catalog');

    $response->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->has('products.0', fn ($product) => $product
            ->has('id')
            ->has('slug')
            ->has('name')
            ->has('sku')
            ->has('category')
            ->has('category_id')
            ->has('price')
            ->has('image')
            ->has('is_featured')
        )
    );
});
