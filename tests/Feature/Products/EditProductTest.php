<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
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
    $category = Category::factory()->create(['name' => 'Fertilizantes']);
    $product = Product::factory()->create([
        'name' => 'Fertilizante Premium',
        'sku' => 'FERT-001',
        'category_id' => $category->id,
        'price' => 49.99,
    ]);

    $response = $this->actingAs($user)->get("/admin/products/{$product->id}/edit");

    $response->assertInertia(fn ($page) => $page
        ->component('Products/Edit')
        ->where('product.name', 'Fertilizante Premium')
        ->where('product.sku', 'FERT-001')
        ->where('product.category_id', $category->id)
    );
});

test('authenticated user can update a product', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'name' => 'Old Name',
        'sku' => 'OLD-001',
    ]);

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => 'Updated Name',
        'sku' => 'UPD-001',
        'category_id' => $category->id,
        'description' => 'Updated description',
        'price' => 59.99,
        'cost' => 30.00,
        'stock' => 200,
        'min_stock' => 20,
        'is_active' => true,
        'is_featured' => true,
    ]);

    $response->assertRedirect(route('admin.products'));
    $response->assertSessionHas('success', 'Producto actualizado exitosamente');

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Updated Name',
        'sku' => 'UPD-001',
        'category_id' => $category->id,
    ]);
});

test('authenticated user can update a product with formula_id', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['formula_id' => null]);

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => 'Updated with Formula',
        'sku' => $product->sku,
        'category_id' => $category->id,
        'formula_id' => 7,
        'price' => 29.99,
        'stock' => 100,
    ]);

    $response->assertRedirect(route('admin.products'));

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'formula_id' => 7,
    ]);
});

test('formula_id can be cleared on update', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->withFormula(5)->create();

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => 'Clear Formula',
        'sku' => $product->sku,
        'category_id' => $category->id,
        'formula_id' => null,
        'price' => 29.99,
        'stock' => 100,
    ]);

    $response->assertRedirect(route('admin.products'));

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'formula_id' => null,
    ]);
});

test('edit page includes formula_id in product data', function () {
    Http::fake([
        '*/oauth/token' => Http::response(['access_token' => 'test-token']),
        '*/api/formulas' => Http::response([
            ['id' => 3, 'name' => 'Formula Test'],
        ]),
    ]);

    $user = User::factory()->create();
    $product = Product::factory()->withFormula(3)->create();

    $response = $this->actingAs($user)->get("/admin/products/{$product->id}/edit");

    $response->assertInertia(fn ($page) => $page
        ->component('Products/Edit')
        ->where('product.formula_id', 3)
        ->missing('formulas')
        ->loadDeferredProps(fn ($reload) => $reload
            ->has('formulas')
        )
    );
});

test('validation fails with missing required fields', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", []);

    $response->assertSessionHasErrors(['name', 'sku', 'category_id', 'price', 'stock']);
});

test('sku unique validation allows same product sku', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'sku' => 'SAME-001',
    ]);

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => 'Updated Name',
        'sku' => 'SAME-001',
        'category_id' => $category->id,
        'price' => 29.99,
        'stock' => 100,
    ]);

    $response->assertSessionDoesntHaveErrors(['sku']);
    $response->assertRedirect(route('admin.products'));
});

test('sku unique validation rejects duplicate from other product', function () {
    $user = User::factory()->create();
    Product::factory()->create(['sku' => 'EXISTING-001']);
    $product = Product::factory()->create(['sku' => 'ORIGINAL-001']);

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => 'Updated Name',
        'sku' => 'EXISTING-001',
        'category_id' => Category::factory()->create()->id,
        'price' => 29.99,
        'stock' => 100,
    ]);

    $response->assertSessionHasErrors(['sku']);
});

test('authenticated user can update a product with images', function () {
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
        'category_id' => Category::factory()->create()->id,
        'price' => 29.99,
        'stock' => 100,
        'images' => [$image],
    ]);

    $response->assertRedirect(route('admin.products'));
    $response->assertSessionHas('success', 'Producto actualizado exitosamente');

    $this->assertDatabaseHas('product_images', [
        'product_id' => $product->id,
    ]);
    $productImage = $product->images()->first();
    Storage::disk('public')->assertExists($productImage->image_path);
});

test('updating product can delete old images and add new ones', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $oldImage = UploadedFile::fake()->create('old.jpg', 50, 'image/jpeg');
    $oldImagePath = $oldImage->store('products', 'public');

    $product = Product::factory()->create([
        'sku' => 'REPLACE-001',
    ]);

    $existingImage = $product->images()->create([
        'image_path' => $oldImagePath,
        'position' => 0,
    ]);

    $newImage = UploadedFile::fake()->create('new.jpg', 100, 'image/jpeg');

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => 'Product with New Image',
        'sku' => 'REPLACE-001',
        'category_id' => Category::factory()->create()->id,
        'price' => 29.99,
        'stock' => 100,
        'delete_images' => [$existingImage->id],
        'images' => [$newImage],
    ]);

    $response->assertRedirect(route('admin.products'));

    Storage::disk('public')->assertMissing($oldImagePath);
    $this->assertDatabaseMissing('product_images', ['id' => $existingImage->id]);

    $newProductImage = $product->images()->first();
    expect($newProductImage)->not->toBeNull();
    Storage::disk('public')->assertExists($newProductImage->image_path);
});

test('image validation rejects invalid file types', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $product = Product::factory()->create(['sku' => 'INVALID-001']);

    $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => 'Product',
        'sku' => 'INVALID-001',
        'category_id' => Category::factory()->create()->id,
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
        'category_id' => Category::factory()->create()->id,
        'price' => 29.99,
        'stock' => 100,
        'images' => [$file],
    ]);

    $response->assertSessionHasErrors(['images.0']);
});
