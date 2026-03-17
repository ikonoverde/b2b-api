<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
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
            'name' => $this->name,
            'sku' => $this->sku,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'description' => $this->description,
            'price' => (float) $this->price,
            'stock' => $this->stock,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'image' => $this->image_url,
            'thumbnail' => $this->images->first()?->thumbnail_url,
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'pricing_tiers' => PricingTierResource::collection($this->whenLoaded('pricingTiers')),
            'weight_kg' => $this->weight_kg !== null ? (float) $this->weight_kg : null,
            'width_cm' => $this->width_cm !== null ? (float) $this->width_cm : null,
            'height_cm' => $this->height_cm !== null ? (float) $this->height_cm : null,
            'depth_cm' => $this->depth_cm !== null ? (float) $this->depth_cm : null,
        ];
    }
}
