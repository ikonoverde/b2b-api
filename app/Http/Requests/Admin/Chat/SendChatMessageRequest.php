<?php

namespace App\Http\Requests\Admin\Chat;

use App\Ai\AdminChatAgents;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SendChatMessageRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'agent' => ['required', 'string', AdminChatAgents::validationRule()],
            'conversation_id' => ['sometimes', 'nullable', 'string'],
            'message' => ['required', 'string', 'max:4000'],
        ];
    }
}
