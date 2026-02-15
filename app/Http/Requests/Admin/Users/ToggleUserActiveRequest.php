<?php

namespace App\Http\Requests\Admin\Users;

use Illuminate\Foundation\Http\FormRequest;

class ToggleUserActiveRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        $targetUser = $this->route('user');

        if (! $user) {
            return false;
        }

        // Prevent users from deactivating their own account (A1 — Self-Deactivation Prevention)
        if ($user->id === $targetUser->id) {
            return false;
        }

        // Only admins can toggle user active status
        return in_array($user->role, ['admin', 'super_admin']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'is_active' => ['required', 'boolean'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'is_active.required' => 'El estado de activación es requerido.',
            'is_active.boolean' => 'El estado debe ser verdadero o falso.',
        ];
    }
}
