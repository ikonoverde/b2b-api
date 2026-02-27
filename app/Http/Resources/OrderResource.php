<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'payment_intent_id' => $this->payment_intent_id,
            'total_amount' => (float) $this->total_amount,
            'shipping_cost' => (float) $this->shipping_cost,
            'shipping_method_id' => $this->shipping_method_id,
            'shipping_address' => $this->shipping_address,
            'tracking_number' => $this->tracking_number,
            'shipping_carrier' => $this->shipping_carrier,
            'tracking_url' => $this->tracking_url,
            'items' => OrderItemResource::collection($this->whenLoaded('items', $this->items, [])),
            'status_histories' => OrderStatusHistoryResource::collection($this->whenLoaded('statusHistories', $this->statusHistories, [])),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
