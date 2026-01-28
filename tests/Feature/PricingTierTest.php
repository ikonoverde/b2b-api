<?php

use App\Models\PricingTier;
use App\Models\Product;
use App\Models\User;

test('product has many pricing tiers relationship', function () {
    $product = Product::factory()->create();
    PricingTier::factory()->count(3)->create(['product_id' => $product->id]);

    expect($product->pricingTiers)->toHaveCount(3);
    expect($product->pricingTiers->first())->toBeInstanceOf(PricingTier::class);
});

test('pricing tiers are ordered by min_qty', function () {
    $product = Product::factory()->create();
    PricingTier::factory()->create(['product_id' => $product->id, 'min_qty' => 50]);
    PricingTier::factory()->create(['product_id' => $product->id, 'min_qty' => 10]);
    PricingTier::factory()->create(['product_id' => $product->id, 'min_qty' => 30]);

    $tiers = $product->pricingTiers;

    expect($tiers[0]->min_qty)->toBe(10);
    expect($tiers[1]->min_qty)->toBe(30);
    expect($tiers[2]->min_qty)->toBe(50);
});

test('pricing tier belongs to product', function () {
    $product = Product::factory()->create();
    $tier = PricingTier::factory()->create(['product_id' => $product->id]);

    expect($tier->product)->toBeInstanceOf(Product::class);
    expect($tier->product->id)->toBe($product->id);
});

test('pricing tiers are deleted when product is deleted', function () {
    $product = Product::factory()->create();
    PricingTier::factory()->count(3)->create(['product_id' => $product->id]);

    expect(PricingTier::where('product_id', $product->id)->count())->toBe(3);

    $product->delete();

    expect(PricingTier::where('product_id', $product->id)->count())->toBe(0);
});

test('authenticated user can create product with pricing tiers', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Test Product',
        'sku' => 'TEST-001',
        'category' => 'Fertilizantes',
        'description' => 'Test description',
        'price' => 100,
        'cost' => 50,
        'stock' => 100,
        'min_stock' => 10,
        'is_active' => true,
        'is_featured' => false,
        'pricing_tiers' => [
            ['min_qty' => 10, 'max_qty' => 50, 'price' => 90, 'discount' => 10, 'label' => 'Mayorista'],
            ['min_qty' => 51, 'max_qty' => null, 'price' => 80, 'discount' => 20, 'label' => 'Distribuidor'],
        ],
    ]);

    $response->assertRedirect('/admin/products');

    $product = Product::where('sku', 'TEST-001')->first();
    expect($product)->not->toBeNull();
    expect($product->pricingTiers)->toHaveCount(2);
});

test('authenticated user can update product with pricing tiers', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    PricingTier::factory()->create(['product_id' => $product->id]);

    $response = $this->actingAs($user)->put("/admin/products/{$product->id}", [
        'name' => $product->name,
        'sku' => $product->sku,
        'category' => $product->category,
        'description' => $product->description,
        'price' => $product->price,
        'cost' => $product->cost,
        'stock' => $product->stock,
        'min_stock' => $product->min_stock,
        'is_active' => $product->is_active,
        'is_featured' => $product->is_featured,
        'pricing_tiers' => [
            ['min_qty' => 5, 'max_qty' => 20, 'price' => 85, 'discount' => 15, 'label' => 'Tier 1'],
            ['min_qty' => 21, 'max_qty' => 50, 'price' => 75, 'discount' => 25, 'label' => 'Tier 2'],
            ['min_qty' => 51, 'max_qty' => null, 'price' => 65, 'discount' => 35, 'label' => 'Tier 3'],
        ],
    ]);

    $response->assertRedirect('/admin/products');

    $product->refresh();
    expect($product->pricingTiers)->toHaveCount(3);
});

test('edit page includes pricing tiers', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    PricingTier::factory()->create([
        'product_id' => $product->id,
        'min_qty' => 10,
        'max_qty' => 50,
        'price' => 90,
        'discount' => 10,
        'label' => 'Mayorista',
    ]);

    $response = $this->actingAs($user)->get("/admin/products/{$product->id}/edit");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products/Edit')
        ->has('product.pricing_tiers', 1)
        ->where('product.pricing_tiers.0.label', 'Mayorista')
    );
});

test('validation fails for overlapping pricing tiers', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Test Product',
        'sku' => 'TEST-OVERLAP',
        'category' => 'Fertilizantes',
        'price' => 100,
        'stock' => 100,
        'pricing_tiers' => [
            ['min_qty' => 1, 'max_qty' => 20, 'price' => 90, 'discount' => 10, 'label' => 'Tier 1'],
            ['min_qty' => 15, 'max_qty' => 50, 'price' => 80, 'discount' => 20, 'label' => 'Tier 2'],
        ],
    ]);

    $response->assertSessionHasErrors('pricing_tiers');
});

test('validation fails for unlimited tier followed by another tier', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Test Product',
        'sku' => 'TEST-UNLIMITED',
        'category' => 'Fertilizantes',
        'price' => 100,
        'stock' => 100,
        'pricing_tiers' => [
            ['min_qty' => 1, 'max_qty' => null, 'price' => 90, 'discount' => 10, 'label' => 'Tier 1'],
            ['min_qty' => 50, 'max_qty' => 100, 'price' => 80, 'discount' => 20, 'label' => 'Tier 2'],
        ],
    ]);

    $response->assertSessionHasErrors('pricing_tiers');
});

test('validation fails for pricing tier with max_qty less than min_qty', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Test Product',
        'sku' => 'TEST-INVALID-QTY',
        'category' => 'Fertilizantes',
        'price' => 100,
        'stock' => 100,
        'pricing_tiers' => [
            ['min_qty' => 50, 'max_qty' => 10, 'price' => 90, 'discount' => 10, 'label' => 'Tier 1'],
        ],
    ]);

    $response->assertSessionHasErrors('pricing_tiers.0.max_qty');
});

test('validation fails for pricing tier with invalid discount', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Test Product',
        'sku' => 'TEST-INVALID-DISCOUNT',
        'category' => 'Fertilizantes',
        'price' => 100,
        'stock' => 100,
        'pricing_tiers' => [
            ['min_qty' => 10, 'max_qty' => 50, 'price' => 90, 'discount' => 150, 'label' => 'Tier 1'],
        ],
    ]);

    $response->assertSessionHasErrors('pricing_tiers.0.discount');
});

test('API product detail endpoint returns pricing tiers', function () {
    $product = Product::factory()->create();
    PricingTier::factory()->create([
        'product_id' => $product->id,
        'min_qty' => 10,
        'max_qty' => 50,
        'price' => 90,
        'discount' => 10,
        'label' => 'Mayorista',
    ]);

    $response = $this->getJson("/api/products/{$product->id}");

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'id',
            'name',
            'sku',
            'category',
            'description',
            'price',
            'stock',
            'is_active',
            'is_featured',
            'image',
            'pricing_tiers' => [
                '*' => [
                    'id',
                    'min_qty',
                    'max_qty',
                    'price',
                    'discount',
                    'label',
                ],
            ],
        ],
    ]);
    $response->assertJsonPath('data.pricing_tiers.0.label', 'Mayorista');
});

test('API products list endpoint does not return pricing tiers', function () {
    $product = Product::factory()->create();
    PricingTier::factory()->create(['product_id' => $product->id]);

    $response = $this->getJson('/api/products');

    $response->assertSuccessful();
    $response->assertJsonMissing(['pricing_tiers']);
});

test('product can be created without pricing tiers', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/admin/products', [
        'name' => 'Test Product No Tiers',
        'sku' => 'TEST-NO-TIERS',
        'category' => 'Fertilizantes',
        'price' => 100,
        'stock' => 100,
    ]);

    $response->assertRedirect('/admin/products');

    $product = Product::where('sku', 'TEST-NO-TIERS')->first();
    expect($product)->not->toBeNull();
    expect($product->pricingTiers)->toHaveCount(0);
});
