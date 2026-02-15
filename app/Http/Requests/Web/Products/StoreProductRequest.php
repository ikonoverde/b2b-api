<?php

namespace App\Http\Requests\Web\Products;

use App\Rules\NonOverlappingPricingTiers;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:50', 'unique:products,sku'],
            'category' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'min_stock' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'images' => ['nullable', 'array', 'max:4'],
            'images.*' => ['image', 'mimes:png,jpg,jpeg,webp', 'max:5120'],
            'pricing_tiers' => ['nullable', 'array', new NonOverlappingPricingTiers],
            'pricing_tiers.*.min_qty' => ['required', 'integer', 'min:1'],
            'pricing_tiers.*.max_qty' => ['nullable', 'integer', 'min:1', 'gte:pricing_tiers.*.min_qty'],
            'pricing_tiers.*.price' => ['required', 'numeric', 'min:0'],
            'pricing_tiers.*.discount' => ['required', 'numeric', 'min:0', 'max:100'],
            'pricing_tiers.*.label' => ['required', 'string', 'max:100'],
        ];
    }
}
