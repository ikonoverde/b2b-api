<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;

test('admin can view featured products page', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/admin/featured-products');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Content/FeaturedProducts')
        ->has('featuredProducts')
        ->has('availableProducts')
    );
});

test('featured products page shows featured products ordered by featured_order', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();

    Product::factory()->create([
        'name' => 'Second',
        'is_featured' => true,
        'featured_order' => 2,
        'category_id' => $category->id,
    ]);
    Product::factory()->create([
        'name' => 'First',
        'is_featured' => true,
        'featured_order' => 1,
        'category_id' => $category->id,
    ]);

    $response = $this->actingAs($admin)->get('/admin/featured-products');

    $response->assertInertia(fn ($page) => $page
        ->where('featuredProducts.0.name', 'First')
        ->where('featuredProducts.1.name', 'Second')
    );
});

test('admin can update featured products', function () {
    $admin = User::factory()->admin()->create();
    $products = Product::factory(3)->create();

    $response = $this->actingAs($admin)->put('/admin/featured-products', [
        'products' => [
            ['id' => $products[0]->id, 'featured_order' => 1],
            ['id' => $products[2]->id, 'featured_order' => 2],
        ],
    ]);

    $response->assertRedirect('/admin/featured-products');

    expect($products[0]->fresh()->is_featured)->toBeTrue();
    expect($products[0]->fresh()->featured_order)->toBe(1);
    expect($products[2]->fresh()->is_featured)->toBeTrue();
    expect($products[2]->fresh()->featured_order)->toBe(2);
    expect($products[1]->fresh()->is_featured)->toBeFalse();
});

test('updating featured products clears previously featured products', function () {
    $admin = User::factory()->admin()->create();
    $oldFeatured = Product::factory()->featured()->create();
    $newFeatured = Product::factory()->create();

    $this->actingAs($admin)->put('/admin/featured-products', [
        'products' => [
            ['id' => $newFeatured->id, 'featured_order' => 1],
        ],
    ]);

    expect($oldFeatured->fresh()->is_featured)->toBeFalse();
    expect($oldFeatured->fresh()->featured_order)->toBe(0);
    expect($newFeatured->fresh()->is_featured)->toBeTrue();
});

test('featured products validation requires products array', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->put('/admin/featured-products', []);

    $response->assertSessionHasErrors('products');
});

test('featured products validation rejects more than 20 products', function () {
    $admin = User::factory()->admin()->create();
    $products = Product::factory(21)->create();

    $response = $this->actingAs($admin)->put('/admin/featured-products', [
        'products' => $products->map(fn ($p, $i) => ['id' => $p->id, 'featured_order' => $i + 1])->toArray(),
    ]);

    $response->assertSessionHasErrors('products');
});

test('featured products validation rejects invalid product id', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->put('/admin/featured-products', [
        'products' => [
            ['id' => 99999, 'featured_order' => 1],
        ],
    ]);

    $response->assertSessionHasErrors('products.0.id');
});

test('unauthenticated user cannot access featured products page', function () {
    $response = $this->get('/admin/featured-products');

    $response->assertRedirect('/admin/login');
});
