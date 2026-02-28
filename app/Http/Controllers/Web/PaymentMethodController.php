<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

/**
 * @group Payment Methods
 *
 * Manage saved Stripe payment methods for authenticated users.
 */
class PaymentMethodController extends Controller
{
    /**
     * List saved payment methods
     *
     * Returns a list of all saved payment methods for the authenticated user.
     * Includes card details (brand, last 4 digits, expiration date) and indicates
     * which method is the default.
     *
     * @authenticated
     *
     * @response scenario="Success" [
     *   {
     *     "id": "pm_1234567890",
     *     "type": "card",
     *     "card": {
     *       "brand": "visa",
     *       "last4": "4242",
     *       "exp_month": 12,
     *       "exp_year": 2025
     *     },
     *     "is_default": true
     *   }
     * ]
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        try {
            // Ensure customer exists in Stripe
            if (! $user->stripe_id) {
                $user->createAsStripeCustomer();
            }

            $paymentMethods = $user->paymentMethods();
            $defaultPaymentMethod = $user->defaultPaymentMethod();

            $formattedMethods = $paymentMethods->map(function ($method) use ($defaultPaymentMethod) {
                return [
                    'id' => $method->id,
                    'type' => $method->type,
                    'card' => [
                        'brand' => $method->card->brand,
                        'last4' => $method->card->last4,
                        'exp_month' => $method->card->exp_month,
                        'exp_year' => $method->card->exp_year,
                    ],
                    'is_default' => $defaultPaymentMethod && $defaultPaymentMethod->id === $method->id,
                ];
            });

            return response()->json([
                'payment_methods' => $formattedMethods,
                'has_default' => $defaultPaymentMethod !== null,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching payment methods', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Error al obtener los métodos de pago.',
                'payment_methods' => [],
                'has_default' => false,
            ], 500);
        }
    }

    /**
     * Add a new payment method
     *
     * Adds a new payment method to the user's account using a Stripe PaymentMethod ID
     * obtained via Stripe Elements on the frontend. The payment method is attached to
     * the user's Stripe customer account.
     *
     * @authenticated
     *
     * @bodyParam payment_method_id string required The Stripe PaymentMethod ID obtained from Stripe Elements. Example: pm_1234567890
     * @bodyParam set_as_default boolean Whether to set this as the default payment method. Example: true
     *
     * @response scenario="Success created" {
     *   "message": "Método de pago agregado exitosamente.",
     *   "payment_method": {
     *     "id": "pm_1234567890",
     *     "type": "card",
     *     "card": {
     *       "brand": "visa",
     *       "last4": "4242",
     *       "exp_month": 12,
     *       "exp_year": 2025
     *     },
     *     "is_default": true
     *   }
     * }
     * @response status=422 scenario="Validation error" {
     *   "message": "El ID del método de pago es requerido."
     * }
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_method_id' => 'required|string',
            'set_as_default' => 'boolean',
        ]);

        $user = $request->user();

        try {
            // Ensure customer exists in Stripe
            if (! $user->stripe_id) {
                $user->createAsStripeCustomer();
            }

            // Add the payment method
            $paymentMethod = $user->addPaymentMethod($validated['payment_method_id']);

            // Set as default if requested or if it's the first payment method
            if ($validated['set_as_default'] ?? true) {
                $user->updateDefaultPaymentMethod($validated['payment_method_id']);
            }

            $isDefault = $user->defaultPaymentMethod()?->id === $paymentMethod->id;

            return response()->json([
                'message' => 'Método de pago agregado exitosamente.',
                'payment_method' => [
                    'id' => $paymentMethod->id,
                    'type' => $paymentMethod->type,
                    'card' => [
                        'brand' => $paymentMethod->card->brand,
                        'last4' => $paymentMethod->card->last4,
                        'exp_month' => $paymentMethod->card->exp_month,
                        'exp_year' => $paymentMethod->card->exp_year,
                    ],
                    'is_default' => $isDefault,
                ],
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error adding payment method', [
                'user_id' => $user->id,
                'payment_method_id' => $validated['payment_method_id'],
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Error al agregar el método de pago. Por favor, verifique los datos de la tarjeta.',
            ], 422);
        }
    }

    /**
     * Remove a payment method
     *
     * Deletes a saved payment method from the user's account. Cannot delete the
     * default payment method unless it's the only one remaining.
     *
     * @authenticated
     *
     * @urlParam payment_method string required The Stripe PaymentMethod ID. Example: pm_1234567890
     *
     * @response scenario="Success deleted" {
     *   "message": "Método de pago eliminado exitosamente."
     * }
     * @response status=400 scenario="Cannot delete default" {
     *   "message": "No se puede eliminar el método de pago predeterminado. Establezca otro método como predeterminado primero."
     * }
     * @response status=404 scenario="Not found" {
     *   "message": "Método de pago no encontrado."
     * }
     */
    public function destroy(Request $request, string $paymentMethodId): JsonResponse
    {
        $user = $request->user();

        try {
            $paymentMethod = $user->findPaymentMethod($paymentMethodId);

            if (! $paymentMethod) {
                return response()->json([
                    'message' => 'Método de pago no encontrado.',
                ], 404);
            }

            $defaultPaymentMethod = $user->defaultPaymentMethod();

            // Check if trying to delete the default payment method
            if ($defaultPaymentMethod && $defaultPaymentMethod->id === $paymentMethodId) {
                // Check if there are other payment methods
                $allMethods = $user->paymentMethods();
                if ($allMethods->count() > 1) {
                    return response()->json([
                        'message' => 'No se puede eliminar el método de pago predeterminado. Establezca otro método como predeterminado primero.',
                    ], 400);
                }
            }

            $user->removePaymentMethod($paymentMethodId);

            return response()->json([
                'message' => 'Método de pago eliminado exitosamente.',
            ]);
        } catch (\Exception $e) {
            Log::error('Error removing payment method', [
                'user_id' => $user->id,
                'payment_method_id' => $paymentMethodId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Error al eliminar el método de pago.',
            ], 500);
        }
    }

    /**
     * Set default payment method
     *
     * Sets the specified payment method as the default for the user's account.
     * The default payment method is used for future invoices and subscriptions.
     *
     * @authenticated
     *
     * @urlParam payment_method string required The Stripe PaymentMethod ID. Example: pm_1234567890
     *
     * @response scenario="Success" {
     *   "message": "Método de pago predeterminado actualizado exitosamente."
     * }
     * @response status=404 scenario="Not found" {
     *   "message": "Método de pago no encontrado."
     * }
     */
    public function setDefault(Request $request, string $paymentMethodId): JsonResponse
    {
        $user = $request->user();

        try {
            $paymentMethod = $user->findPaymentMethod($paymentMethodId);

            if (! $paymentMethod) {
                return response()->json([
                    'message' => 'Método de pago no encontrado.',
                ], 404);
            }

            $user->updateDefaultPaymentMethod($paymentMethodId);

            return response()->json([
                'message' => 'Método de pago predeterminado actualizado exitosamente.',
            ]);
        } catch (\Exception $e) {
            Log::error('Error setting default payment method', [
                'user_id' => $user->id,
                'payment_method_id' => $paymentMethodId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Error al establecer el método de pago predeterminado.',
            ], 500);
        }
    }

    /**
     * Get Stripe publishable key
     *
     * Returns the Stripe publishable key needed to initialize Stripe Elements
     * on the frontend for securely collecting card information.
     *
     * @authenticated
     *
     * @response scenario="Success" {
     *   "key": "pk_test_1234567890"
     * }
     */
    public function getStripeKey(): JsonResponse
    {
        $key = config('cashier.key');

        if (! $key) {
            return response()->json([
                'message' => 'Configuración de Stripe no disponible.',
            ], 500);
        }

        return response()->json([
            'key' => $key,
        ]);
    }

    /**
     * Show the payment methods management page
     *
     * Renders the Inertia page for managing saved payment methods.
     * Provides the Stripe publishable key for initializing Stripe Elements.
     *
     * @authenticated
     */
    public function show(Request $request): Response
    {
        return Inertia::render('PaymentMethods', [
            'stripe_key' => config('cashier.key'),
        ]);
    }
}
