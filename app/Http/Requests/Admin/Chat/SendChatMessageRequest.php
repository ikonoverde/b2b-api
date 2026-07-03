<?php

namespace App\Http\Requests\Admin\Chat;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'message' => ['required', 'string', 'max:4000'],
            'messages' => ['sometimes', 'array', 'max:12'],
            'messages.*.role' => ['required_with:messages', Rule::in(['user', 'assistant'])],
            'messages.*.content' => ['required_with:messages', 'string', 'max:8000'],
        ];
    }

    /**
     * @return list<array{role: 'user'|'assistant', content: string}>
     */
    public function history(): array
    {
        return collect($this->validated('messages', []))
            ->map(fn (array $message): array => [
                'role' => $message['role'],
                'content' => $message['content'],
            ])
            ->values()
            ->all();
    }
}
