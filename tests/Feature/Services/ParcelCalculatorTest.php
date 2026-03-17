<?php

use App\Models\CartItem;
use App\Models\Product;
use App\Services\ParcelCalculator;

test('sums weight across items using product dimensions', function () {
    $product1 = Product::factory()->make(['weight_kg' => 2.0, 'width_cm' => 30, 'height_cm' => 20, 'depth_cm' => 10]);
    $product2 = Product::factory()->make(['weight_kg' => 1.5, 'width_cm' => 15, 'height_cm' => 10, 'depth_cm' => 5]);

    $item1 = CartItem::factory()->make(['quantity' => 2]);
    $item1->setRelation('product', $product1);

    $item2 = CartItem::factory()->make(['quantity' => 3]);
    $item2->setRelation('product', $product2);

    $parcel = ParcelCalculator::fromCartItems(collect([$item1, $item2]));

    expect($parcel['weight'])->toBe(8.5) // (2*2) + (1.5*3)
        ->and($parcel['width'])->toBe(30.0) // max(30, 15)
        ->and($parcel['height'])->toBe(20.0) // max(20, 10)
        ->and($parcel['length'])->toBe(35.0); // (10*2) + (5*3)
});

test('uses config defaults for null product dimensions', function () {
    $product = Product::factory()->make([
        'weight_kg' => null,
        'width_cm' => null,
        'height_cm' => null,
        'depth_cm' => null,
    ]);

    $item = CartItem::factory()->make(['quantity' => 1]);
    $item->setRelation('product', $product);

    $parcel = ParcelCalculator::fromCartItems(collect([$item]));

    expect($parcel['weight'])->toBe(1.0)
        ->and($parcel['width'])->toBe(20.0)
        ->and($parcel['height'])->toBe(15.0)
        ->and($parcel['length'])->toBe(10.0);
});

test('multiplies depth by quantity for stacking', function () {
    $product = Product::factory()->make(['depth_cm' => 5.0, 'weight_kg' => 1.0, 'width_cm' => 10, 'height_cm' => 10]);

    $item = CartItem::factory()->make(['quantity' => 4]);
    $item->setRelation('product', $product);

    $parcel = ParcelCalculator::fromCartItems(collect([$item]));

    expect($parcel['length'])->toBe(20.0); // 5 * 4
});

test('weight minimum is 0.1 kg', function () {
    $product = Product::factory()->make(['weight_kg' => 0.01, 'width_cm' => 10, 'height_cm' => 10, 'depth_cm' => 10]);

    $item = CartItem::factory()->make(['quantity' => 1]);
    $item->setRelation('product', $product);

    $parcel = ParcelCalculator::fromCartItems(collect([$item]));

    expect($parcel['weight'])->toBeGreaterThanOrEqual(0.1);
});
