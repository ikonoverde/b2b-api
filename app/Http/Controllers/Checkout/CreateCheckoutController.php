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
     * Creates an order from the user's cart and generates a Stripe Checkout Session.
     * The client should redirect the user to the returned `checkout_url` to complete payment.
     *
     * @response 201 scenario="Success" {
     *   "checkout_url": "https://checkout.stripe.com/c/pay/cs_test_123",
     *   "data": {"id": 1, "user_id": 1, "status": "pending",
     *     "payment_status": "pending", "total_amount": 150.00,
     *     "shipping_cost": 10.00, "items": [], "created_at": "2024-01-15T10:30:00Z"}
     * }
     * @response 400 scenario="Empty cart" {"message": "Cart is empty"}
     * @response 422 scenario="Validation error" {
     *   "message": "The success url field is required.",
     *   "errors": {"success_url": ["The success url field is required."]}
     * }
     *
     * @authenticated
     */
    public function __invoke(CreateCheckoutRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $cart = Cart::with(['items.product.images' => fn ($query) => $query->orderBy('position')->limit(1)])
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
                    'image' => $product->images->first()?->image_path,
                ]);
            }

            $order->load(['items']);

            return $order;
        });

        $lineItems = $this->buildLineItems($cart, $shippingCost);

        $session = Cashier::stripe()->checkout->sessions->create([
            'mode' => 'payment',
            'line_items' => $lineItems,
            'success_url' => $validated['success_url'],
            'cancel_url' => $validated['cancel_url'],
            'metadata' => [
                'order_id' => $order->id,
                'user_id' => auth()->id(),
            ],
        ]);

        $order->update(['checkout_session_id' => $session->id]);

        return response()->json([
            'checkout_url' => $session->url,
            'data' => (new OrderResource($order))->resolve(),
        ], Response::HTTP_CREATED);
    }

    /**
     * Build Stripe line_items from cart items and shipping cost.
     *
     * @return array<int, array<string, mixed>>
     */
    private function buildLineItems(Cart $cart, float $shippingCost): array
    {
        $lineItems = [];

        foreach ($cart->items as $cartItem) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => ['name' => $cartItem->product->name],
                    'unit_amount' => (int) ($cartItem->unit_price * 100),
                ],
                'quantity' => $cartItem->quantity,
            ];
        }

        $lineItems[] = [
            'price_data' => [
                'currency' => 'usd',
                'product_data' => ['name' => 'Shipping'],
                'unit_amount' => (int) ($shippingCost * 100),
            ],
            'quantity' => 1,
        ];

        return $lineItems;
    }
}
