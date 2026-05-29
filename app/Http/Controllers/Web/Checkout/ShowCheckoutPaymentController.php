<?php

namespace App\Http\Controllers\Web\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Controllers\PaymentMethods\PaymentMethodData;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Cashier;

class ShowCheckoutPaymentController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $order = Order::where('id', $request->query('order'))
            ->where('user_id', $request->user()->id)
            ->where('status', 'payment_pending')
            ->with('items')
            ->firstOrFail();

        $user = $request->user();
        $paymentIntent = $this->paymentIntentFor($order, $user);

        return Inertia::render('Checkout/Payment', [
            'order' => [
                'id' => $order->id,
                'total_amount' => (float) $order->total_amount,
                'shipping_cost' => (float) $order->shipping_cost,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'subtotal' => (float) $item->subtotal,
                    'image' => $item->image,
                ]),
            ],
            'client_secret' => $paymentIntent->client_secret,
            'stripe_key' => config('cashier.key'),
            'payment_methods' => $this->savedPaymentMethodsFor($user),
        ]);
    }

    private function paymentIntentFor(Order $order, User $user): object
    {
        $paymentIntent = Cashier::stripe()->paymentIntents->retrieve($order->payment_intent_id);

        if ($user->stripe_id && blank($paymentIntent->customer ?? null)) {
            return Cashier::stripe()->paymentIntents->update($order->payment_intent_id, [
                'customer' => $user->stripe_id,
            ]);
        }

        return $paymentIntent;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function savedPaymentMethodsFor(User $user): array
    {
        if (! $user->stripe_id) {
            return [];
        }

        try {
            $default = $user->defaultPaymentMethod();

            return $user->paymentMethods()
                ->map(fn ($method) => [
                    ...PaymentMethodData::fromStripe($method),
                    'is_default' => $default && $default->id === $method->id,
                ])
                ->all();
        } catch (\Exception $e) {
            Log::error('Error loading payment methods for checkout', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }
}
