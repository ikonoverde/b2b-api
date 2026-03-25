<?php

namespace App\Services;

use App\Models\ShippingMethod;
use Illuminate\Support\Collection;

class ShippingQuoteService
{
    public function __construct(
        private SkydropxService $skydropx,
    ) {}

    /**
     * @param  array{postal_code: string, city: string, state: string, neighborhood: string}  $destination
     * @param  Collection<int, \App\Models\CartItem>  $cartItems
     * @return array{quotes: array<int, array<string, mixed>>, source: string, parcel: array{weight: float, height: float, width: float, length: float}}
     */
    public function getQuotes(array $destination, Collection $cartItems): array
    {
        $parcel = ParcelCalculator::fromCartItems($cartItems);

        $quotes = $this->skydropx->getQuotes($destination, $parcel);

        if (! empty($quotes)) {
            $quotes = array_map(fn (array $q) => [
                ...$q,
                'shipping_method_id' => null,
                'price' => $this->applyMarkup($q['price']),
            ], $quotes);

            return [
                'quotes' => $this->selectRepresentativeQuotes($quotes),
                'source' => 'skydropx',
                'parcel' => $parcel,
            ];
        }

        return $this->staticFallback($parcel);
    }

    /**
     * From all available quotes (sorted cheapest first), pick up to 3 that cover distinct roles:
     * cheapest, fastest, and best middle-ground. This avoids showing 9 options while remaining
     * resilient to carrier availability changes.
     *
     * @param  array<int, array<string, mixed>>  $quotes  Already sorted by price ascending
     * @return array<int, array<string, mixed>>
     */
    private function selectRepresentativeQuotes(array $quotes): array
    {
        if (count($quotes) <= 3) {
            return $quotes;
        }

        $cheapest = $quotes[0];

        $fastest = collect($quotes)
            ->sortBy([['estimated_days', 'asc'], ['price', 'asc']])
            ->first();

        $selected = collect([$cheapest, $fastest])->unique('quote_id');

        $usedIds = $selected->pluck('quote_id')->all();

        $middle = collect($quotes)
            ->filter(fn (array $q) => ! in_array($q['quote_id'], $usedIds, true))
            ->filter(fn (array $q) => $q['estimated_days'] !== $cheapest['estimated_days']
                || $q['estimated_days'] !== $fastest['estimated_days'])
            ->first();

        if ($middle) {
            $selected->push($middle);
        }

        return $selected
            ->sortBy('price')
            ->values()
            ->all();
    }

    /**
     * Add a flat handling fee and round up to the nearest $10 increment.
     */
    private function applyMarkup(float $price): float
    {
        return ceil(($price + 10) / 10) * 10;
    }

    /**
     * @param  array{weight: float, height: float, width: float, length: float}|null  $parcel
     * @return array{quotes: array<int, array<string, mixed>>, source: string, parcel: array{weight: float, height: float, width: float, length: float}}
     */
    private function staticFallback(?array $parcel = null): array
    {
        $methods = ShippingMethod::where('is_active', true)
            ->orderBy('cost')
            ->get();

        $quotes = $methods->map(fn (ShippingMethod $method) => [
            'carrier' => $method->name,
            'service' => $method->description ?? 'Envío estándar',
            'price' => (float) $method->cost,
            'estimated_days' => $method->estimated_delivery_days ?? 5,
            'quote_id' => "static_{$method->id}",
            'shipping_method_id' => $method->id,
        ])->all();

        return [
            'quotes' => $quotes,
            'source' => 'static',
            'parcel' => $parcel ?? config('shop.default_parcel'),
        ];
    }
}
