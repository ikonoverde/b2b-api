<?php

namespace App\Http\Controllers\PaymentMethods;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentMethods\CreateSetupSessionRequest;
use Illuminate\Http\JsonResponse;
use Laravel\Cashier\Cashier;

/**
 * @group Payment Methods
 */
class CreateSetupSessionController extends Controller
{
    /**
     * Create Setup Session
     *
     * Creates a Stripe Checkout Session in setup mode so the user can add a new
     * payment method via Stripe's hosted page. The client should redirect the
     * user to the returned `checkout_url`.
     *
     * @authenticated
     *
     * @response 200 scenario="Success" {
     *   "checkout_url": "https://checkout.stripe.com/c/setup/cs_test_123"
     * }
     * @response 422 scenario="Validation error" {
     *   "message": "The success url field is required.",
     *   "errors": {"success_url": ["The success url field is required."]}
     * }
     */
    public function __invoke(CreateSetupSessionRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        if (! $user->stripe_id) {
            $user->createAsStripeCustomer();
        }

        $session = Cashier::stripe()->checkout->sessions->create([
            'mode' => 'setup',
            'customer' => $user->stripe_id,
            'payment_method_types' => ['card'],
            'success_url' => $validated['success_url'],
            'cancel_url' => $validated['cancel_url'],
        ]);

        return response()->json([
            'checkout_url' => $session->url,
        ]);
    }
}
