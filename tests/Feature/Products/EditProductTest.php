<?php

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

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

test('authenticated user can update a product with an image', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $product = Product::factory()->create([
        'name' => 'Old Name',
        'sku' => 'IMG-001',
    ]);

    $image = UploadedFile::fake()->create('product.jpg', 100, 'image/jpeg');

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => 'Updated with Image',
        'sku' => 'IMG-001',
        'category' => 'Fertilizantes',
        'price' => 29.99,
        'stock' => 100,
        'image' => $image,
    ]);

    $response->assertRedirect(route('products'));
    $response->assertSessionHas('success', 'Producto actualizado exitosamente');

    $product->refresh();
    expect($product->image)->not->toBeNull();
    Storage::disk('public')->assertExists($product->image);
});

test('updating product replaces old image', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $oldImage = UploadedFile::fake()->create('old.jpg', 50, 'image/jpeg');
    $oldImagePath = $oldImage->store('products', 'public');

    $product = Product::factory()->create([
        'sku' => 'REPLACE-001',
        'image' => $oldImagePath,
    ]);

    $newImage = UploadedFile::fake()->create('new.jpg', 100, 'image/jpeg');

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => 'Product with New Image',
        'sku' => 'REPLACE-001',
        'category' => 'Fertilizantes',
        'price' => 29.99,
        'stock' => 100,
        'image' => $newImage,
    ]);

    $response->assertRedirect(route('products'));

    $product->refresh();
    expect($product->image)->not->toBe($oldImagePath);
    Storage::disk('public')->assertMissing($oldImagePath);
    Storage::disk('public')->assertExists($product->image);
});

test('image validation rejects invalid file types', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $product = Product::factory()->create(['sku' => 'INVALID-001']);

    $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => 'Product',
        'sku' => 'INVALID-001',
        'category' => 'Fertilizantes',
        'price' => 29.99,
        'stock' => 100,
        'images' => [$file],
    ]);

    $response->assertSessionHasErrors(['images.0']);
});

test('image validation rejects files over 5MB', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $product = Product::factory()->create(['sku' => 'BIG-001']);

    $file = UploadedFile::fake()->create('large.jpg', 6000, 'image/jpeg'); // 6MB

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => 'Product',
        'sku' => 'BIG-001',
        'category' => 'Fertilizantes',
        'price' => 29.99,
        'stock' => 100,
        'images' => [$file],
    ]);

    $response->assertSessionHasErrors(['images.0']);
});
