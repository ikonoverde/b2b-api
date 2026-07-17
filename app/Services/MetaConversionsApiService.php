<?php

namespace App\Services;

use App\Models\MetaConversionEvent;
use App\Models\Order;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class MetaConversionsApiService
{
    public function sendPurchase(Order $order): void
    {
        $pixelId = config('services.meta_pixel.pixel_id');
        $accessToken = config('services.meta_pixel.conversions_api_access_token');
        $testEventCode = config('services.meta_pixel.test_event_code');

        if (! config('services.meta_pixel.enabled')) {
            $this->record($order, MetaConversionEvent::STATUS_SKIPPED_NOT_ENABLED, $testEventCode);

            return;
        }

        if (! $pixelId || ! $accessToken) {
            $this->record($order, MetaConversionEvent::STATUS_SKIPPED_MISSING_CREDENTIALS, $testEventCode);

            return;
        }

        $payload = [
            'data' => [$this->purchaseEventPayload($order)],
        ];

        if ($testEventCode) {
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

            $this->record($order, MetaConversionEvent::STATUS_FAILED, $testEventCode, errorMessage: $exception->getMessage());

            return;
        }

        if ($response->failed()) {
            Log::warning('Meta Conversions API purchase event was rejected', [
                'order_id' => $order->id,
                'status' => $response->status(),
                'response' => $response->json(),
            ]);

            $this->record($order, MetaConversionEvent::STATUS_REJECTED, $testEventCode, $response, $this->rejectionMessage($response));

            return;
        }

        $this->record($order, MetaConversionEvent::STATUS_SENT, $testEventCode, $response);
    }

    /**
     * Record the outcome of a dispatch attempt so it can be observed in production.
     *
     * A successful send and a send that never happened are indistinguishable in the
     * application log, so every branch of sendPurchase writes exactly one row here.
     * Recording must never break checkout: a write failure is logged and swallowed.
     */
    private function record(
        Order $order,
        string $status,
        ?string $testEventCode,
        ?Response $response = null,
        ?string $errorMessage = null,
    ): void {
        try {
            $order->loadMissing('items');

            MetaConversionEvent::create([
                'order_id' => $order->id,
                'event_name' => 'Purchase',
                'event_id' => $order->metaPurchaseEventId(),
                'status' => $status,
                'http_status' => $response?->status(),
                'error_message' => $errorMessage,
                'value' => (float) $order->total_amount,
                'currency' => config('services.meta_pixel.currency', 'MXN'),
                'num_items' => $order->items->sum('quantity'),
                'test_event_code' => $testEventCode,
                'sent_at' => now(),
            ]);
        } catch (Throwable $exception) {
            Log::warning('Failed to record Meta Conversions API purchase event', [
                'order_id' => $order->id,
                'status' => $status,
                'message' => $exception->getMessage(),
            ]);
        }
    }

    private function rejectionMessage(Response $response): string
    {
        $error = $response->json('error');

        if (is_array($error) && is_string($error['message'] ?? null)) {
            return $error['message'];
        }

        return (string) $response->body();
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
            'event_id' => $order->metaPurchaseEventId(),
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

    /**
     * Build the hashed customer-information block Meta uses for advanced matching.
     *
     * Every field is normalized and SHA-256 hashed client side per Meta's spec so
     * the raw PII never leaves this server. The storefront is Mexico-only (MXN) and
     * collects no country field, so the country is fixed to Mexico.
     *
     * @return array<string, string>
     */
    private function userData(Order $order): array
    {
        $address = is_array($order->shipping_address) ? $order->shipping_address : [];

        $phone = $order->user?->phone ?: ($address['phone'] ?? null);
        [$firstName, $lastName] = $this->splitName(is_string($address['name'] ?? null) ? $address['name'] : null);

        return array_filter([
            'em' => $this->hash($order->user?->email),
            'ph' => $this->hashPhone(is_string($phone) ? $phone : null),
            'fn' => $this->hashNormalized($firstName),
            'ln' => $this->hashNormalized($lastName),
            'ct' => $this->hashNormalized(is_string($address['city'] ?? null) ? $address['city'] : null),
            'st' => $this->hashNormalized(is_string($address['state'] ?? null) ? $address['state'] : null),
            'zp' => $this->hashNormalized(is_string($address['postal_code'] ?? null) ? $address['postal_code'] : null),
            'country' => $this->hash('mx'),
            'external_id' => $this->hash((string) $order->user_id),
            'client_ip_address' => $order->client_ip_address,
            'client_user_agent' => $order->client_user_agent,
            'fbp' => $order->meta_fbp,
            'fbc' => $order->meta_fbc,
        ], fn (?string $value): bool => $value !== null);
    }

    /**
     * Split a full name into its first token and the remainder.
     *
     * @return array{0: ?string, 1: ?string}
     */
    private function splitName(?string $name): array
    {
        if ($name === null) {
            return [null, null];
        }

        $parts = preg_split('/\s+/', trim($name), -1, PREG_SPLIT_NO_EMPTY) ?: [];

        if ($parts === []) {
            return [null, null];
        }

        $first = array_shift($parts);

        return [$first, $parts === [] ? null : implode(' ', $parts)];
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

    /**
     * Hash a free-text field (name, city, state, postal code) after stripping
     * everything but Unicode letters and digits, as Meta expects for these
     * parameters — "Menlo Park" and "Yucatán" become "menlopark" and "yucatán".
     */
    private function hashNormalized(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $normalized = preg_replace('/[^\p{L}\p{N}]+/u', '', mb_strtolower(trim($value)));

        return $normalized ? hash('sha256', $normalized) : null;
    }
}
