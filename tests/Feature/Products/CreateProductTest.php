<?php

use App\Models\User;

test('authenticated user can view create product page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/admin/products/create');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products/Create')
        ->has('categories')
    );
});

test('unauthenticated user is redirected to login', function () {
    $response = $this->get('/admin/products/create');

    $response->assertRedirect('/admin/login');
});

test('create product page returns expected categories', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/admin/products/create');

    $response->assertInertia(fn ($page) => $page
        ->component('Products/Create')
        ->has('categories', 3)
    );
});

test('authenticated user can store a product', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Test Product',
        'sku' => 'TEST-001',
        'category' => 'Fertilizantes',
        'description' => 'A test product description',
        'price' => 29.99,
        'cost' => 15.00,
        'stock' => 100,
        'min_stock' => 10,
        'is_active' => true,
        'is_featured' => false,
    ]);

    $response->assertRedirect(route('products'));
    $response->assertSessionHas('success', 'Producto creado exitosamente');

    $this->assertDatabaseHas('products', [
        'name' => 'Test Product',
        'sku' => 'TEST-001',
        'category' => 'Fertilizantes',
    ]);
});

test('validation fails with missing required fields', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', []);

    $response->assertSessionHasErrors(['name', 'sku', 'category', 'price', 'stock']);
});

test('validation fails with invalid price', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Test Product',
        'sku' => 'TEST-001',
        'category' => 'Fertilizantes',
        'price' => -10,
        'stock' => 100,
    ]);

    $response->assertSessionHasErrors(['price']);
});

test('validation fails with invalid stock', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Test Product',
        'sku' => 'TEST-001',
        'category' => 'Fertilizantes',
        'price' => 29.99,
        'stock' => -5,
    ]);

    $response->assertSessionHasErrors(['stock']);
});

test('validation fails with duplicate sku', function () {
    $user = User::factory()->create();
    \App\Models\Product::factory()->create(['sku' => 'DUPE-001']);

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Test Product',
        'sku' => 'DUPE-001',
        'category' => 'Fertilizantes',
        'price' => 29.99,
        'stock' => 100,
    ]);

    $response->assertSessionHasErrors(['sku']);
});
