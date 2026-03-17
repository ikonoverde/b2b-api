<?php

namespace App\Services;

use Illuminate\Support\Collection;

class ParcelCalculator
{
    /**
     * Aggregate cart items into a parcel specification.
     *
     * @param  Collection<int, \App\Models\CartItem>  $items
     * @return array{weight: float, height: float, width: float, length: float}
     */
    public static function fromCartItems(Collection $items): array
    {
        $defaults = config('shop.default_parcel');

        $weight = $items->sum(function ($item) use ($defaults) {
            $unitWeight = (float) ($item->product->weight_kg ?? $defaults['weight_kg']);

            return $unitWeight * $item->quantity;
        });

        $width = $items->max(function ($item) use ($defaults) {
            return (float) ($item->product->width_cm ?? $defaults['width_cm']);
        });

        $height = $items->max(function ($item) use ($defaults) {
            return (float) ($item->product->height_cm ?? $defaults['height_cm']);
        });

        $length = $items->sum(function ($item) use ($defaults) {
            $unitDepth = (float) ($item->product->depth_cm ?? $defaults['depth_cm']);

            return $unitDepth * $item->quantity;
        });

        return [
            'weight' => round(max($weight, 0.1), 2),
            'height' => round($height, 2),
            'width' => round($width, 2),
            'length' => round($length, 2),
        ];
    }
}
