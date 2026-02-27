<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\VerifyCheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Order;
use App\Notifications\Order\OrderConfirmation;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Laravel\Cashier\Cashier;
use Symfony\Component\HttpFoundation\Response;

/**
 * @group Checkout
 */
class VerifyCheckoutController extends Controller
{
    /**
     * Verify Checkout Session
     *
     * Verifies the payment status of a Stripe Checkout Session and updates the order accordingly.
     * If the payment is complete, the order status is updated and the user's cart is cleared.
     *
     * @queryParam session_id string required The Stripe Checkout Session ID. Example: cs_test_abc123
     *
     * @response 200 scenario="Paid" {
     *   "status": "paid",
     *   "data": {"id": 1, "user_id": 1, "status": "pending",
     *     "payment_status": "completed", "total_amount": 150.00,
     *     "shipping_cost": 10.00, "items": [],
     *     "created_at": "2024-01-15T10:30:00Z"}
     * }
     * @response 200 scenario="Pending" {
     *   "status": "pending",
     *   "data": {"id": 1, "payment_status": "pending",
     *     "total_amount": 150.00, "items": []}
     * }
     * @response 404 scenario="Order not found" {
     *   "message": "Order not found for this checkout session"
     * }
     * @response 422 scenario="Validation error" {
     *   "message": "The session id field is required.",
     *   "errors": {"session_id": ["The session id field is required."]}
     * }
     *
     * @authenticated
     */
    public function __invoke(VerifyCheckoutRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $session = Cashier::stripe()->checkout->sessions->retrieve($validated['session_id']);

        $order = Order::where('checkout_session_id', $session->id)
            ->where('user_id', auth()->id())
            ->with(['items'])
            ->first();

        if (! $order) {
            return response()->json([
                'message' => 'Order not found for this checkout session',
            ], Response::HTTP_NOT_FOUND);
        }

        if ($session->payment_status !== 'paid' && $order->payment_status !== 'completed') {
            return response()->json([
                'status' => 'pending',
                'data' => (new OrderResource($order))->resolve(),
            ]);
        }

        if ($order->payment_status !== 'completed') {
            DB::transaction(function () use ($order, $session): void {
                $order->update([
                    'payment_status' => 'completed',
                    'payment_intent_id' => $session->payment_intent,
                ]);

                $cart = Cart::where('user_id', auth()->id())
                    ->where('status', 'active')
                    ->first();

                if ($cart) {
                    $cart->items()->delete();
                    $cart->update(['status' => 'completed']);
                }
            });

            // Send order confirmation email
            $order->user->notify(new OrderConfirmation($order));

            $order->refresh();
        }

        return response()->json([
            'status' => 'paid',
            'data' => (new OrderResource($order))->resolve(),
        ]);
    }
}
