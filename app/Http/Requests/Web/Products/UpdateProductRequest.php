<?php

namespace App\Http\Requests\Web\Products;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug,'.$this->product->id],
            'sku' => ['required', 'string', 'max:50', 'unique:products,sku,'.$this->product->id],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'formula_id' => ['nullable', 'integer'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'min_stock' => ['nullable', 'integer', 'min:0'],
            'weight_kg' => ['nullable', 'numeric', 'min:0.01', 'max:999'],
            ...array_fill_keys(['width_cm', 'height_cm', 'depth_cm'], ['nullable', 'numeric', 'min:0.1', 'max:9999']),
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'images' => ['nullable', 'array', 'max:4'],
            'images.*' => ['image', 'mimes:png,jpg,jpeg,webp', 'max:5120'],
            'delete_images' => ['nullable', 'array'],
            'delete_images.*' => ['integer'],
        ];
    }
}
