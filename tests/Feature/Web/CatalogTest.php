<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;

it('shows catalog page to guests', function () {
    $response = $this->get('/catalog');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('Catalog'));
});

it('shows catalog page to authenticated users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/catalog');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('Catalog'));
});

it('lists active products with pagination', function () {
    Product::factory(3)->create(['is_active' => true]);
    Product::factory(2)->create(['is_active' => false]);

    $response = $this->get('/catalog');

    $response->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->has('products.data', 3)
    );
});

it('paginates products', function () {
    Product::factory(25)->create(['is_active' => true]);

    $response = $this->get('/catalog');

    $response->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->has('products.data', 20)
    );

    $responsePage2 = $this->get('/catalog?page=2');

    $responsePage2->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->has('products.data', 5)
    );
});

it('sorts products by price ascending', function () {
    Product::factory()->create(['is_active' => true, 'price' => 30]);
    Product::factory()->create(['is_active' => true, 'price' => 10]);
    Product::factory()->create(['is_active' => true, 'price' => 20]);

    $response = $this->get('/catalog?sort=price_asc');

    $response->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->has('products.data', 3)
        ->where('selectedSort', 'price_asc')
        ->where('products.data.0.price', 10)
        ->where('products.data.1.price', 20)
        ->where('products.data.2.price', 30)
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
        ->where('products.data.0.name', 'Charlie')
        ->where('products.data.1.name', 'Bravo')
        ->where('products.data.2.name', 'Alpha')
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
    $category = Category::factory()->create(['is_active' => true]);
    Product::factory()->create(['is_active' => true, 'category_id' => $category->id, 'price' => 50]);
    Product::factory()->create(['is_active' => true, 'category_id' => $category->id, 'price' => 10]);
    Product::factory()->create(['is_active' => true, 'price' => 5]);

    $response = $this->get("/catalog?category_id={$category->id}&sort=price_asc");

    $response->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->has('products.data', 2)
        ->where('selectedSort', 'price_asc')
        ->where('selectedCategoryId', $category->id)
        ->where('products.data.0.price', 10)
        ->where('products.data.1.price', 50)
    );
});

it('includes expected product fields', function () {
    Product::factory()->create(['is_active' => true]);

    $response = $this->get('/catalog');

    $response->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->has('products.data.0', fn ($product) => $product
            ->has('id')
            ->has('slug')
            ->has('name')
            ->has('sku')
            ->has('category')
            ->has('category_id')
            ->has('price')
            ->has('stock')
            ->has('image')
            ->has('is_featured')
        )
    );
});

it('searches products by name', function () {
    Product::factory()->create(['is_active' => true, 'name' => 'Organic Coffee Beans']);
    Product::factory()->create(['is_active' => true, 'name' => 'Green Tea']);
    Product::factory()->create(['is_active' => true, 'name' => 'Coffee Mug']);

    $response = $this->get('/catalog?search=coffee');

    $response->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->has('products.data', 2)
        ->where('selectedSearch', 'coffee')
    );
});

it('combines search with category and sort filters', function () {
    $category = Category::factory()->create(['is_active' => true]);
    Product::factory()->create(['is_active' => true, 'category_id' => $category->id, 'name' => 'Alpha Coffee', 'price' => 30]);
    Product::factory()->create(['is_active' => true, 'category_id' => $category->id, 'name' => 'Beta Coffee', 'price' => 10]);
    Product::factory()->create(['is_active' => true, 'name' => 'Gamma Coffee', 'price' => 5]);

    $response = $this->get("/catalog?category_id={$category->id}&search=coffee&sort=price_asc");

    $response->assertInertia(fn ($page) => $page
        ->component('Catalog')
        ->has('products.data', 2)
        ->where('selectedSearch', 'coffee')
        ->where('selectedSort', 'price_asc')
        ->where('selectedCategoryId', $category->id)
        ->where('products.data.0.price', 10)
        ->where('products.data.1.price', 30)
    );
});
