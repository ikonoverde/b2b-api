<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNotificationPreferencesRequest extends FormRequest
{
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
            'notify_order_updates' => ['sometimes', 'boolean'],
            'notify_promotional_emails' => ['sometimes', 'boolean'],
            'notify_newsletter' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function bodyParameters(): array
    {
        return [
            'notify_order_updates' => ['description' => 'Receive order status notifications', 'example' => true],
            'notify_promotional_emails' => ['description' => 'Receive promotional emails', 'example' => false],
            'notify_newsletter' => ['description' => 'Receive newsletter emails', 'example' => false],
        ];
    }
}
