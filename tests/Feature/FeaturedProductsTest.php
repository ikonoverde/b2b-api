<?php

use App\Models\Product;

test('featured products endpoint returns only featured and active products', function () {
    Product::factory()->create([
        'name' => 'Featured Active',
        'is_featured' => true,
        'is_active' => true,
    ]);
    Product::factory()->create([
        'name' => 'Featured Inactive',
        'is_featured' => true,
        'is_active' => false,
    ]);
    Product::factory()->create([
        'name' => 'Not Featured Active',
        'is_featured' => false,
        'is_active' => true,
    ]);

    $response = $this->getJson('/api/products/featured');

    $response->assertSuccessful();
    $response->assertJsonCount(1, 'data');
    $response->assertJsonPath('data.0.name', 'Featured Active');
});

test('featured products endpoint returns empty array when no featured products', function () {
    Product::factory()->create([
        'is_featured' => false,
        'is_active' => true,
    ]);

    $response = $this->getJson('/api/products/featured');

    $response->assertSuccessful();
    $response->assertJsonCount(0, 'data');
});

test('featured products endpoint returns correct product structure', function () {
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

    $response = $this->getJson('/api/products/featured');

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

test('featured products endpoint is publicly accessible', function () {
    $response = $this->getJson('/api/products/featured');

    $response->assertSuccessful();
});
