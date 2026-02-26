<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ChangePasswordRequest extends FormRequest
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
            'current_password' => ['required', 'string', 'current_password'],
            'password' => ['required', 'string', Password::min(8), 'confirmed'],
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
            'current_password' => [
                'description' => "The user's current password",
                'example' => 'currentP@ss1',
            ],
            'password' => [
                'description' => 'The new password (min 8 characters)',
                'example' => 'newP@ssw0rd',
            ],
            'password_confirmation' => [
                'description' => 'The new password confirmation (must match password)',
                'example' => 'newP@ssw0rd',
            ],
        ];
    }
}
