<?php

use App\Ai\Tools\Marketing\MarketingProductCatalog;
use App\Models\Category;
use App\Models\Product;
use Laravel\Ai\Tools\Request;

it('returns active products with marketing catalog fields', function () {
    $category = Category::factory()->create(['name' => 'Aceites profesionales', 'slug' => 'aceites-profesionales']);

    $featuredProduct = Product::factory()->featured()->create([
        'category_id' => $category->id,
        'name' => 'Aceite de masaje lavanda 5 L',
        'sku' => 'OIL-5L-LAV',
        'slug' => 'aceite-masaje-lavanda-5l',
        'price' => 799.00,
        'stock' => 42,
        'active_ingredients' => 'Vitamina E y aceite mineral grado cosmetico.',
        'recommendations' => 'Ideal para cabinas de masaje y spas con alto volumen.',
        'description' => str_repeat('Deslizamiento prolongado sin residuo graso. ', 20),
    ]);

    Product::factory()->inactive()->create(['category_id' => $category->id]);

    $payload = json_decode((string) app(MarketingProductCatalog::class)->handle(new Request([
        'category' => 'aceites',
        'search' => 'lavanda',
        'featured_only' => true,
        'limit' => 5,
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload['count'])->toBe(1)
        ->and($payload['products'][0]['id'])->toBe($featuredProduct->id)
        ->and($payload['products'][0]['name'])->toBe('Aceite de masaje lavanda 5 L')
        ->and($payload['products'][0]['sku'])->toBe('OIL-5L-LAV')
        ->and($payload['products'][0]['slug'])->toBe('aceite-masaje-lavanda-5l')
        ->and($payload['products'][0]['category'])->toBe('Aceites profesionales')
        ->and($payload['products'][0]['price'])->toBe(799)
        ->and($payload['products'][0]['stock'])->toBe(42)
        ->and($payload['products'][0]['is_featured'])->toBeTrue()
        ->and($payload['products'][0]['active_ingredients'])->toBe('Vitamina E y aceite mineral grado cosmetico.')
        ->and($payload['products'][0]['recommendations'])->toBe('Ideal para cabinas de masaje y spas con alto volumen.')
        ->and(strlen($payload['products'][0]['description_summary']))->toBeLessThanOrEqual(303);
});

it('does not return products from inactive categories', function () {
    $inactiveCategory = Category::factory()->inactive()->create();

    Product::factory()->create(['category_id' => $inactiveCategory->id]);

    $payload = json_decode((string) app(MarketingProductCatalog::class)->handle(new Request), true, 512, JSON_THROW_ON_ERROR);

    expect($payload['count'])->toBe(0)
        ->and($payload['products'])->toBe([]);
});
