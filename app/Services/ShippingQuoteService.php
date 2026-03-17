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
     * @return array{quotes: array<int, array<string, mixed>>, source: string}
     */
    public function getQuotes(array $destination, Collection $cartItems): array
    {
        $parcel = ParcelCalculator::fromCartItems($cartItems);

        $quotes = $this->skydropx->getQuotes($destination, $parcel);

        if (! empty($quotes)) {
            $quotes = array_map(fn (array $q) => [...$q, 'shipping_method_id' => null], $quotes);

            return [
                'quotes' => $quotes,
                'source' => 'skydropx',
            ];
        }

        return $this->staticFallback();
    }

    /**
     * @return array{quotes: array<int, array<string, mixed>>, source: string}
     */
    private function staticFallback(): array
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
        ];
    }
}
