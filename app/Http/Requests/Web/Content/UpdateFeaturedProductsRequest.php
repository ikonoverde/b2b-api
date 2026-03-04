<?php

namespace App\Http\Requests\Web\Content;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFeaturedProductsRequest extends FormRequest
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
        return [
            'products' => ['required', 'array', 'max:20'],
            'products.*.id' => ['required', 'integer', 'exists:products,id'],
            'products.*.featured_order' => ['required', 'integer', 'min:1'],
        ];
    }
}
