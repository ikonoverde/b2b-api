<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class MetaConversionsApiService
{
    public function sendPurchase(Order $order): void
    {
        $pixelId = config('services.meta_pixel.pixel_id');
        $accessToken = config('services.meta_pixel.conversions_api_access_token');

        if (! $pixelId || ! $accessToken) {
            return;
        }

        $payload = [
            'data' => [$this->purchaseEventPayload($order)],
        ];

        if ($testEventCode = config('services.meta_pixel.test_event_code')) {
            $payload['test_event_code'] = $testEventCode;
        }

        try {
            $response = Http::acceptJson()
                ->timeout(5)
                ->post(
                    sprintf('https://graph.facebook.com/%s/%s/events', config('services.meta_pixel.api_version'), $pixelId),
                    [
                        ...$payload,
                        'access_token' => $accessToken,
                    ],
                );
        } catch (Throwable $exception) {
            Log::warning('Meta Conversions API purchase event failed', [
                'order_id' => $order->id,
                'message' => $exception->getMessage(),
            ]);

            return;
        }

        if ($response->failed()) {
            Log::warning('Meta Conversions API purchase event was rejected', [
                'order_id' => $order->id,
                'status' => $response->status(),
                'response' => $response->json(),
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function purchaseEventPayload(Order $order): array
    {
        $order->loadMissing(['items', 'user']);

        return [
            'event_name' => 'Purchase',
            'event_time' => time(),
            'event_id' => $this->purchaseEventId($order),
            'action_source' => 'website',
            'event_source_url' => route('checkout.thank-you', ['order' => $order->id]),
            'user_data' => $this->userData($order),
            'custom_data' => [
                'currency' => config('services.meta_pixel.currency', 'MXN'),
                'value' => (float) $order->total_amount,
                'order_id' => (string) $order->id,
                'content_type' => 'product',
                'content_ids' => $order->items->map(fn ($item) => (string) $item->product_id)->values()->all(),
                'contents' => $order->items->map(fn ($item) => [
                    'id' => (string) $item->product_id,
                    'quantity' => $item->quantity,
                    'item_price' => (float) $item->unit_price,
                ])->values()->all(),
                'num_items' => $order->items->sum('quantity'),
            ],
        ];
    }

    private function purchaseEventId(Order $order): string
    {
        return "order_{$order->id}";
    }

    /**
     * @return array<string, string>
     */
    private function userData(Order $order): array
    {
        $phone = $order->user?->phone ?: ($order->shipping_address['phone'] ?? null);

        return array_filter([
            'em' => $this->hash($order->user?->email),
            'ph' => $this->hashPhone(is_string($phone) ? $phone : null),
            'external_id' => $this->hash((string) $order->user_id),
        ], fn (?string $value): bool => $value !== null);
    }

    private function hash(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        return hash('sha256', mb_strtolower(trim($value)));
    }

    private function hashPhone(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        $normalized = preg_replace('/\D+/', '', $value);

        return $normalized ? hash('sha256', $normalized) : null;
    }
}
