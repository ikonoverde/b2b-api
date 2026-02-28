<?php

use App\Models\Category;
use App\Models\PricingTier;
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
                ->has('pricing_tiers')
                ->etc()
            )
            ->has('related_products')
        );
});

it('includes pricing tiers', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    PricingTier::factory(3)->create(['product_id' => $product->id]);

    $response = $this->actingAs($user)->get("/products/{$product->slug}");

    $response->assertInertia(fn ($page) => $page
        ->has('product.pricing_tiers', 3)
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

it('calculates discount percentage when sale price exists', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 100.00,
    ]);
    PricingTier::factory()->create([
        'product_id' => $product->id,
        'min_qty' => 1,
        'max_qty' => null,
        'price' => 75.00,
    ]);

    $response = $this->actingAs($user)->get("/products/{$product->slug}");

    $response->assertInertia(fn ($page) => $page
        ->where('product.sale_price', 75)
        ->where('product.discount_percentage', 25)
    );
});

it('does not show discount when no pricing tiers offer discount', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 100.00,
    ]);

    $response = $this->actingAs($user)->get("/products/{$product->slug}");

    $response->assertInertia(fn ($page) => $page
        ->where('product.sale_price', null)
        ->where('product.discount_percentage', null)
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
