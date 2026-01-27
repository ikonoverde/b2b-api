<?php

use App\Models\Product;
use App\Models\User;

test('authenticated user can view edit product page', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $response = $this->actingAs($user)->get("/admin/products/{$product->id}/edit");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products/Edit')
        ->has('product')
        ->has('categories')
    );
});

test('unauthenticated user is redirected to login', function () {
    $product = Product::factory()->create();

    $response = $this->get("/admin/products/{$product->id}/edit");

    $response->assertRedirect('/admin/login');
});

test('edit page shows product data', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'name' => 'Fertilizante Premium',
        'sku' => 'FERT-001',
        'category' => 'Fertilizantes',
        'price' => 49.99,
    ]);

    $response = $this->actingAs($user)->get("/admin/products/{$product->id}/edit");

    $response->assertInertia(fn ($page) => $page
        ->component('Products/Edit')
        ->where('product.name', 'Fertilizante Premium')
        ->where('product.sku', 'FERT-001')
        ->where('product.category', 'Fertilizantes')
    );
});

test('authenticated user can update a product', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'name' => 'Old Name',
        'sku' => 'OLD-001',
    ]);

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => 'Updated Name',
        'sku' => 'UPD-001',
        'category' => 'Semillas',
        'description' => 'Updated description',
        'price' => 59.99,
        'cost' => 30.00,
        'stock' => 200,
        'min_stock' => 20,
        'is_active' => true,
        'is_featured' => true,
    ]);

    $response->assertRedirect(route('products'));
    $response->assertSessionHas('success', 'Producto actualizado exitosamente');

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Updated Name',
        'sku' => 'UPD-001',
        'category' => 'Semillas',
    ]);
});

test('validation fails with missing required fields', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", []);

    $response->assertSessionHasErrors(['name', 'sku', 'category', 'price', 'stock']);
});

test('sku unique validation allows same product sku', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'sku' => 'SAME-001',
    ]);

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => 'Updated Name',
        'sku' => 'SAME-001',
        'category' => 'Fertilizantes',
        'price' => 29.99,
        'stock' => 100,
    ]);

    $response->assertSessionDoesntHaveErrors(['sku']);
    $response->assertRedirect(route('products'));
});

test('sku unique validation rejects duplicate from other product', function () {
    $user = User::factory()->create();
    Product::factory()->create(['sku' => 'EXISTING-001']);
    $product = Product::factory()->create(['sku' => 'ORIGINAL-001']);

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => 'Updated Name',
        'sku' => 'EXISTING-001',
        'category' => 'Fertilizantes',
        'price' => 29.99,
        'stock' => 100,
    ]);

    $response->assertSessionHasErrors(['sku']);
});
