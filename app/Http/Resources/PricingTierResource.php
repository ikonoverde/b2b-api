<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PricingTierResource extends JsonResource
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
            'min_qty' => $this->min_qty,
            'max_qty' => $this->max_qty,
            'price' => (float) $this->price,
            'discount' => (float) $this->discount,
            'label' => $this->label,
        ];
    }
}
