<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * @group Cart
 */
class RemoveCartItemController extends Controller
{
    /**
     * Remove Cart Item
     *
     * Remove an item from the cart.
     *
     * @urlParam item required The ID of the cart item. Example: 1
     *
     * @response 200 scenario="Success" {"data": {"id": 1, "status": "active", "items": [], "totals": {"subtotal": 0, "item_count": 0, "total_quantity": 0}}}
     * @response 403 scenario="Not user's item" {"message": "This item does not belong to your cart"}
     *
     * @authenticated
     */
    public function __invoke(CartItem $item): JsonResponse
    {
        $cart = Cart::where('user_id', auth()->id())->first();

        if (! $cart || $item->cart_id !== $cart->id) {
            return response()->json([
                'message' => 'This item does not belong to your cart',
            ], Response::HTTP_FORBIDDEN);
        }

        $item->delete();
        $cart->load(['items.product']);

        return response()->json(['data' => (new CartResource($cart))->resolve()]);
    }
}
