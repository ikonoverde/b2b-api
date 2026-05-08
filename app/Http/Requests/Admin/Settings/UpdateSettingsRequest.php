<?php

namespace App\Http\Requests\Admin\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array($this->user()?->role, ['admin', 'super_admin'], true);
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'contact_address' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'contact_email.email' => 'El correo electrónico no es válido.',
            'contact_email.max' => 'El correo electrónico no puede exceder 255 caracteres.',
            'contact_phone.max' => 'El teléfono no puede exceder 50 caracteres.',
            'contact_address.max' => 'La dirección no puede exceder 1000 caracteres.',
        ];
    }
}
