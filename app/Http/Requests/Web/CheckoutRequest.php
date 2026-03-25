<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    private const MAX_STRING = 'max:255';

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', self::MAX_STRING],
            'address_line_1' => ['required', 'string', self::MAX_STRING],
            'address_line_2' => ['required', 'string', self::MAX_STRING],
            'city' => ['required', 'string', self::MAX_STRING],
            'state' => ['required', 'string', self::MAX_STRING],
            'postal_code' => ['required', 'string', 'max:10'],
            'phone' => ['required', 'string', 'max:20'],
            'quote_id' => ['required', 'string', self::MAX_STRING],
            'rate_id' => ['required', 'string', self::MAX_STRING],
        ];
    }
}
