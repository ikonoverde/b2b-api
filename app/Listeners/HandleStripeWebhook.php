<?php

namespace App\Listeners;

use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\DB;
use Laravel\Cashier\Cashier;
use Laravel\Cashier\Events\WebhookReceived;

class HandleStripeWebhook implements ShouldQueue
{
    public function handle(WebhookReceived $event): void
    {
        $payload = $event->payload;
        $type = $payload['type'] ?? null;

        match ($type) {
            'checkout.session.completed' => $this->handleCheckoutCompleted($payload),
            'checkout.session.expired' => $this->handleCheckoutExpired($payload),
            'payment_intent.succeeded' => $this->handlePaymentIntentSucceeded($payload),
            'charge.refunded' => $this->handleChargeRefunded($payload),
            default => null,
        };
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function handleCheckoutCompleted(array $payload): void
    {
        $session = $payload['data']['object'] ?? [];

        if (($session['mode'] ?? 'payment') === 'setup') {
            $this->handleSetupCompleted($session);

            return;
        }

        $order = $this->findPendingOrder($session['metadata'] ?? []);

        if (! $order) {
            return;
        }

        $paymentIntentId = $session['payment_intent'] ?? null;

        $this->fulfillOrder($order, (int) $order->user_id, $paymentIntentId);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function handlePaymentIntentSucceeded(array $payload): void
    {
        $paymentIntent = $payload['data']['object'] ?? [];
        $order = $this->findPendingOrder($paymentIntent['metadata'] ?? []);

        if (! $order || $order->payment_intent_id !== ($paymentIntent['id'] ?? null)) {
            return;
        }

        $this->fulfillOrder($order, (int) $order->user_id);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function handleCheckoutExpired(array $payload): void
    {
        $order = $this->findOrderByMetadata($payload['data']['object']['metadata'] ?? []);

        if (! $order || $order->payment_status !== 'pending') {
            return;
        }

        $order->update([
            'payment_status' => 'failed',
            'status' => 'cancelled',
        ]);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function handleChargeRefunded(array $payload): void
    {
        $paymentIntentId = $payload['data']['object']['payment_intent'] ?? null;

        if (! $paymentIntentId) {
            return;
        }

        $order = Order::where('payment_intent_id', $paymentIntentId)->first();

        if (! $order || $order->payment_status !== 'completed') {
            return;
        }

        DB::transaction(function () use ($order): void {
            $order->load('items.product');

            foreach ($order->items as $item) {
                $item->product->restoreStock($item->quantity);
            }

            $order->update(['payment_status' => 'refunded']);
        });
    }

    /**
     * @param  array<string, mixed>  $session
     */
    private function handleSetupCompleted(array $session): void
    {
        $customerId = $session['customer'] ?? null;
        $setupIntentId = $session['setup_intent'] ?? null;

        if (! $customerId || ! $setupIntentId) {
            return;
        }

        $user = User::where('stripe_id', $customerId)->first();

        if (! $user) {
            return;
        }

        $stripe = Cashier::stripe();
        $setupIntent = $stripe->setupIntents->retrieve($setupIntentId);
        $paymentMethodId = $setupIntent->payment_method;

        $stripe->paymentMethods->attach($paymentMethodId, [
            'customer' => $customerId,
        ]);

        $stripe->customers->update($customerId, [
            'invoice_settings' => ['default_payment_method' => $paymentMethodId],
        ]);
    }

    /**
     * Find a pending order by metadata, returning null if not found or already completed.
     *
     * @param  array<string, mixed>  $metadata
     */
    private function findPendingOrder(array $metadata): ?Order
    {
        $order = $this->findOrderByMetadata($metadata);

        if (! $order || $order->payment_status === 'completed') {
            return null;
        }

        return $order;
    }

    /**
     * @param  array<string, mixed>  $metadata
     */
    private function findOrderByMetadata(array $metadata): ?Order
    {
        $orderId = $metadata['order_id'] ?? null;
        $userId = $metadata['user_id'] ?? null;

        if (! $orderId || ! $userId) {
            return null;
        }

        return Order::where('id', $orderId)
            ->where('user_id', $userId)
            ->first();
    }

    private function fulfillOrder(Order $order, int $userId, ?string $paymentIntentId = null): void
    {
        DB::transaction(function () use ($order, $userId, $paymentIntentId): void {
            $updateData = [
                'payment_status' => 'completed',
                'status' => 'processing',
            ];

            if ($paymentIntentId) {
                $updateData['payment_intent_id'] = $paymentIntentId;
            }

            $order->update($updateData);

            $order->load('items.product');

            foreach ($order->items as $item) {
                $item->product->decrementStock($item->quantity);
            }

            $cart = Cart::where('user_id', $userId)
                ->where('status', 'active')
                ->first();

            if ($cart) {
                $cart->items()->delete();
                $cart->update(['status' => 'completed']);
            }
        });
    }
}
