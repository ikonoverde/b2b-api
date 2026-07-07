<?php

use App\Ai\Tools\Keywords\SerpApiSearchInsights;
use App\Services\Seo\SerpApiSearchInsightsService;
use Illuminate\Http\Client\Request as HttpRequest;
use Illuminate\Support\Facades\Http;
use Laravel\Ai\Tools\Request;

it('runs serpapi search insights through the service', function () {
    config(['services.serpapi.api_key' => 'serpapi-key']);

    $service = new class extends SerpApiSearchInsightsService
    {
        public array $arguments = [];

        public function searchInsights(array $arguments): array
        {
            $this->arguments = $arguments;

            return [
                'provider' => 'serpapi',
                'query' => 'aceite para masaje',
                'organic_results' => [
                    ['domain' => 'example.com', 'position' => 1],
                ],
            ];
        }
    };

    $tool = new SerpApiSearchInsights($service);
    $result = json_decode((string) $tool->handle(new Request([
        'query' => 'aceite para masaje',
        'country' => 'MX',
        'language' => 'es',
        'limit' => 25,
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($service->arguments['query'])->toBe('aceite para masaje')
        ->and($service->arguments['country'])->toBe('MX')
        ->and($service->arguments['language'])->toBe('es')
        ->and($service->arguments['limit'])->toBe(25)
        ->and($result['provider'])->toBe('serpapi')
        ->and($result['organic_results'][0]['domain'])->toBe('example.com');
});

it('reports missing serpapi api key', function () {
    config(['services.serpapi.api_key' => null]);

    $payload = json_decode((string) app(SerpApiSearchInsights::class)->handle(new Request([
        'query' => 'aceite de masaje profesional',
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload)
        ->toMatchArray([
            'error' => true,
            'provider' => 'serpapi',
            'required_config' => ['services.serpapi.api_key'],
        ])
        ->and($payload['message'])->toContain('API is not configured')
        ->and($payload['received_arguments']['query'])->toBe('aceite de masaje profesional');
});

it('normalizes serpapi search insights responses', function () {
    config([
        'services.serpapi.api_key' => 'serpapi-key',
        'services.serpapi.base_url' => 'https://serpapi.com',
    ]);

    Http::fake([
        'serpapi.com/search.json*' => Http::response([
            'search_parameters' => [
                'location_requested' => 'Mexico',
                'location_used' => 'Mexico',
            ],
            'search_information' => [
                'total_results' => 1850000,
                'time_taken_displayed' => 0.42,
                'organic_results_state' => 'Results for exact spelling',
            ],
            'shopping_results' => [
                ['title' => 'Aceite para masaje profesional'],
            ],
            'organic_results' => [
                [
                    'position' => 1,
                    'title' => 'Comprar aceite para masaje profesional',
                    'link' => 'https://www.example.com/aceites',
                    'displayed_link' => 'example.com',
                    'snippet' => 'Venta por mayoreo de aceite para masaje.',
                    'source' => 'Example',
                ],
                [
                    'position' => 2,
                    'title' => 'Aceites de masaje relajante',
                    'link' => 'https://competitor.test/productos/aceite',
                    'snippet' => 'Precios y envíos en México.',
                ],
            ],
            'related_questions' => [
                [
                    'question' => '¿Qué aceite se usa para masaje relajante?',
                    'snippet' => 'Los aceites vegetales son comunes.',
                    'title' => 'Guía de aceites',
                    'link' => 'https://example.com/guia',
                ],
            ],
            'related_searches' => [
                ['query' => 'aceite para masaje precio', 'link' => 'https://google.com/search?q=aceite+precio'],
            ],
        ], 200),
    ]);

    $result = app(SerpApiSearchInsightsService::class)->searchInsights([
        'query' => 'aceite para masaje',
        'country' => 'MX',
        'language' => 'es',
        'limit' => 10,
    ]);

    Http::assertSent(function (HttpRequest $request): bool {
        parse_str((string) parse_url($request->url(), PHP_URL_QUERY), $query);

        return str_contains($request->url(), 'serpapi.com/search.json')
            && $query['api_key'] === 'serpapi-key'
            && $query['engine'] === 'google'
            && $query['q'] === 'aceite para masaje'
            && $query['google_domain'] === 'google.com.mx'
            && $query['gl'] === 'mx'
            && $query['hl'] === 'es'
            && $query['location'] === 'Mexico'
            && $query['device'] === 'desktop'
            && $query['num'] === '10'
            && $query['start'] === '0';
    });

    expect($result)
        ->toMatchArray([
            'provider' => 'serpapi',
            'query' => 'aceite para masaje',
            'country' => 'MX',
            'language' => 'es',
            'location' => 'Mexico',
            'search_information' => [
                'total_results' => 1850000,
                'time_taken_displayed' => 0.42,
                'organic_results_state' => 'Results for exact spelling',
            ],
        ])
        ->and($result['serp_features'])->toContain('shopping_results', 'people_also_ask', 'related_searches')
        ->and($result['intent_analysis']['primary_intent'])->toBe('transactional')
        ->and($result['organic_results'][0])->toMatchArray([
            'position' => 1,
            'title' => 'Comprar aceite para masaje profesional',
            'domain' => 'example.com',
        ])
        ->and($result['organic_competitors'][0])->toMatchArray([
            'domain' => 'example.com',
            'top_position' => 1,
            'result_count' => 1,
        ])
        ->and($result['people_also_ask'][0]['question'])->toBe('¿Qué aceite se usa para masaje relajante?')
        ->and($result['related_searches'][0]['text'])->toBe('aceite para masaje precio');
});
