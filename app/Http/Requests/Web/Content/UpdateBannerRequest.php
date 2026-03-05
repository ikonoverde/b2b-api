<?php

namespace App\Http\Requests\Web\Content;

use App\Http\Requests\Web\Content\Concerns\HasBannerLinkValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBannerRequest extends FormRequest
{
    use HasBannerLinkValidation;

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
            'link_type' => ['nullable', 'string', Rule::in(['product', 'category', 'url'])],
            'link_value' => ['nullable', 'required_with:link_type', 'string', $maxString, $this->linkValueRule()],
            'link_text' => ['nullable', 'string', $maxString],
            'is_active' => ['boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
        ];
    }
}
