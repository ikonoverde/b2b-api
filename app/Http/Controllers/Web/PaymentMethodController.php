<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentMethods\StorePaymentMethodRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
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
    private const NOT_FOUND_MSG = 'Método de pago no encontrado.';

    /**
     * List saved payment methods
     *
     * Returns a list of all saved payment methods for the authenticated user.
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
            if (! $user->stripe_id) {
                $user->createAsStripeCustomer();
            }

            $paymentMethods = $user->paymentMethods();
            $default = $user->defaultPaymentMethod();

            return response()->json([
                'payment_methods' => $this->formatMethods($paymentMethods, $default),
                'has_default' => $default !== null,
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
     * obtained via Stripe Elements on the frontend.
     *
     * @authenticated
     *
     * @bodyParam payment_method_id string required The Stripe PaymentMethod ID. Example: pm_1234567890
     * @bodyParam set_as_default boolean Whether to set this as the default. Example: true
     */
    public function store(StorePaymentMethodRequest $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        try {
            if (! $user->stripe_id) {
                $user->createAsStripeCustomer();
            }

            $paymentMethod = $user->addPaymentMethod($validated['payment_method_id']);

            if ($validated['set_as_default'] ?? true) {
                $user->updateDefaultPaymentMethod($validated['payment_method_id']);
            }

            $message = 'Método de pago agregado exitosamente.';

            if ($request->expectsJson()) {
                $isDefault = $user->defaultPaymentMethod()?->id === $paymentMethod->id;

                return response()->json([
                    'message' => $message,
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
            }

            return back()->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Error adding payment method', [
                'user_id' => $user->id,
                'payment_method_id' => $validated['payment_method_id'],
                'error' => $e->getMessage(),
            ]);

            $errorMsg = 'Error al agregar el método de pago.';

            return $request->expectsJson()
                ? response()->json(['message' => $errorMsg], 422)
                : back()->with('error', $errorMsg);
        }
    }

    /**
     * Remove a payment method
     *
     * @authenticated
     *
     * @urlParam payment_method string required The Stripe PaymentMethod ID. Example: pm_1234567890
     */
    public function destroy(Request $request, string $paymentMethodId): JsonResponse|RedirectResponse
    {
        $user = $request->user();

        try {
            $error = $this->validateDeletion($user, $paymentMethodId);

            if ($error) {
                return $this->respond($request, $error['message'], 'error', $error['status']);
            }

            $user->removePaymentMethod($paymentMethodId);

            return $this->respond($request, 'Método de pago eliminado exitosamente.');
        } catch (\Exception $e) {
            Log::error('Error removing payment method', [
                'user_id' => $user->id,
                'payment_method_id' => $paymentMethodId,
                'error' => $e->getMessage(),
            ]);

            return $this->respond($request, 'Error al eliminar el método de pago.', 'error', 500);
        }
    }

    /**
     * Validate that a payment method can be deleted.
     *
     * @return array{message: string, status: int}|null
     */
    private function validateDeletion(\App\Models\User $user, string $paymentMethodId): ?array
    {
        $paymentMethod = $user->findPaymentMethod($paymentMethodId);

        if (! $paymentMethod) {
            return ['message' => self::NOT_FOUND_MSG, 'status' => 404];
        }

        $default = $user->defaultPaymentMethod();
        $isDefault = $default && $default->id === $paymentMethodId;

        if ($isDefault && $user->paymentMethods()->count() > 1) {
            return [
                'message' => 'No se puede eliminar el método de pago predeterminado. '
                    .'Establezca otro método como predeterminado primero.',
                'status' => 400,
            ];
        }

        return null;
    }

    /**
     * Set default payment method
     *
     * @authenticated
     *
     * @urlParam payment_method string required The Stripe PaymentMethod ID. Example: pm_1234567890
     */
    public function setDefault(Request $request, string $paymentMethodId): JsonResponse|RedirectResponse
    {
        $user = $request->user();

        try {
            $paymentMethod = $user->findPaymentMethod($paymentMethodId);

            if (! $paymentMethod) {
                return $this->respond($request, self::NOT_FOUND_MSG, 'error', 404);
            }

            $user->updateDefaultPaymentMethod($paymentMethodId);

            return $this->respond(
                $request,
                'Método de pago predeterminado actualizado exitosamente.',
            );
        } catch (\Exception $e) {
            Log::error('Error setting default payment method', [
                'user_id' => $user->id,
                'payment_method_id' => $paymentMethodId,
                'error' => $e->getMessage(),
            ]);

            return $this->respond(
                $request,
                'Error al establecer el método de pago predeterminado.',
                'error',
                500,
            );
        }
    }

    /**
     * Get Stripe publishable key
     *
     * @authenticated
     */
    public function getStripeKey(): JsonResponse
    {
        $key = config('cashier.key');

        if (! $key) {
            return response()->json([
                'message' => 'Configuración de Stripe no disponible.',
            ], 500);
        }

        return response()->json(['key' => $key]);
    }

    /**
     * Show the payment methods management page
     *
     * @authenticated
     */
    public function show(Request $request): Response
    {
        $user = $request->user();
        $paymentMethods = [];

        try {
            if ($user->stripe_id) {
                $paymentMethods = $this->formatMethods(
                    $user->paymentMethods(),
                    $user->defaultPaymentMethod(),
                );
            }
        } catch (\Exception $e) {
            Log::error('Error loading payment methods for page', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }

        return Inertia::render('PaymentMethods', [
            'stripe_key' => config('cashier.key'),
            'payment_methods' => $paymentMethods,
        ]);
    }

    /**
     * Return a JSON or redirect response depending on the request type.
     */
    private function respond(
        Request $request,
        string $message,
        string $flashType = 'success',
        int $statusCode = 200,
    ): JsonResponse|RedirectResponse {
        if ($request->expectsJson()) {
            return response()->json(['message' => $message], $statusCode);
        }

        return back()->with($flashType, $message);
    }

    /**
     * @param  \Illuminate\Support\Collection  $methods
     * @return array<int, array<string, mixed>>
     */
    private function formatMethods($methods, $default): array
    {
        return $methods->map(function ($method) use ($default) {
            return [
                'id' => $method->id,
                'type' => $method->type,
                'card' => [
                    'brand' => $method->card->brand,
                    'last4' => $method->card->last4,
                    'exp_month' => $method->card->exp_month,
                    'exp_year' => $method->card->exp_year,
                ],
                'is_default' => $default && $default->id === $method->id,
            ];
        })->all();
    }
}
