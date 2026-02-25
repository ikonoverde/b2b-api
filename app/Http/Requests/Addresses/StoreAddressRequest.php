<?php

namespace App\Http\Requests\Addresses;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
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
            'label' => ['description' => 'A short label for the address', 'example' => 'Oficina Principal'],
            'name' => ['description' => 'Full recipient name', 'example' => 'Juan Pérez'],
            'address_line_1' => ['description' => 'Primary street address', 'example' => 'Av. Reforma 222'],
            'address_line_2' => ['description' => 'Suite, apt, floor (optional)', 'example' => 'Piso 3, Oficina 301'],
            'city' => ['description' => 'City', 'example' => 'Ciudad de México'],
            'state' => ['description' => 'State', 'example' => 'CDMX'],
            'postal_code' => ['description' => 'Postal code', 'example' => '06600'],
            'phone' => ['description' => 'Contact phone number', 'example' => '5551234567'],
            'is_default' => ['description' => 'Set as default address. Unsets all other defaults.', 'example' => true],
        ];
    }
}
