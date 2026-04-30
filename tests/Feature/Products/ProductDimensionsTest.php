<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;

test('can store a product with dimensions', function () {
    $user = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Product With Dimensions',
        'sku' => 'DIM-001',
        'category_id' => $category->id,
        'price' => 29.99,
        'stock' => 100,
        'weight_kg' => 2.50,
        'width_cm' => 30.00,
        'height_cm' => 15.00,
        'depth_cm' => 10.00,
    ]);

    $response->assertRedirect(route('admin.products'));

    $this->assertDatabaseHas('products', [
        'sku' => 'DIM-001',
        'weight_kg' => 2.50,
        'width_cm' => 30.00,
        'height_cm' => 15.00,
        'depth_cm' => 10.00,
    ]);
});

test('can store a product without dimensions', function () {
    $user = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Product No Dims',
        'sku' => 'NODIM-001',
        'category_id' => $category->id,
        'price' => 19.99,
        'stock' => 50,
    ]);

    $response->assertRedirect(route('admin.products'));

    $this->assertDatabaseHas('products', [
        'sku' => 'NODIM-001',
        'weight_kg' => null,
        'width_cm' => null,
        'height_cm' => null,
        'depth_cm' => null,
    ]);
});

test('can update a product with dimensions', function () {
    $user = User::factory()->admin()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create();

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => $product->name,
        'sku' => $product->sku,
        'category_id' => $category->id,
        'price' => 29.99,
        'stock' => 100,
        'weight_kg' => 5.75,
        'width_cm' => 40.00,
        'height_cm' => 20.00,
        'depth_cm' => 25.50,
    ]);

    $response->assertRedirect(route('admin.products'));

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'weight_kg' => 5.75,
        'width_cm' => 40.00,
        'height_cm' => 20.00,
        'depth_cm' => 25.50,
    ]);
});

test('can clear dimensions on update', function () {
    $user = User::factory()->admin()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->withDimensions()->create();

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => $product->name,
        'sku' => $product->sku,
        'category_id' => $category->id,
        'price' => 29.99,
        'stock' => 100,
        'weight_kg' => null,
        'width_cm' => null,
        'height_cm' => null,
        'depth_cm' => null,
    ]);

    $response->assertRedirect(route('admin.products'));

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'weight_kg' => null,
        'width_cm' => null,
        'height_cm' => null,
        'depth_cm' => null,
    ]);
});

test('dimension validation rejects negative values', function (string $field, float $value) {
    $user = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Test Product',
        'sku' => 'VAL-001',
        'category_id' => $category->id,
        'price' => 29.99,
        'stock' => 100,
        $field => $value,
    ]);

    $response->assertSessionHasErrors([$field]);
})->with([
    ['weight_kg', -1.0],
    ['weight_kg', 0.0],
    ['width_cm', -5.0],
    ['width_cm', 0.0],
    ['height_cm', -3.0],
    ['height_cm', 0.0],
    ['depth_cm', -2.0],
    ['depth_cm', 0.0],
]);

test('dimension validation accepts valid decimal values', function () {
    $user = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Valid Decimals',
        'sku' => 'VALDEC-001',
        'category_id' => $category->id,
        'price' => 29.99,
        'stock' => 100,
        'weight_kg' => 0.01,
        'width_cm' => 0.1,
        'height_cm' => 0.1,
        'depth_cm' => 0.1,
    ]);

    $response->assertSessionDoesntHaveErrors(['weight_kg', 'width_cm', 'height_cm', 'depth_cm']);
    $response->assertRedirect(route('admin.products'));
});

test('dimension validation rejects values exceeding max', function (string $field, float $value) {
    $user = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Too Big',
        'sku' => 'MAX-001',
        'category_id' => $category->id,
        'price' => 29.99,
        'stock' => 100,
        $field => $value,
    ]);

    $response->assertSessionHasErrors([$field]);
})->with([
    ['weight_kg', 1000.0],
    ['width_cm', 10000.0],
    ['height_cm', 10000.0],
    ['depth_cm', 10000.0],
]);

test('edit page returns dimension fields', function () {
    $user = User::factory()->admin()->create();
    $product = Product::factory()->withDimensions()->create();

    $response = $this->actingAs($user)->get("/admin/products/{$product->id}/edit");

    $response->assertInertia(fn ($page) => $page
        ->component('Products/Edit')
        ->has('product.weight_kg')
        ->has('product.width_cm')
        ->has('product.height_cm')
        ->has('product.depth_cm')
    );
});
