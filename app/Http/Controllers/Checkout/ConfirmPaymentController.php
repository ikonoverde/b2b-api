<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\ConfirmPaymentRequest;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Laravel\Cashier\Cashier;
use Symfony\Component\HttpFoundation\Response;

/**
 * @group Checkout
 */
class ConfirmPaymentController extends Controller
{
    /**
     * Confirm Payment
     *
     * Confirms the Stripe payment, updates the order status, and clears the cart.
     *
     * @response 200 scenario="Success" {"data": {"id": 1, "user_id": 1, "status": "pending", "payment_status": "completed", "total_amount": 150.00, "shipping_cost": 10.00, "shipping_address": {"street": "123 Main St", "city": "Springfield", "state": "IL", "zip": "62701", "country": "USA"}, "items": [{"id": 1, "product_id": 1, "product_name": "Fertilizante Premium", "quantity": 2, "unit_price": 45.00, "subtotal": 90.00, "image": "products/fertilizer.jpg"}], "created_at": "2024-01-15T10:30:00Z"}}
     * @response 404 scenario="Order not found" {"message": "Order not found"}
     * @response 400 scenario="Payment failed" {"message": "Payment failed", "error": "Payment intent requires confirmation"}
     * @response 422 scenario="Validation error" {"message": "The order id field is required.", "errors": {"order_id": ["The order id field is required."]}}
     *
     * @authenticated
     */
    public function __invoke(ConfirmPaymentRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $order = Order::where('user_id', auth()->id())
            ->where('id', $validated['order_id'])
            ->with(['items'])
            ->first();

        if (! $order) {
            return response()->json([
                'message' => 'Order not found',
            ], Response::HTTP_NOT_FOUND);
        }

        if ($order->payment_status === 'completed') {
            return response()->json([
                'data' => (new OrderResource($order))->resolve(),
            ]);
        }

        $stripe = Cashier::stripe();
        $paymentIntent = $stripe->paymentIntents->retrieve($validated['payment_intent_id']);

        if ($paymentIntent->status !== 'succeeded' && $paymentIntent->status !== 'requires_capture') {
            return response()->json([
                'message' => 'Payment failed',
                'error' => "Payment intent status: {$paymentIntent->status}",
            ], Response::HTTP_BAD_REQUEST);
        }

        DB::transaction(function () use ($order, $validated) {
            $updateData = [
                'payment_status' => 'completed',
                'status' => 'pending',
            ];

            // If shipping address was collected by Stripe Elements and order doesn't have one yet
            if (isset($validated['shipping_address']) && $order->shipping_address === null) {
                $updateData['shipping_address'] = $validated['shipping_address'];
            }

            $order->update($updateData);

            $cart = Cart::where('user_id', auth()->id())
                ->where('status', 'active')
                ->first();

            if ($cart) {
                $cart->items()->delete();
                $cart->update(['status' => 'completed']);
            }
        });

        $order->refresh();

        return response()->json([
            'data' => (new OrderResource($order))->resolve(),
        ], Response::HTTP_OK);
    }
}
