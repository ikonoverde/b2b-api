<?php

use App\Models\Product;

test('products endpoint returns all products', function () {
    Product::factory()->create([
        'name' => 'Product 1',
        'is_featured' => true,
        'is_active' => true,
    ]);
    Product::factory()->create([
        'name' => 'Product 2',
        'is_featured' => false,
        'is_active' => true,
    ]);
    Product::factory()->create([
        'name' => 'Product 3',
        'is_featured' => true,
        'is_active' => false,
    ]);

    $response = $this->getJson('/api/products');

    $response->assertSuccessful();
    $response->assertJsonCount(3, 'data');
});

test('products endpoint returns empty array when no products', function () {
    $response = $this->getJson('/api/products');

    $response->assertSuccessful();
    $response->assertJsonCount(0, 'data');
});

test('products endpoint returns correct product structure', function () {
    Product::factory()->create([
        'name' => 'Test Product',
        'sku' => 'TEST-001',
        'category' => 'Fertilizantes',
        'description' => 'A test description',
        'price' => 29.99,
        'stock' => 100,
        'is_featured' => true,
        'is_active' => true,
    ]);

    $response = $this->getJson('/api/products');

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            '*' => [
                'id',
                'name',
                'sku',
                'category',
                'description',
                'price',
                'stock',
                'is_active',
                'is_featured',
                'image',
            ],
        ],
    ]);
});

test('products endpoint is publicly accessible', function () {
    $response = $this->getJson('/api/products');

    $response->assertSuccessful();
});

test('products endpoint includes inactive products', function () {
    Product::factory()->create(['is_active' => false]);
    Product::factory()->create(['is_active' => true]);

    $response = $this->getJson('/api/products');

    $response->assertSuccessful();
    $response->assertJsonCount(2, 'data');
});

test('products endpoint includes non-featured products', function () {
    Product::factory()->create(['is_featured' => false]);
    Product::factory()->create(['is_featured' => true]);

    $response = $this->getJson('/api/products');

    $response->assertSuccessful();
    $response->assertJsonCount(2, 'data');
});
