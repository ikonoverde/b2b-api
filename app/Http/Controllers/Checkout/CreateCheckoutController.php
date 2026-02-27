<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\CreateCheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShippingMethod;
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
     *     "shipping_cost": 10.00, "shipping_method_id": 1,
     *     "items": [], "created_at": "2024-01-15T10:30:00Z"}
     * }
     * @response 400 scenario="Empty cart" {"message": "Cart is empty"}
     * @response 422 scenario="Insufficient stock" {
     *   "message": "Some items in your cart exceed available stock.",
     *   "errors": {"items": {"1": "Only 5 units available (requested 10)."}}
     * }
     * @response 422 scenario="Inactive shipping method" {
     *   "message": "The selected shipping method is no longer available."
     * }
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

        $stockErrors = $this->validateStock($cart);

        if ($stockErrors instanceof JsonResponse) {
            return $stockErrors;
        }

        $shippingResult = $this->resolveShipping($validated);

        if ($shippingResult instanceof JsonResponse) {
            return $shippingResult;
        }

        $totals = $cart->calculateTotals();
        $totalAmount = $totals['subtotal'] + $shippingResult['cost'];

        $order = $this->createOrder($cart, $validated, $totalAmount, $shippingResult);
        $lineItems = $this->buildLineItems($cart, $shippingResult);

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
     * Resolve the shipping method and cost from validated request data.
     *
     * @param  array<string, mixed>  $validated
     * @return array{method_id: ?int, cost: float, label: string}|JsonResponse
     */
    private function resolveShipping(array $validated): array|JsonResponse
    {
        if (empty($validated['shipping_method_id'])) {
            return ['method_id' => null, 'cost' => (float) config('shop.shipping_cost', 10.00), 'label' => 'Shipping'];
        }

        $method = ShippingMethod::query()
            ->where('id', $validated['shipping_method_id'])
            ->where('is_active', true)
            ->first();

        if (! $method) {
            return response()->json([
                'message' => 'The selected shipping method is no longer available.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return ['method_id' => $method->id, 'cost' => (float) $method->cost, 'label' => "Shipping ({$method->name})"];
    }

    /**
     * Validate that all cart items have sufficient stock.
     */
    private function validateStock(Cart $cart): ?JsonResponse
    {
        $errors = [];

        foreach ($cart->items as $item) {
            if ($item->product->stock < $item->quantity) {
                $stock = $item->product->stock;
                $qty = $item->quantity;
                $errors[$item->product_id] = "Only {$stock} units available (requested {$qty}).";
            }
        }

        if (empty($errors)) {
            return null;
        }

        return response()->json([
            'message' => 'Some items in your cart exceed available stock.',
            'errors' => ['items' => $errors],
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * Create the order and its items within a transaction.
     *
     * @param  array<string, mixed>  $validated
     * @param  array{method_id: ?int, cost: float, label: string}  $shipping
     */
    private function createOrder(Cart $cart, array $validated, float $totalAmount, array $shipping): Order
    {
        return DB::transaction(function () use ($cart, $validated, $totalAmount, $shipping) {
            $order = Order::create([
                'user_id' => auth()->id(),
                'status' => 'pending',
                'payment_status' => 'pending',
                'total_amount' => $totalAmount,
                'shipping_cost' => $shipping['cost'],
                'shipping_method_id' => $shipping['method_id'],
                'shipping_address' => $validated['shipping_address'] ?? null,
            ]);

            foreach ($cart->items as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_name' => $cartItem->product->name,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->unit_price,
                    'subtotal' => $cartItem->subtotal,
                    'image' => $cartItem->product->images->first()?->image_path,
                ]);
            }

            return $order->load(['items']);
        });
    }

    /**
     * Build Stripe line_items from cart items and shipping.
     *
     * @param  array{method_id: ?int, cost: float, label: string}  $shipping
     * @return array<int, array<string, mixed>>
     */
    private function buildLineItems(Cart $cart, array $shipping): array
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
                'product_data' => ['name' => $shipping['label']],
                'unit_amount' => (int) ($shipping['cost'] * 100),
            ],
            'quantity' => 1,
        ];

        return $lineItems;
    }
}
