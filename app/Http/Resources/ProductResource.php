<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'category' => $this->category,
            'description' => $this->description,
            'price' => (float) $this->price,
            'stock' => $this->stock,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'image' => $this->image,
        ];
    }
}
