<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MobileBannerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'image_url' => $this->image_url,
            'link_type' => $this->link_type,
            'link_value' => $this->link_value,
            'link_text' => $this->link_text,
        ];
    }
}
