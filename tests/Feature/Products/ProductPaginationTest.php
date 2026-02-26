<?php

use App\Models\Product;

test('products endpoint returns paginated response with default per_page of 15', function () {
    Product::factory(20)->create();

    $response = $this->getJson('/api/products');

    $response->assertSuccessful();
    $response->assertJsonCount(15, 'data');
    $response->assertJsonPath('meta.current_page', 1);
    $response->assertJsonPath('meta.per_page', 15);
    $response->assertJsonPath('meta.total', 20);
    $response->assertJsonPath('meta.last_page', 2);
});

test('products endpoint respects per_page query parameter', function () {
    Product::factory(10)->create();

    $response = $this->getJson('/api/products?per_page=5');

    $response->assertSuccessful();
    $response->assertJsonCount(5, 'data');
    $response->assertJsonPath('meta.per_page', 5);
    $response->assertJsonPath('meta.total', 10);
    $response->assertJsonPath('meta.last_page', 2);
});

test('products endpoint respects page query parameter', function () {
    Product::factory(20)->create();

    $response = $this->getJson('/api/products?page=2');

    $response->assertSuccessful();
    $response->assertJsonCount(5, 'data');
    $response->assertJsonPath('meta.current_page', 2);
    $response->assertJsonPath('meta.total', 20);
});

test('products endpoint caps per_page at 100', function () {
    $response = $this->getJson('/api/products?per_page=150');

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('per_page');
});

test('products endpoint rejects per_page below 1', function () {
    $response = $this->getJson('/api/products?per_page=0');

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('per_page');
});

test('products endpoint rejects negative page number', function () {
    $response = $this->getJson('/api/products?page=-1');

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('page');
});

test('products endpoint rejects non-integer per_page', function () {
    $response = $this->getJson('/api/products?per_page=abc');

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('per_page');
});

test('products endpoint includes pagination links', function () {
    Product::factory(20)->create();

    $response = $this->getJson('/api/products');

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data',
        'links' => ['first', 'last', 'prev', 'next'],
        'meta' => ['current_page', 'last_page', 'per_page', 'total'],
    ]);
});

test('products endpoint returns empty data with pagination meta when no products', function () {
    $response = $this->getJson('/api/products');

    $response->assertSuccessful();
    $response->assertJsonCount(0, 'data');
    $response->assertJsonPath('meta.total', 0);
    $response->assertJsonPath('meta.current_page', 1);
    $response->assertJsonPath('meta.last_page', 1);
});

test('products endpoint works without any query parameters', function () {
    Product::factory(3)->create();

    $response = $this->getJson('/api/products');

    $response->assertSuccessful();
    $response->assertJsonCount(3, 'data');
    $response->assertJsonPath('meta.per_page', 15);
});
