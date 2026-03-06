<?php

namespace App\Http\Requests\PaymentMethods;

use Illuminate\Foundation\Http\FormRequest;

class CreateSetupSessionRequest extends FormRequest
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
            'success_url' => ['required', 'url'],
            'cancel_url' => ['required', 'url'],
        ];
    }

    /**
     * @return array<string, array<string, string>>
     */
    public function bodyParameters(): array
    {
        return [
            'success_url' => [
                'description' => 'The URL to redirect to after successfully adding the card.',
                'example' => 'https://example.com/payment-methods?setup=success',
            ],
            'cancel_url' => [
                'description' => 'The URL to redirect to if the user cancels.',
                'example' => 'https://example.com/payment-methods?setup=cancelled',
            ],
        ];
    }
}
