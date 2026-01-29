<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * @group Cart
 */
class UpdateCartItemController extends Controller
{
    /**
     * Update Cart Item
     *
     * Update the quantity of a cart item.
     *
     * @urlParam item required The ID of the cart item. Example: 1
     *
     * @response 200 scenario="Success" {"data": {"id": 1, "status": "active", "items": [{"id": 1, "product_id": 1, "product_name": "Fertilizante Premium", "quantity": 5, "unit_price": 45.00, "subtotal": 225.00}], "totals": {"subtotal": 225.00, "item_count": 1, "total_quantity": 5}}}
     * @response 403 scenario="Not user's item" {"message": "This item does not belong to your cart"}
     * @response 422 scenario="Insufficient stock" {"message": "Not enough stock available", "errors": {"quantity": ["Only 5 items available in stock"]}}
     *
     * @authenticated
     */
    public function __invoke(UpdateCartItemRequest $request, CartItem $item): JsonResponse
    {
        $cart = Cart::where('user_id', auth()->id())->first();

        if (! $cart || $item->cart_id !== $cart->id) {
            return response()->json([
                'message' => 'This item does not belong to your cart',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validated();
        $product = $item->product;

        if ($product->stock < $validated['quantity']) {
            return response()->json([
                'message' => 'Not enough stock available',
                'errors' => [
                    'quantity' => ["Only {$product->stock} items available in stock"],
                ],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $item->update(['quantity' => $validated['quantity']]);
        $cart->load(['items.product']);

        return response()->json(['data' => (new CartResource($cart))->resolve()]);
    }
}
