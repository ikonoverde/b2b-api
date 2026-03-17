<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

class ShippingQuotesRequest extends FormRequest
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
            'postal_code' => ['required', 'string', 'size:5'],
            'city' => ['required', 'string', self::MAX_STRING],
            'state' => ['required', 'string', self::MAX_STRING],
            'neighborhood' => ['required', 'string', self::MAX_STRING],
        ];
    }
}
