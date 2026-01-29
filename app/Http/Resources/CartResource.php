<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
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
            'status' => $this->status ?? 'active',
            'items' => CartItemResource::collection($this->whenLoaded('items', $this->items, [])),
            'totals' => $this->whenLoaded('items') ? $this->calculateTotals() : [
                'subtotal' => 0,
                'item_count' => 0,
                'total_quantity' => 0,
            ],
        ];
    }
}
