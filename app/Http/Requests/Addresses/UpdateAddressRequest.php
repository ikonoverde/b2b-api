<?php

namespace App\Http\Requests\Addresses;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAddressRequest extends FormRequest
{
    private const MAX_STRING = 'max:255';

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:100'],
            'name' => ['required', 'string', self::MAX_STRING],
            'address_line_1' => ['required', 'string', self::MAX_STRING],
            'address_line_2' => ['nullable', 'string', self::MAX_STRING],
            'city' => ['required', 'string', self::MAX_STRING],
            'state' => ['required', 'string', self::MAX_STRING],
            'postal_code' => ['required', 'string', 'max:10'],
            'phone' => ['required', 'string', 'max:20'],
            'is_default' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function bodyParameters(): array
    {
        return [
            'label' => ['description' => 'A short label for the address', 'example' => 'Bodega'],
            'name' => ['description' => 'Full recipient name', 'example' => 'María López'],
            'address_line_1' => ['description' => 'Primary street address', 'example' => 'Calle Industrial 45'],
            'address_line_2' => ['description' => 'Suite, apt, floor (optional)', 'example' => null],
            'city' => ['description' => 'City', 'example' => 'Monterrey'],
            'state' => ['description' => 'State', 'example' => 'Nuevo León'],
            'postal_code' => ['description' => 'Postal code', 'example' => '64000'],
            'phone' => ['description' => 'Contact phone number', 'example' => '8187654321'],
            'is_default' => ['description' => 'Set as default address', 'example' => false],
        ];
    }
}
