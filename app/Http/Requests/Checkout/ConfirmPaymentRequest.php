<?php

namespace App\Http\Requests\Checkout;

use Illuminate\Foundation\Http\FormRequest;

class ConfirmPaymentRequest extends FormRequest
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
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'payment_intent_id' => ['required', 'string'],
            'shipping_address' => ['sometimes', 'array'],
            'shipping_address.street' => ['required_with:shipping_address', 'string', 'max:255'],
            'shipping_address.city' => ['required_with:shipping_address', 'string', 'max:255'],
            'shipping_address.state' => ['required_with:shipping_address', 'string', 'max:255'],
            'shipping_address.zip' => ['required_with:shipping_address', 'string', 'max:20'],
            'shipping_address.country' => ['required_with:shipping_address', 'string', 'max:255'],
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
            'order_id' => [
                'description' => 'The ID of the order to confirm payment for',
                'example' => 1,
            ],
            'payment_intent_id' => [
                'description' => 'The Stripe PaymentIntent ID',
                'example' => 'pi_1234567890',
            ],
            'shipping_address' => [
                'description' => 'The shipping address collected by Stripe Elements (optional)',
                'type' => 'object',
                'example' => [
                    'street' => '123 Main St',
                    'city' => 'Springfield',
                    'state' => 'IL',
                    'zip' => '62701',
                    'country' => 'USA',
                ],
            ],
        ];
    }
}
