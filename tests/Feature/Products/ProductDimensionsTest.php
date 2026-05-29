<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;

function productDimensionsPayload(array $overrides = []): array
{
    return array_replace([
        'name' => 'Test Product',
        'sku' => fake()->unique()->bothify('PRD-###??'),
        'category_id' => Category::factory()->create()->id,
        'price' => 29.99,
        'stock' => 100,
    ], $overrides);
}

test('can store a product with dimensions', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post('/admin/products', productDimensionsPayload([
        'name' => 'Product With Dimensions',
        'sku' => 'DIM-001',
        'weight_kg' => 2.50,
        'width_cm' => 30.00,
        'height_cm' => 15.00,
        'depth_cm' => 10.00,
    ]));

    $response->assertRedirect(route('admin.products'));

    $this->assertDatabaseHas('products', [
        'sku' => 'DIM-001',
        'weight_kg' => 2.50,
        'width_cm' => 30.00,
        'height_cm' => 15.00,
        'depth_cm' => 10.00,
    ]);
});

test('can store a product with shipping packages by quantity', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post('/admin/products', productDimensionsPayload([
        'name' => 'Product With Package Table',
        'sku' => 'PKG-001',
        'weight_kg' => 5.10,
        'width_cm' => 20.00,
        'height_cm' => 17.00,
        'depth_cm' => 25.00,
        'shipping_packages' => [
            ['quantity' => 1, 'weight_kg' => 5.10, 'width_cm' => 20, 'height_cm' => 17, 'depth_cm' => 25],
            ['quantity' => 2, 'weight_kg' => 10.11, 'width_cm' => 35, 'height_cm' => 17, 'depth_cm' => 25],
        ],
    ]));

    $response->assertRedirect(route('admin.products'));

    $product = Product::query()->where('sku', 'PKG-001')->firstOrFail();

    expect($product->shipping_packages)->toHaveCount(2)
        ->and((int) $product->shipping_packages[1]['quantity'])->toBe(2)
        ->and((float) $product->shipping_packages[1]['weight_kg'])->toBe(10.11)
        ->and((float) $product->shipping_packages[1]['width_cm'])->toBe(35.0)
        ->and((float) $product->shipping_packages[1]['height_cm'])->toBe(17.0)
        ->and((float) $product->shipping_packages[1]['depth_cm'])->toBe(25.0);
});

test('can store a product without dimensions', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post('/admin/products', productDimensionsPayload([
        'name' => 'Product No Dims',
        'sku' => 'NODIM-001',
        'price' => 19.99,
        'stock' => 50,
    ]));

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
    $product = Product::factory()->create();

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", productDimensionsPayload([
        'name' => $product->name,
        'sku' => $product->sku,
        'weight_kg' => 5.75,
        'width_cm' => 40.00,
        'height_cm' => 20.00,
        'depth_cm' => 25.50,
    ]));

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
    $product = Product::factory()->withDimensions()->create();

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", productDimensionsPayload([
        'name' => $product->name,
        'sku' => $product->sku,
        'weight_kg' => null,
        'width_cm' => null,
        'height_cm' => null,
        'depth_cm' => null,
    ]));

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

    $response = $this->actingAs($user)->post('/admin/products', productDimensionsPayload([
        $field => $value,
    ]));

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

test('shipping package validation requires unique quantities', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post('/admin/products', productDimensionsPayload([
        'name' => 'Duplicate Package Quantity',
        'sku' => 'PKG-DUP',
        'shipping_packages' => [
            ['quantity' => 2, 'weight_kg' => 10.11, 'width_cm' => 35, 'height_cm' => 17, 'depth_cm' => 25],
            ['quantity' => 2, 'weight_kg' => 10.11, 'width_cm' => 35, 'height_cm' => 17, 'depth_cm' => 25],
        ],
    ]));

    $response->assertSessionHasErrors(['shipping_packages.0.quantity', 'shipping_packages.1.quantity']);
});

test('shipping package validation rejects non-array values', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post('/admin/products', productDimensionsPayload([
        'name' => 'Invalid Package Payload',
        'sku' => 'PKG-BAD',
        'shipping_packages' => 'bad-payload',
    ]));

    $response->assertSessionHasErrors(['shipping_packages']);
});

test('shipping package validation requires complete rows', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post('/admin/products', productDimensionsPayload([
        'name' => 'Incomplete Package',
        'sku' => 'PKG-PART',
        'shipping_packages' => [
            ['quantity' => 2, 'weight_kg' => 10.11],
        ],
    ]));

    $response->assertSessionHasErrors([
        'shipping_packages.0.width_cm',
        'shipping_packages.0.height_cm',
        'shipping_packages.0.depth_cm',
    ]);
});

test('dimension validation accepts valid decimal values', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post('/admin/products', productDimensionsPayload([
        'name' => 'Valid Decimals',
        'sku' => 'VALDEC-001',
        'weight_kg' => 0.01,
        'width_cm' => 0.1,
        'height_cm' => 0.1,
        'depth_cm' => 0.1,
    ]));

    $response->assertSessionDoesntHaveErrors(['weight_kg', 'width_cm', 'height_cm', 'depth_cm']);
    $response->assertRedirect(route('admin.products'));
});

test('dimension validation rejects values exceeding max', function (string $field, float $value) {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post('/admin/products', productDimensionsPayload([
        'name' => 'Too Big',
        'sku' => 'MAX-001',
        $field => $value,
    ]));

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
        ->has('product.shipping_packages')
    );
});
