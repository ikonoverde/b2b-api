<?php

namespace App\Http\Requests\Admin\GrowthPlan;

use App\Models\GrowthTask;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MoveGrowthTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user && in_array($user->role, ['admin', 'super_admin']);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'column' => ['required', 'string', Rule::in(GrowthTask::COLUMNS)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'column.in' => 'Esa columna no existe en el tablero.',
        ];
    }
}
