<?php

namespace App\Ai;

use App\Ai\Agents\AdminChatAgent;
use App\Ai\Agents\AdsAgent;
use App\Ai\Agents\MarketingIdeasAgent;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\In;

class AdminChatAgents
{
    /**
     * @return array<string, array{class: class-string, name: string, description: string, status: string, welcome: string, suggestions: list<string>}>
     */
    public static function all(): array
    {
        return [
            'ads' => [
                'class' => AdsAgent::class,
                'name' => 'AdsAgent',
                'description' => 'Diagnostica GA4, Meta, Instagram, Google Ads, atribucion y rendimiento de campanas.',
                'status' => 'Reportes y diagnostico',
                'welcome' => 'Puedo ayudarte a revisar conexiones de GA4 y Meta, explicar problemas de tracking y preparar reportes de campanas.',
                'suggestions' => [
                    'Revisa si GA4 esta listo para reportes',
                    'Diagnostica la conexion de Meta',
                    'Explica que falta para medir ROAS',
                    'Lista las propiedades de Analytics disponibles',
                ],
            ],
            'marketing_ideas' => [
                'class' => MarketingIdeasAgent::class,
                'name' => 'MarketingIdeasAgent',
                'description' => 'Propone ideas de marketing, crecimiento y promocion segun etapa, presupuesto y recursos.',
                'status' => 'Estrategia de crecimiento',
                'welcome' => 'Puedo ayudarte a elegir ideas de marketing relevantes, priorizarlas y convertirlas en proximos pasos claros.',
                'suggestions' => [
                    'Dame ideas para vender mas aceites de masaje 5 L',
                    'Sugiere tacticas de bajo presupuesto para spas',
                    'Prepara ideas para captar terapeutas profesionales',
                    'Ayudame a priorizar canales de crecimiento',
                ],
            ],
            'admin' => [
                'class' => AdminChatAgent::class,
                'name' => 'AdminChatAgent',
                'description' => 'Ayuda operativa general para redactar, resumir y planear trabajo administrativo.',
                'status' => 'Operacion interna',
                'welcome' => 'Puedo ayudarte a redactar respuestas, estructurar tareas administrativas y preparar proximos pasos seguros.',
                'suggestions' => [
                    'Redacta respuesta para un cliente',
                    'Resume pendientes operativos de hoy',
                    'Prepara ideas para el siguiente blog',
                    'Ayudame a estructurar una tarea interna',
                ],
            ],
        ];
    }

    /**
     * @return list<string>
     */
    public static function keys(): array
    {
        return array_keys(self::all());
    }

    public static function validationRule(): In
    {
        return Rule::in(self::keys());
    }

    /**
     * @return array{name: string, description: string, status: string, welcome: string, suggestions: list<string>}
     */
    public static function public(string $key): array
    {
        $agent = self::all()[$key];

        return [
            'name' => $agent['name'],
            'description' => $agent['description'],
            'status' => $agent['status'],
            'welcome' => $agent['welcome'],
            'suggestions' => $agent['suggestions'],
        ];
    }

    /**
     * @return array<string, array{name: string, description: string, status: string, welcome: string, suggestions: list<string>}>
     */
    public static function publicList(): array
    {
        return collect(self::keys())
            ->mapWithKeys(fn (string $key): array => [$key => self::public($key)])
            ->all();
    }

    /**
     * @return class-string
     */
    public static function classFor(string $key): string
    {
        return self::all()[$key]['class'];
    }
}
