<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddCartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * @group Cart
 */
class AddCartItemController extends Controller
{
    /**
     * Add Item to Cart
     *
     * Add a product to the user's cart. Creates cart if it doesn't exist.
     *
     * @response 201 scenario="Success" {"data": {"id": 1, "status": "active", "items": [{"id": 1, "product_id": 1, "product_name": "Fertilizante Premium", "quantity": 2, "unit_price": 45.00, "subtotal": 90.00}], "totals": {"subtotal": 90.00, "item_count": 1, "total_quantity": 2}}}
     * @response 422 scenario="Insufficient stock" {"message": "Not enough stock available", "errors": {"quantity": ["Only 5 items available in stock"]}}
     *
     * @authenticated
     */
    public function __invoke(AddCartItemRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $product = Product::findOrFail($validated['product_id']);

        if ($product->stock < $validated['quantity']) {
            return response()->json([
                'message' => 'Not enough stock available',
                'errors' => [
                    'quantity' => ["Only {$product->stock} items available in stock"],
                ],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $cart = Cart::firstOrCreate(
            ['user_id' => auth()->id()],
            ['status' => 'active']
        );

        $cartItem = CartItem::updateOrCreate(
            [
                'cart_id' => $cart->id,
                'product_id' => $product->id,
            ],
            [
                'quantity' => $validated['quantity'],
                'unit_price' => $product->price,
            ]
        );

        $cart->load(['items.product']);

        return response()->json(['data' => (new CartResource($cart))->resolve()], Response::HTTP_CREATED);
    }
}
