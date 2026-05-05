<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;

it('requires authentication', function () {
    $product = Product::factory()->create();

    $response = $this->get("/products/{$product->slug}");

    $response->assertRedirect('/login');
});

it('shows product details with slug', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['name' => 'Fertilizantes', 'slug' => 'fertilizantes']);
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Fertilizante Premium',
        'slug' => 'fertilizante-premium',
    ]);

    $response = $this->actingAs($user)->get("/products/{$product->slug}");

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Product/Show')
            ->has('product', fn ($p) => $p
                ->where('id', $product->id)
                ->where('name', $product->name)
                ->where('slug', 'fertilizante-premium')
                ->has('category')
                ->has('breadcrumbs')
                ->has('price')
                ->has('images')
                ->etc()
            )
            ->has('related_products')
        );
});

it('returns 404 for non-existent product slug', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/products/non-existent-product');

    $response->assertNotFound();
});

it('includes breadcrumbs with category hierarchy', function () {
    $user = User::factory()->create();
    $parentCategory = Category::factory()->create(['name' => 'Insumos', 'slug' => 'insumos']);
    $category = Category::factory()->create([
        'name' => 'Fertilizantes',
        'slug' => 'fertilizantes',
        'parent_id' => $parentCategory->id,
    ]);
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Fertilizante Premium',
    ]);

    $response = $this->actingAs($user)->get("/products/{$product->slug}");

    $response->assertInertia(fn ($page) => $page
        ->has('product.breadcrumbs', 4)
        ->where('product.breadcrumbs.0.name', 'Inicio')
        ->where('product.breadcrumbs.1.name', 'Insumos')
        ->where('product.breadcrumbs.2.name', 'Fertilizantes')
        ->where('product.breadcrumbs.3.name', 'Fertilizante Premium')
    );
});

it('includes related products from same category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);
    $relatedProduct = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Related Product',
    ]);

    $response = $this->actingAs($user)->get("/products/{$product->slug}");

    $response->assertInertia(fn ($page) => $page
        ->has('related_products')
        ->has('related_products', 1)
        ->where('related_products.0.name', 'Related Product')
    );
});

it('does not include current product in related products', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $response = $this->actingAs($user)->get("/products/{$product->slug}");

    $response->assertInertia(fn ($page) => $page
        ->has('related_products', 0)
    );
});

it('excludes inactive products from related products', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);
    Product::factory()->create([
        'category_id' => $category->id,
        'is_active' => false,
    ]);

    $response = $this->actingAs($user)->get("/products/{$product->slug}");

    $response->assertInertia(fn ($page) => $page
        ->has('related_products', 0)
    );
});

it('excludes archived products from related products', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);
    $archivedProduct = Product::factory()->create(['category_id' => $category->id]);
    $archivedProduct->delete();

    $response = $this->actingAs($user)->get("/products/{$product->slug}");

    $response->assertInertia(fn ($page) => $page
        ->has('related_products', 0)
    );
});
