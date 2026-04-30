<?php

namespace App\Http\Controllers\Admin\Orders\Concerns;

use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

trait BuildsOrderShowResponse
{
    private const SHOW_VIEW = 'admin/orders/Show';

    protected function renderOrderShow(
        Order $order,
        ?string $flashType = null,
        ?string $flashMessage = null,
    ): Response {
        $order->load([
            'user',
            'items',
            'shippingMethod',
            'statusHistories.admin',
            'notes.admin',
        ]);

        $data = ['order' => $this->formatOrder($order)];

        if ($flashType !== null && $flashMessage !== null) {
            $data['flash'] = [$flashType => $flashMessage];
        }

        return Inertia::render(self::SHOW_VIEW, $data);
    }

    /**
     * @return array<string, mixed>
     */
    private function formatOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'payment_intent_id' => $order->payment_intent_id,
            'total_amount' => (float) $order->total_amount,
            'shipping_cost' => (float) $order->shipping_cost,
            'refunded_amount' => (float) $order->refunded_amount,
            'tracking_number' => $order->tracking_number,
            'shipping_carrier' => $order->shipping_carrier,
            'tracking_url' => $order->tracking_url,
            'label_url' => $order->label_url,
            'label_error' => $order->label_error,
            'skydropx_shipment_id' => $order->skydropx_shipment_id,
            'shipping_quote_source' => $order->shipping_quote_source,
            'shipping_address' => $order->shipping_address,
            'created_at' => $order->created_at->toIso8601String(),
            'updated_at' => $order->updated_at->toIso8601String(),
            'customer' => $order->user ? [
                'id' => $order->user->id,
                'name' => $order->user->name,
                'email' => $order->user->email,
            ] : null,
            'shipping_method' => $order->shippingMethod ? [
                'id' => $order->shippingMethod->id,
                'name' => $order->shippingMethod->name,
            ] : null,
            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'subtotal' => (float) $item->subtotal,
                'image' => $item->image,
            ])->toArray(),
            'status_histories' => $order->statusHistories
                ->sortByDesc('created_at')
                ->values()
                ->map(fn ($history) => [
                    'id' => $history->id,
                    'from_status' => $history->from_status,
                    'to_status' => $history->to_status,
                    'note' => $history->note,
                    'admin_name' => $history->admin?->name,
                    'created_at' => $history->created_at->toIso8601String(),
                ])->toArray(),
            'notes' => $order->notes
                ->sortByDesc('created_at')
                ->values()
                ->map(fn ($note) => [
                    'id' => $note->id,
                    'content' => $note->content,
                    'admin_name' => $note->admin?->name,
                    'created_at' => $note->created_at->toIso8601String(),
                ])->toArray(),
        ];
    }
}
