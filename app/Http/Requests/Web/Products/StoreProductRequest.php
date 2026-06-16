<?php

namespace App\Http\Requests\Web\Products;

use App\Http\Requests\Web\Products\Concerns\NormalizesProductShippingPackages;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    use NormalizesProductShippingPackages;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->prepareShippingPackagesForValidation();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'sku' => ['required', 'string', 'max:50', 'unique:products,sku'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'formula_id' => ['nullable', 'integer'],
            'description' => ['nullable', 'string'],
            'active_ingredients' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'min_stock' => ['nullable', 'integer', 'min:0'],
            'weight_kg' => ['nullable', 'numeric', 'min:0.01', 'max:999'],
            ...array_fill_keys(['width_cm', 'height_cm', 'depth_cm'], ['nullable', 'numeric', 'min:0.1', 'max:9999']),
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            ...$this->shippingPackageRules(),
            'images' => ['nullable', 'array', 'max:4'],
            'images.*' => ['image', 'mimes:png,jpg,jpeg,webp', 'max:5120'],
        ];
    }
}
