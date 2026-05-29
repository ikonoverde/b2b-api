<?php

namespace App\Services;

use App\Models\CartItem;
use Illuminate\Support\Collection;

class ParcelCalculator
{
    /**
     * Aggregate cart items into a parcel specification.
     *
     * @param  Collection<int, CartItem>  $items
     * @return array{weight: float, height: float, width: float, length: float}
     */
    public static function fromCartItems(Collection $items): array
    {
        $defaults = config('shop.default_parcel');

        $itemParcels = $items->map(fn (CartItem $item): array => self::parcelForItem($item, $defaults));

        $weight = $itemParcels->sum('weight');
        $width = $itemParcels->max('width') ?? (float) $defaults['width_cm'];
        $height = $itemParcels->max('height') ?? (float) $defaults['height_cm'];
        $length = $itemParcels->sum('length');

        return [
            'weight' => round(max($weight, 0.1), 2),
            'height' => round($height, 2),
            'width' => round($width, 2),
            'length' => round($length, 2),
        ];
    }

    /**
     * @param  array{weight_kg: numeric, height_cm: numeric, width_cm: numeric, depth_cm: numeric}  $defaults
     * @return array{weight: float, height: float, width: float, length: float}
     */
    private static function parcelForItem(CartItem $item, array $defaults): array
    {
        $packages = collect($item->product->shipping_packages ?? [])
            ->filter(fn (array $package): bool => (int) ($package['quantity'] ?? 0) > 0)
            ->sortByDesc(fn (array $package): int => (int) $package['quantity'])
            ->values();

        if ($packages->isEmpty()) {
            return self::fallbackParcelForItem($item, $defaults, $item->quantity);
        }

        $remainingQuantity = $item->quantity;
        $parcel = self::emptyParcel();

        foreach ($packages as $package) {
            $packageQuantity = (int) $package['quantity'];

            if ($packageQuantity > $remainingQuantity) {
                continue;
            }

            $packageCount = intdiv($remainingQuantity, $packageQuantity);
            $remainingQuantity -= $packageCount * $packageQuantity;

            $parcel = self::combineParcels($parcel, [
                'weight' => (float) $package['weight_kg'] * $packageCount,
                'height' => (float) $package['height_cm'],
                'width' => (float) $package['width_cm'],
                'length' => (float) $package['depth_cm'] * $packageCount,
            ]);
        }

        if ($remainingQuantity > 0) {
            $parcel = self::combineParcels(
                $parcel,
                self::fallbackParcelForItem($item, $defaults, $remainingQuantity),
            );
        }

        return $parcel;
    }

    /**
     * @return array{weight: float, height: float, width: float, length: float}
     */
    private static function emptyParcel(): array
    {
        return ['weight' => 0.0, 'height' => 0.0, 'width' => 0.0, 'length' => 0.0];
    }

    /**
     * @param  array{weight: float, height: float, width: float, length: float}  $parcel
     * @param  array{weight: float, height: float, width: float, length: float}  $additionalParcel
     * @return array{weight: float, height: float, width: float, length: float}
     */
    private static function combineParcels(array $parcel, array $additionalParcel): array
    {
        return [
            'weight' => $parcel['weight'] + $additionalParcel['weight'],
            'height' => max($parcel['height'], $additionalParcel['height']),
            'width' => max($parcel['width'], $additionalParcel['width']),
            'length' => $parcel['length'] + $additionalParcel['length'],
        ];
    }

    /**
     * @param  array{weight_kg: numeric, height_cm: numeric, width_cm: numeric, depth_cm: numeric}  $defaults
     * @return array{weight: float, height: float, width: float, length: float}
     */
    private static function fallbackParcelForItem(CartItem $item, array $defaults, int $quantity): array
    {
        $unitWeight = (float) ($item->product->weight_kg ?? $defaults['weight_kg']);
        $unitDepth = (float) ($item->product->depth_cm ?? $defaults['depth_cm']);

        return [
            'weight' => $unitWeight * $quantity,
            'height' => (float) ($item->product->height_cm ?? $defaults['height_cm']),
            'width' => (float) ($item->product->width_cm ?? $defaults['width_cm']),
            'length' => $unitDepth * $quantity,
        ];
    }
}
