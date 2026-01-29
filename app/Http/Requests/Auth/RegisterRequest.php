<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'name' => ['string', 'max:255'],
            'rfc' => ['string', 'size:13', 'regex:/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'terms_accepted' => ['required', 'accepted'],
            'device_name' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'rfc.regex' => 'El RFC debe tener un formato válido (ej: XAXX010101000).',
            'rfc.size' => 'El RFC debe tener exactamente 13 caracteres.',
            'terms_accepted.accepted' => 'Debes aceptar los términos y condiciones.',
        ];
    }

    /**
     * Get the body parameters for the request.
     *
     * @return array<string, array<string, mixed>>
     */
    public function bodyParameters(): array
    {
        return [
            'name' => [
                'description' => 'The full name of the user',
                'example' => 'John Doe',
            ],
            'rfc' => [
                'description' => 'The RFC (Registro Federal de Contribuyentes) - Mexican tax ID',
                'example' => 'XAXX010101000',
            ],
            'email' => [
                'description' => 'The email address of the user',
                'example' => 'user@example.com',
            ],
            'phone' => [
                'description' => 'The phone number of the user',
                'example' => '+521234567890',
            ],
            'password' => [
                'description' => 'The password for the account (minimum 8 characters)',
                'example' => 'password123',
            ],
            'password_confirmation' => [
                'description' => 'Confirmation of the password (must match password)',
                'example' => 'password123',
            ],
            'terms_accepted' => [
                'description' => 'Whether the user has accepted the terms and conditions',
                'example' => 'true',
            ],
            'device_name' => [
                'description' => 'Name of the device requesting the token',
                'example' => 'My iPhone',
            ],
        ];
    }
}
