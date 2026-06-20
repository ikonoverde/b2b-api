<?php

namespace App\Http\Requests\Web;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMeridaSampleRequest extends FormRequest
{
    public const BUSINESS_TYPES = [
        'Terapeuta independiente',
        'SPA (Day Spa)',
        'Hotel Boutique',
        'Gran Resort / Cadena Hotelera',
        'Clínica de belleza',
    ];

    public const CLIENT_VOLUMES = [
        '1-10 masajes/semana',
        '11-30 masajes/semana',
        'Más de 30 masajes/semana',
    ];

    public const PRODUCTS = [
        'Aceites',
        'Manteca',
        'Exfoliante',
        'Gel After Sun',
    ];

    public const IMPROVEMENT_GOALS = [
        'Mejor precio/rendimiento',
        'Ingredientes más naturales/veganos',
        'Aromas más duraderos',
        'Proveedor local más rápido',
    ];

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
            'business_name' => ['required', 'string', 'max:255'],
            'contact_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email:filter', 'max:255'],
            'phone' => ['required', 'digits:10'],
            'business_type' => ['required', 'string', Rule::in(self::BUSINESS_TYPES)],
            'client_volume' => ['required', 'string', Rule::in(self::CLIENT_VOLUMES)],
            'social_url' => ['nullable', 'url', 'max:255'],
            'products_interested' => ['required', 'array', 'min:1'],
            'products_interested.*' => ['required', 'string', Rule::in(self::PRODUCTS)],
            'improvement_goals' => ['required', 'array', 'min:1'],
            'improvement_goals.*' => ['required', 'string', Rule::in(self::IMPROVEMENT_GOALS)],
        ];
    }

    public function messages(): array
    {
        return [
            'business_name.required' => 'Indique el nombre del negocio.',
            'contact_name.required' => 'Indique el nombre de contacto.',
            'email.required' => 'Indique un correo para dar seguimiento.',
            'email.email' => 'Indique un correo válido.',
            'phone.required' => 'Indique un teléfono para dar seguimiento.',
            'phone.digits' => 'El teléfono debe tener 10 dígitos.',
            'business_type.required' => 'Seleccione el tipo de negocio.',
            'client_volume.required' => 'Seleccione su volumen aproximado.',
            'social_url.url' => 'Indique un enlace válido.',
            'products_interested.required' => 'Seleccione al menos un producto.',
            'products_interested.min' => 'Seleccione al menos un producto.',
            'improvement_goals.required' => 'Seleccione al menos una mejora.',
            'improvement_goals.min' => 'Seleccione al menos una mejora.',
        ];
    }
}
