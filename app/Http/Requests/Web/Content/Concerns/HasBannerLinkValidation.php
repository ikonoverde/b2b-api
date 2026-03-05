<?php

namespace App\Http\Requests\Web\Content\Concerns;

trait HasBannerLinkValidation
{
    private function linkValueRule(): string
    {
        return match ($this->input('link_type')) {
            'product' => 'exists:products,id',
            'category' => 'exists:categories,id',
            'url' => 'url',
            default => 'string',
        };
    }
}
