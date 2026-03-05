<?php

namespace App\Actions;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;

class ReorderAction
{
    /**
     * @return array{
     *     added: list<array<string, mixed>>,
     *     unavailable: list<array<string, mixed>>,
     *     price_changes: list<array<string, mixed>>
     * }
     */
    public function execute(Order $order): array
    {
        $order->load(['items.product']);

        $added = [];
        $unavailable = [];
        $priceChanges = [];

        $cart = Cart::firstOrCreate(
            ['user_id' => $order->user_id, 'status' => 'active'],
        );

        foreach ($order->items as $item) {
            $product = $item->product;

            if (! $product || ! $product->is_active) {
                $unavailable[] = [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product_name,
                    'reason' => 'product_unavailable',
                ];

                continue;
            }

            if ($product->stock < $item->quantity) {
                $unavailable[] = [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product_name,
                    'reason' => 'out_of_stock',
                ];

                continue;
            }

            CartItem::updateOrCreate(
                [
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                ],
                [
                    'quantity' => $item->quantity,
                    'unit_price' => $product->price,
                ]
            );

            $added[] = [
                'product_id' => $product->id,
                'product_name' => $item->product_name,
                'quantity' => $item->quantity,
                'unit_price' => (float) $product->price,
            ];

            if ((float) $product->price !== (float) $item->unit_price) {
                $priceChanges[] = [
                    'product_id' => $product->id,
                    'product_name' => $item->product_name,
                    'original_price' => (float) $item->unit_price,
                    'current_price' => (float) $product->price,
                ];
            }
        }

        return [
            'added' => $added,
            'unavailable' => $unavailable,
            'price_changes' => $priceChanges,
        ];
    }
}
