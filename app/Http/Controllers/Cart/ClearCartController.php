<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use Illuminate\Http\JsonResponse;

/**
 * @group Cart
 */
class ClearCartController extends Controller
{
    /**
     * Clear Cart
     *
     * Remove all items from the cart.
     *
     * @response 200 scenario="Success" {"data": {"id": 1, "status": "active", "items": [], "totals": {"subtotal": 0, "item_count": 0, "total_quantity": 0}}}
     *
     * @authenticated
     */
    public function __invoke(): JsonResponse
    {
        $cart = Cart::where('user_id', auth()->id())->first();

        if ($cart) {
            $cart->items()->delete();
            $cart->load(['items.product']);
        }

        return response()->json(['data' => (new CartResource($cart ?? new Cart(['user_id' => auth()->id(), 'status' => 'active'])))->resolve()]);
    }
}
