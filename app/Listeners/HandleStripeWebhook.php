<?php

namespace App\Listeners;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\DB;
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
            'charge.refunded' => $this->handleChargeRefunded($payload),
            default => null,
        };
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function handleCheckoutCompleted(array $payload): void
    {
        $metadata = $payload['data']['object']['metadata'] ?? [];
        $orderId = $metadata['order_id'] ?? null;
        $userId = $metadata['user_id'] ?? null;

        if (! $orderId || ! $userId) {
            return;
        }

        $order = Order::where('id', $orderId)
            ->where('user_id', $userId)
            ->first();

        if (! $order || $order->payment_status === 'completed') {
            return;
        }

        DB::transaction(function () use ($order, $payload, $userId): void {
            $order->update([
                'payment_status' => 'completed',
                'status' => 'processing',
                'payment_intent_id' => $payload['data']['object']['payment_intent'] ?? null,
            ]);

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

    /**
     * @param  array<string, mixed>  $payload
     */
    private function handleCheckoutExpired(array $payload): void
    {
        $metadata = $payload['data']['object']['metadata'] ?? [];
        $orderId = $metadata['order_id'] ?? null;
        $userId = $metadata['user_id'] ?? null;

        if (! $orderId || ! $userId) {
            return;
        }

        $order = Order::where('id', $orderId)
            ->where('user_id', $userId)
            ->first();

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

            $order->update([
                'payment_status' => 'refunded',
            ]);
        });
    }
}
