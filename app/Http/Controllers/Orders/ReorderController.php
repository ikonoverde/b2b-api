<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * @group Orders
 *
 * APIs for order management
 */
class ReorderController extends Controller
{
    /**
     * Reorder
     *
     * Re-add all items from a previous order to the user's cart. Validates stock
     * availability, detects price changes, and returns a consolidated response.
     *
     * @urlParam order required The ID of the order to reorder. Example: 1
     *
     * @response 200 scenario="Success" {
     *   "data": {
     *     "added": [{"product_id": 1, "product_name": "Fertilizante Premium", "quantity": 2, "unit_price": 50.00}],
     *     "unavailable": [],
     *     "price_changes": []
     *   }
     * }
     * @response 200 scenario="Partial availability" {
     *   "data": {
     *     "added": [{"product_id": 1, "product_name": "Fertilizante Premium", "quantity": 2, "unit_price": 50.00}],
     *     "unavailable": [{"product_id": 5, "product_name": "Discontinued", "reason": "product_unavailable"}],
     *     "price_changes": [{"product_id": 1, "original_price": 45.00, "current_price": 50.00}]
     *   }
     * }
     * @response 403 scenario="Order belongs to different user" {"message": "Forbidden"}
     * @response 404 scenario="Order not found" {"message": "Order not found"}
     *
     * @authenticated
     */
    public function __invoke(Order $order): JsonResponse
    {
        if ($order->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Forbidden',
            ], Response::HTTP_FORBIDDEN);
        }

        $order->load(['items.product']);

        $added = [];
        $unavailable = [];
        $priceChanges = [];

        $cart = Cart::firstOrCreate(
            ['user_id' => auth()->id(), 'status' => 'active'],
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

        return response()->json([
            'data' => [
                'added' => $added,
                'unavailable' => $unavailable,
                'price_changes' => $priceChanges,
            ],
        ]);
    }
}
