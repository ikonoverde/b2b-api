<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ResetPasswordRequest extends FormRequest
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
            'token' => ['required', 'string'],
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string', Password::min(8)->letters()->numbers(), 'confirmed'],
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
            'token' => [
                'description' => 'The password reset token received via email',
                'example' => 'abc123def456',
            ],
            'email' => [
                'description' => 'The email address associated with the account',
                'example' => 'user@example.com',
            ],
            'password' => [
                'description' => 'The new password (min 8 characters, must include letters and numbers)',
                'example' => 'newP@ssw0rd',
            ],
            'password_confirmation' => [
                'description' => 'The new password confirmation (must match password)',
                'example' => 'newP@ssw0rd',
            ],
        ];
    }
}
