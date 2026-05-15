<?php

use App\Models\Product;
use Database\Seeders\ProductSeeder;

it('seeds all catalog products with active ingredients and recommendations', function () {
    $this->seed(ProductSeeder::class);

    expect(Product::count())->toBe(7);

    $product = Product::where('sku', 'PRO-1-5L')->firstOrFail();

    expect($product->name)->toBe('Aceite para Masaje Relajante - Garrafa 5 L')
        ->and($product->slug)->toBe('aceite-para-masaje-relajante-garrafa-5-l')
        ->and((float) $product->price)->toBe(2947.56)
        ->and($product->is_active)->toBeTrue()
        ->and($product->category->slug)->toBe('cuidado-corporal')
        ->and($product->active_ingredients)->toContain('aceite de almendras')
        ->and($product->recommendations)->toBe('Apto para todo tipo de piel.');
});

it('shares description across presentations of the same product', function () {
    $this->seed(ProductSeeder::class);

    $garrafa = Product::where('sku', 'PRO-2-5L')->firstOrFail();
    $botella = Product::where('sku', 'PRO-2-1L')->firstOrFail();

    expect($botella->description)->toBe($garrafa->description)
        ->and($botella->active_ingredients)->toBe($garrafa->active_ingredients)
        ->and($botella->recommendations)->toBe($garrafa->recommendations)
        ->and((float) $botella->price)->not->toBe((float) $garrafa->price);
});

it('is idempotent when run more than once', function () {
    $this->seed(ProductSeeder::class);
    $this->seed(ProductSeeder::class);

    expect(Product::count())->toBe(7);
});
