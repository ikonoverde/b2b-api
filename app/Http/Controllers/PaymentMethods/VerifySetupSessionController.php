<?php

namespace App\Http\Controllers\PaymentMethods;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentMethods\VerifySetupSessionRequest;
use Illuminate\Http\JsonResponse;
use Laravel\Cashier\Cashier;
use Symfony\Component\HttpFoundation\Response;

/**
 * @group Payment Methods
 */
class VerifySetupSessionController extends Controller
{
    /**
     * Verify Setup Session
     *
     * Retrieves the Stripe Checkout Session created in setup mode and returns
     * the newly added payment method details so the mobile app can confirm.
     *
     * @authenticated
     *
     * @response 200 scenario="Success" {
     *   "status": "complete",
     *   "payment_method": {
     *     "id": "pm_1234567890",
     *     "type": "card",
     *     "card": {
     *       "brand": "visa",
     *       "last4": "4242",
     *       "exp_month": 12,
     *       "exp_year": 2025
     *     }
     *   }
     * }
     * @response 200 scenario="Pending" {
     *   "status": "pending",
     *   "payment_method": null
     * }
     * @response 403 scenario="Session belongs to another customer" {
     *   "message": "This session does not belong to your account."
     * }
     * @response 422 scenario="Validation error" {
     *   "message": "The session id field is required.",
     *   "errors": {"session_id": ["The session id field is required."]}
     * }
     */
    public function __invoke(VerifySetupSessionRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $stripe = Cashier::stripe();
        $session = $stripe->checkout->sessions->retrieve($validated['session_id']);

        if ($session->customer !== $request->user()->stripe_id) {
            return response()->json([
                'message' => 'This session does not belong to your account.',
            ], Response::HTTP_FORBIDDEN);
        }

        if ($session->status !== 'complete') {
            return response()->json([
                'status' => $session->status,
                'payment_method' => null,
            ]);
        }

        $setupIntent = $stripe->setupIntents->retrieve($session->setup_intent);
        $paymentMethod = $stripe->paymentMethods->retrieve($setupIntent->payment_method);

        return response()->json([
            'status' => 'complete',
            'payment_method' => PaymentMethodData::fromStripe($paymentMethod),
        ]);
    }
}
