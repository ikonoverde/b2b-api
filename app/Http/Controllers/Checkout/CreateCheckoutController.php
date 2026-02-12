<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\CreateCheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Laravel\Cashier\Cashier;
use Symfony\Component\HttpFoundation\Response;

/**
 * @group Checkout
 */
class CreateCheckoutController extends Controller
{
    /**
     * Create Checkout Session
     *
     * Creates an order from the user's cart and generates a Stripe PaymentIntent.
     *
     * @response 201 scenario="Success" {"data": {"id": 1, "user_id": 1, "status": "pending", "payment_status": "pending", "total_amount": 150.00, "shipping_cost": 10.00, "shipping_address": {"street": "123 Main St", "city": "Springfield", "state": "IL", "zip": "62701", "country": "USA"}, "items": [{"id": 1, "product_id": 1, "product_name": "Fertilizante Premium", "quantity": 2, "unit_price": 45.00, "subtotal": 90.00, "image": "products/fertilizer.jpg"}], "created_at": "2024-01-15T10:30:00Z"}, "client_secret": "pi_123_secret_456", "publishable_key": "pk_test_123"}
     * @response 400 scenario="Empty cart" {"message": "Cart is empty"}
     * @response 422 scenario="Validation error" {"message": "The shipping address field is required.", "errors": {"shipping_address": ["The shipping address field is required."]}}
     *
     * @authenticated
     */
    public function __invoke(CreateCheckoutRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $cart = Cart::with(['items.product'])
            ->where('user_id', auth()->id())
            ->where('status', 'active')
            ->first();

        if (! $cart || $cart->items->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty',
            ], Response::HTTP_BAD_REQUEST);
        }

        $totals = $cart->calculateTotals();
        $shippingCost = config('shop.shipping_cost', 10.00);
        $totalAmount = $totals['subtotal'] + $shippingCost;

        $order = DB::transaction(function () use ($cart, $validated, $totalAmount, $shippingCost) {
            $order = Order::create([
                'user_id' => auth()->id(),
                'status' => 'pending',
                'payment_status' => 'pending',
                'total_amount' => $totalAmount,
                'shipping_cost' => $shippingCost,
                'shipping_address' => $validated['shipping_address'] ?? null,
            ]);

            foreach ($cart->items as $cartItem) {
                $product = $cartItem->product;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_name' => $product->name,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->unit_price,
                    'subtotal' => $cartItem->subtotal,
                    'image' => $product->image,
                ]);
            }

            $order->load(['items']);

            return $order;
        });

        $stripe = Cashier::stripe();
        $paymentIntent = $stripe->paymentIntents->create([
            'amount' => (int) ($totalAmount * 100),
            'currency' => 'usd',
            'metadata' => [
                'order_id' => $order->id,
                'user_id' => auth()->id(),
            ],
        ]);

        $order->update(['payment_intent_id' => $paymentIntent->id]);

        return response()->json([
            'data' => (new OrderResource($order))->resolve(),
            'client_secret' => $paymentIntent->client_secret,
            'publishable_key' => config('cashier.key'),
        ], Response::HTTP_CREATED);
    }
}
