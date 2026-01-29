<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use Illuminate\Http\JsonResponse;

/**
 * @group Cart
 *
 * APIs for cart management
 */
class GetCartController extends Controller
{
    /**
     * Get Cart
     *
     * Retrieve the current user's cart with all items.
     *
     * @response 200 scenario="Success" {"data": {"id": 1, "status": "active", "items": [{"id": 1, "product_id": 1, "product_name": "Fertilizante Premium", "quantity": 2, "unit_price": 45.00, "subtotal": 90.00}], "totals": {"subtotal": 90.00, "item_count": 1, "total_quantity": 2}}}
     * @response 200 scenario="Empty cart" {"data": {"id": 1, "status": "active", "items": [], "totals": {"subtotal": 0, "item_count": 0, "total_quantity": 0}}}
     *
     * @authenticated
     */
    public function __invoke(): JsonResponse
    {
        $cart = Cart::with(['items.product'])
            ->firstOrCreate(
                ['user_id' => auth()->id()],
                ['status' => 'active']
            );

        return response()->json(['data' => (new CartResource($cart))->resolve()]);
    }
}
