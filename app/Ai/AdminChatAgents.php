<?php

namespace App\Ai;

use App\Ai\Agents\AdminChatAgent;
use App\Ai\Agents\GoogleAnalyticsAgent;
use App\Ai\Agents\GrowthStrategyAgent;
use App\Ai\Agents\KeywordsAgent;
use App\Ai\Agents\MetaAgent;
use App\Ai\Agents\PaidAcquisitionAgent;
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
                'class' => PaidAcquisitionAgent::class,
                'name' => 'PaidAcquisitionAgent',
                'description' => 'Diagnostica paid media, GA4, Meta, Instagram, Google Ads, atribucion y rendimiento de campanas.',
                'status' => 'Paid media y diagnostico',
                'welcome' => 'Puedo ayudarte a revisar paid media, conexiones de GA4 y Meta, problemas de tracking, propuestas de anuncios y reportes de campanas.',
                'suggestions' => [
                    'Revisa si GA4 esta listo para reportes',
                    'Diagnostica la conexion de Meta',
                    'Explica que falta para medir ROAS',
                    'Lista las propiedades de Analytics disponibles',
                ],
            ],
            'google_analitics' => [
                'class' => GoogleAnalyticsAgent::class,
                'name' => 'GoogleAnalyticsAgent',
                'description' => 'Consulta GA4, conversiones, embudos, atribucion, realtime y configuracion de propiedades.',
                'status' => 'Datos e interpretacion GA4',
                'welcome' => 'Puedo revisar datos de Google Analytics, explicar reportes y detectar problemas de medicion o atribucion.',
                'suggestions' => [
                    'Lista las propiedades de Analytics disponibles',
                    'Revisa conversiones de los ultimos 30 dias',
                    'Analiza el embudo de compra en GA4',
                    'Explica si el trafico cambio esta semana',
                ],
            ],
            'meta' => [
                'class' => MetaAgent::class,
                'name' => 'MetaAgent',
                'description' => 'Consulta Meta e Instagram, posts, insights, comentarios y senales de contenido social.',
                'status' => 'Datos e interpretacion Meta',
                'welcome' => 'Puedo revisar datos de Meta e Instagram, interpretar posts y resumir senales de comentarios o engagement.',
                'suggestions' => [
                    'Revisa la informacion de la pagina de Meta',
                    'Lista los posts recientes de Instagram',
                    'Analiza insights de un post de Meta',
                    'Resume comentarios de una publicacion',
                ],
            ],
            'marketing_ideas' => [
                'class' => GrowthStrategyAgent::class,
                'name' => 'GrowthStrategyAgent',
                'description' => 'Prioriza canales e ideas de crecimiento segun etapa, presupuesto, recursos, catalogo y ventas.',
                'status' => 'Estrategia de crecimiento',
                'welcome' => 'Puedo ayudarte a elegir canales e ideas de crecimiento, priorizarlas y convertirlas en proximos pasos claros.',
                'suggestions' => [
                    'Dame ideas para vender mas aceites de masaje 5 L',
                    'Sugiere tacticas de bajo presupuesto para spas',
                    'Prepara ideas para captar terapeutas profesionales',
                    'Ayudame a priorizar canales de crecimiento',
                ],
            ],
            'keywords' => [
                'class' => KeywordsAgent::class,
                'name' => 'KeywordsAgent',
                'description' => 'Investiga keywords SEO, intencion SERP, brechas competitivas y clusters de contenido.',
                'status' => 'Investigacion SEO',
                'welcome' => 'Puedo ayudarte a investigar keywords, agruparlas por intencion y proponer paginas SEO para Ikonoverde.',
                'suggestions' => [
                    'Investiga keywords para aceites de masaje profesional',
                    'Encuentra oportunidades SEO para spas en Mexico',
                    'Agrupa keywords por intencion de busqueda',
                    'Propone paginas SEO para productos 5 L',
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
