<?php

namespace App\Http\Requests\Checkout;

use Illuminate\Foundation\Http\FormRequest;

class CreateCheckoutRequest extends FormRequest
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
            'success_url' => ['required', 'string', 'url'],
            'cancel_url' => ['required', 'string', 'url'],
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
            'success_url' => [
                'description' => 'The URL to redirect to after successful payment',
                'example' => 'https://example.com/checkout/success?session_id={CHECKOUT_SESSION_ID}',
            ],
            'cancel_url' => [
                'description' => 'The URL to redirect to if the user cancels payment',
                'example' => 'https://example.com/checkout/cancel',
            ],
            'shipping_address' => [
                'description' => 'The shipping address for the order (optional)',
                'type' => 'object',
                'example' => [
                    'street' => '123 Main St',
                    'city' => 'Springfield',
                    'state' => 'IL',
                    'zip' => '62701',
                    'country' => 'USA',
                ],
            ],
            'shipping_address.street' => [
                'description' => 'Street address',
                'example' => '123 Main St',
            ],
            'shipping_address.city' => [
                'description' => 'City name',
                'example' => 'Springfield',
            ],
            'shipping_address.state' => [
                'description' => 'State or province',
                'example' => 'IL',
            ],
            'shipping_address.zip' => [
                'description' => 'ZIP or postal code',
                'example' => '62701',
            ],
            'shipping_address.country' => [
                'description' => 'Country name',
                'example' => 'USA',
            ],
        ];
    }
}
