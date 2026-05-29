<?php

use App\Models\CartItem;
use App\Models\Product;
use App\Services\ParcelCalculator;

function cartItemForProduct(Product $product, int $quantity): CartItem
{
    $item = CartItem::factory()->make(['quantity' => $quantity]);
    $item->setRelation('product', $product);

    return $item;
}

test('sums weight across items using product dimensions', function () {
    $product1 = Product::factory()->make(['weight_kg' => 2.0, 'width_cm' => 30, 'height_cm' => 20, 'depth_cm' => 10]);
    $product2 = Product::factory()->make(['weight_kg' => 1.5, 'width_cm' => 15, 'height_cm' => 10, 'depth_cm' => 5]);

    $parcel = ParcelCalculator::fromCartItems(collect([
        cartItemForProduct($product1, 2),
        cartItemForProduct($product2, 3),
    ]));

    expect($parcel['weight'])->toBe(8.5)
        ->and($parcel['width'])->toBe(30.0)
        ->and($parcel['height'])->toBe(20.0)
        ->and($parcel['length'])->toBe(35.0);
});

test('uses configured shipping package for matching quantity', function () {
    $product = Product::factory()->make([
        'weight_kg' => 5.10,
        'width_cm' => 20,
        'height_cm' => 17,
        'depth_cm' => 25,
        'shipping_packages' => [
            ['quantity' => 1, 'weight_kg' => 5.10, 'width_cm' => 20, 'height_cm' => 17, 'depth_cm' => 25],
            ['quantity' => 2, 'weight_kg' => 10.11, 'width_cm' => 35, 'height_cm' => 17, 'depth_cm' => 25],
        ],
    ]);

    $parcel = ParcelCalculator::fromCartItems(collect([
        cartItemForProduct($product, 2),
    ]));

    expect($parcel['weight'])->toBe(10.11)
        ->and($parcel['width'])->toBe(35.0)
        ->and($parcel['height'])->toBe(17.0)
        ->and($parcel['length'])->toBe(25.0);
});

test('combines configured shipping packages for quantities without an exact row', function () {
    $product = Product::factory()->make([
        'weight_kg' => 1.16,
        'width_cm' => 12,
        'height_cm' => 12,
        'depth_cm' => 30,
        'shipping_packages' => [
            ['quantity' => 1, 'weight_kg' => 1.16, 'width_cm' => 12, 'height_cm' => 12, 'depth_cm' => 30],
            ['quantity' => 4, 'weight_kg' => 4.57, 'width_cm' => 20, 'height_cm' => 20, 'depth_cm' => 30],
        ],
    ]);

    $parcel = ParcelCalculator::fromCartItems(collect([
        cartItemForProduct($product, 5),
    ]));

    expect($parcel['weight'])->toBe(5.73)
        ->and($parcel['width'])->toBe(20.0)
        ->and($parcel['height'])->toBe(20.0)
        ->and($parcel['length'])->toBe(60.0);
});

test('uses config defaults for null product dimensions', function () {
    $product = Product::factory()->make([
        'weight_kg' => null,
        'width_cm' => null,
        'height_cm' => null,
        'depth_cm' => null,
    ]);

    $parcel = ParcelCalculator::fromCartItems(collect([
        cartItemForProduct($product, 1),
    ]));

    expect($parcel['weight'])->toBe(1.0)
        ->and($parcel['width'])->toBe(20.0)
        ->and($parcel['height'])->toBe(15.0)
        ->and($parcel['length'])->toBe(10.0);
});

test('multiplies depth by quantity for stacking', function () {
    $product = Product::factory()->make(['depth_cm' => 5.0, 'weight_kg' => 1.0, 'width_cm' => 10, 'height_cm' => 10]);

    $parcel = ParcelCalculator::fromCartItems(collect([
        cartItemForProduct($product, 4),
    ]));

    expect($parcel['length'])->toBe(20.0);
});

test('weight minimum is 0.1 kg', function () {
    $product = Product::factory()->make(['weight_kg' => 0.01, 'width_cm' => 10, 'height_cm' => 10, 'depth_cm' => 10]);

    $parcel = ParcelCalculator::fromCartItems(collect([
        cartItemForProduct($product, 1),
    ]));

    expect($parcel['weight'])->toBeGreaterThanOrEqual(0.1);
});
