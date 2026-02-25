<?php

use App\Models\Category;
use App\Models\Product;

test('categories endpoint returns active categories', function () {
    Category::factory()->create(['name' => 'Fertilizantes', 'slug' => 'fertilizantes']);
    Category::factory()->create(['name' => 'Semillas', 'slug' => 'semillas']);
    Category::factory()->inactive()->create(['name' => 'Hidden', 'slug' => 'hidden']);

    $response = $this->getJson('/api/categories');

    $response->assertSuccessful();
    $response->assertJsonCount(2, 'data');
    $response->assertJsonFragment(['name' => 'Fertilizantes']);
    $response->assertJsonFragment(['name' => 'Semillas']);
    $response->assertJsonMissing(['name' => 'Hidden']);
});

test('categories endpoint returns categories sorted by name', function () {
    Category::factory()->create(['name' => 'Sustratos', 'slug' => 'sustratos']);
    Category::factory()->create(['name' => 'Fertilizantes', 'slug' => 'fertilizantes']);
    Category::factory()->create(['name' => 'Riego', 'slug' => 'riego']);

    $response = $this->getJson('/api/categories');

    $response->assertSuccessful();
    $names = collect($response->json('data'))->pluck('name')->all();
    expect($names)->toBe(['Fertilizantes', 'Riego', 'Sustratos']);
});

test('categories endpoint returns expected fields', function () {
    Category::factory()->create([
        'name' => 'Fertilizantes',
        'slug' => 'fertilizantes',
        'description' => 'All fertilizers',
    ]);

    $response = $this->getJson('/api/categories');

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            ['id', 'name', 'slug', 'description', 'is_active'],
        ],
    ]);
});

test('categories endpoint returns empty collection when no categories exist', function () {
    $response = $this->getJson('/api/categories');

    $response->assertSuccessful();
    $response->assertJsonCount(0, 'data');
});

test('product belongs to a category', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    expect($product->category->id)->toBe($category->id);
    expect($product->category->name)->toBe($category->name);
});

test('category has many products', function () {
    $category = Category::factory()->create();
    Product::factory(3)->create(['category_id' => $category->id]);

    expect($category->products)->toHaveCount(3);
});

test('products endpoint includes category data', function () {
    $category = Category::factory()->create(['name' => 'Fertilizantes', 'slug' => 'fertilizantes']);
    Product::factory()->create(['category_id' => $category->id]);

    $response = $this->getJson('/api/products');

    $response->assertSuccessful();
    $response->assertJsonFragment(['name' => 'Fertilizantes']);
    $response->assertJsonPath('data.0.category.slug', 'fertilizantes');
});

test('product detail endpoint includes category data', function () {
    $category = Category::factory()->create(['name' => 'Semillas', 'slug' => 'semillas']);
    $product = Product::factory()->create(['category_id' => $category->id]);

    $response = $this->getJson("/api/products/{$product->id}");

    $response->assertSuccessful();
    $response->assertJsonPath('data.category.name', 'Semillas');
    $response->assertJsonPath('data.category.slug', 'semillas');
});
