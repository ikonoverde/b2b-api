<?php

namespace App\Http\Requests\Web\Auth;

use Illuminate\Foundation\Http\FormRequest;

class GoogleCompleteRegistrationRequest extends FormRequest
{
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
            'name' => ['required', 'string', 'max:255'],
            'rfc' => ['required', 'string', 'size:13', 'regex:/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/'],
            'phone' => ['required', 'string', 'max:20'],
            'terms_accepted' => ['required', 'accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'rfc.regex' => 'El RFC debe tener un formato válido (ej: XAXX010101000).',
            'rfc.size' => 'El RFC debe tener exactamente 13 caracteres.',
            'terms_accepted.accepted' => 'Debes aceptar los términos y condiciones.',
        ];
    }
}
