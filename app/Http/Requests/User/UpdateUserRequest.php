<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
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
            'name' => ['required', 'string', self::MAX_STRING],
            'email' => [
                'required', 'string', 'email', self::MAX_STRING,
                Rule::unique('users')->ignore($this->user()?->id),
            ],
            'phone' => ['required', 'string', 'max:20'],
        ];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function bodyParameters(): array
    {
        return [
            'name' => ['description' => 'Full name of the user', 'example' => 'Juan Pérez'],
            'email' => ['description' => 'Email address (must be unique)', 'example' => 'juan@example.com'],
            'phone' => ['description' => 'Phone number', 'example' => '+521234567890'],
        ];
    }
}
