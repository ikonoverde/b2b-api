<?php

use App\Models\Product;
use App\Models\User;

test('authenticated user can view products page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/admin/products');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products')
        ->has('products')
    );
});

test('unauthenticated user is redirected to login', function () {
    $response = $this->get('/admin/products');

    $response->assertRedirect('/admin/login');
});

test('products page returns expected product data structure', function () {
    $user = User::factory()->create();
    Product::factory(3)->create();

    $response = $this->actingAs($user)->get('/admin/products');

    $response->assertInertia(fn ($page) => $page
        ->component('Products')
        ->has('products', 3)
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

test('product status is inactive when is_active is false', function () {
    $product = Product::factory()->inactive()->create();

    expect($product->status)->toBe('inactive');
});

test('product status is low_stock when stock is at or below min_stock', function () {
    $product = Product::factory()->lowStock()->create();

    expect($product->status)->toBe('low_stock');
});

test('product status is active when is_active is true and stock is above min_stock', function () {
    $product = Product::factory()->create([
        'is_active' => true,
        'stock' => 100,
        'min_stock' => 10,
    ]);

    expect($product->status)->toBe('active');
});

test('product status is active when min_stock is null regardless of stock', function () {
    $product = Product::factory()->create([
        'is_active' => true,
        'stock' => 0,
        'min_stock' => null,
    ]);

    expect($product->status)->toBe('active');
});
