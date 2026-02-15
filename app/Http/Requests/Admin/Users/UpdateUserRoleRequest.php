<?php

namespace App\Http\Requests\Admin\Users;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRoleRequest extends FormRequest
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

        // Prevent users from changing their own role
        if ($user->id === $targetUser->id) {
            return false;
        }

        $newRole = $this->input('role');

        // Only super_admin can assign admin or super_admin roles
        if (in_array($newRole, ['admin', 'super_admin'])) {
            return $user->role === 'super_admin';
        }

        // All admins can assign customer role
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
            'role' => ['required', Rule::in(['customer', 'admin', 'super_admin'])],
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
            'role.required' => 'El rol es requerido.',
            'role.in' => 'El rol seleccionado no es válido.',
        ];
    }
}
