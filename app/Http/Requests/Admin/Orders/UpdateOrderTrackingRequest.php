<?php

namespace App\Http\Requests\Admin\Orders;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderTrackingRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user && in_array($user->role, ['admin', 'super_admin']);
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tracking_number' => ['required', 'string', 'max:100'],
            'shipping_carrier' => ['required', 'string', 'max:50'],
            'tracking_url' => ['nullable', 'url', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'tracking_number.required' => 'El número de rastreo es requerido.',
            'tracking_number.max' => 'El número de rastreo no debe exceder 100 caracteres.',
            'shipping_carrier.required' => 'La paquetería es requerida.',
            'shipping_carrier.max' => 'La paquetería no debe exceder 50 caracteres.',
            'tracking_url.url' => 'La URL de rastreo debe ser una URL válida.',
            'tracking_url.max' => 'La URL de rastreo no debe exceder 500 caracteres.',
        ];
    }
}
