<?php

namespace App\Http\Requests\Web\Content;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $maxString = 'max:255';

        return [
            'title' => ['required', 'string', $maxString],
            'subtitle' => ['nullable', 'string', $maxString],
            'image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:5120'],
            'link_url' => ['nullable', 'url', $maxString],
            'link_text' => ['nullable', 'string', $maxString],
            'is_active' => ['boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
        ];
    }
}
