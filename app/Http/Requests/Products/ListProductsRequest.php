<?php

namespace App\Http\Requests\Products;

use Illuminate\Foundation\Http\FormRequest;

class ListProductsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'category_id' => ['sometimes', 'array'],
            'category_id.*' => ['integer', 'exists:categories,id'],
            'price_min' => ['sometimes', 'numeric', 'min:0'],
            'price_max' => ['sometimes', 'numeric', 'min:0', ...$this->has('price_min') ? ['gte:price_min'] : []],
            'search' => ['sometimes', 'string', 'max:255'],
            'sort' => ['sometimes', 'string', 'in:price_asc,price_desc,name_asc,name_desc,newest,oldest'],
        ];
    }

    /**
     * Get the query parameters for the request.
     *
     * @return array<string, array<string, mixed>>
     */
    public function queryParameters(): array
    {
        return [
            'page' => [
                'description' => 'The page number.',
                'example' => 1,
            ],
            'per_page' => [
                'description' => 'Items per page (1-100, default 15).',
                'example' => 15,
            ],
            'category_id' => [
                'description' => 'Filter by category ID(s). Pass as array.',
                'example' => [1],
            ],
            'price_min' => [
                'description' => 'Minimum price filter.',
                'example' => 10.00,
            ],
            'price_max' => [
                'description' => 'Maximum price filter.',
                'example' => 100.00,
            ],
            'search' => [
                'description' => 'Search keyword (matches name, description, SKU).',
                'example' => 'fertilizer',
            ],
            'sort' => [
                'description' => 'Sort order. Options: price_asc, price_desc, name_asc, name_desc, newest, oldest.',
                'example' => 'newest',
            ],
        ];
    }
}
