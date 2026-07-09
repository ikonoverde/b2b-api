<?php

use App\Models\AdProposal;
use App\Services\Ads\AdProposalPreviewer;

beforeEach(function () {
    $this->previewer = new AdProposalPreviewer;
});

it('normalizes alternate meta creative key names', function () {
    $proposal = AdProposal::factory()->make([
        'platform' => 'meta',
        'creatives' => [
            [
                'body' => 'Texto principal',
                'title' => 'Titular',
                'cta_text' => 'Enviar mensaje',
                'image_prompt' => 'Frascos ambar sobre madera',
            ],
        ],
    ]);

    $preview = $this->previewer->preview($proposal);

    expect($preview['meta'][0])
        ->primary_text->toBe('Texto principal')
        ->headline->toBe('Titular')
        ->cta->toBe('Enviar mensaje')
        ->media_note->toBe('Frascos ambar sobre madera')
        ->image_url->toBeNull();
});

it('surfaces a generated image url on meta creatives', function () {
    $proposal = AdProposal::factory()->make([
        'platform' => 'meta',
        'creatives' => [
            [
                'headline' => 'Aceites al mayoreo',
                'image_url' => 'https://cdn.ikonoverde.com/ads/aceites-mayoreo.webp',
                'image_notes' => 'Frascos ambar sobre madera clara',
            ],
        ],
    ]);

    $preview = $this->previewer->preview($proposal);

    expect($preview['meta'][0])
        ->image_url->toBe('https://cdn.ikonoverde.com/ads/aceites-mayoreo.webp')
        ->media_note->toBe('Frascos ambar sobre madera clara');
});

it('treats a bare string creative as a headline', function () {
    $proposal = AdProposal::factory()->make([
        'platform' => 'meta',
        'creatives' => ['Aceites al mayoreo'],
    ]);

    $preview = $this->previewer->preview($proposal);

    expect($preview['meta'][0]['headline'])->toBe('Aceites al mayoreo');
});

it('falls back to the proposal name and offer when there are no creatives', function () {
    $proposal = AdProposal::factory()->make([
        'platform' => 'meta',
        'name' => 'Campana de prueba',
        'offer' => '15% de descuento',
        'creatives' => null,
        'ad_groups' => null,
    ]);

    $preview = $this->previewer->preview($proposal);

    expect($preview['meta'][0])
        ->headline->toBe('Campana de prueba')
        ->primary_text->toBe('15% de descuento')
        ->cta->toBe('Más información');
});

it('collects creatives nested inside google ad groups', function () {
    $proposal = AdProposal::factory()->make([
        'platform' => 'google',
        'landing_page_url' => 'https://pro.ikonoverde.com/aceites',
        'creatives' => null,
        'ad_groups' => [
            [
                'name' => 'Aceites esenciales',
                'keywords' => ['aceites esenciales mayoreo', 'proveedor aceites'],
                'ads' => [
                    [
                        'headlines' => ['Aceites al mayoreo', 'Envio gratis'],
                        'descriptions' => ['Precios de distribuidor.'],
                    ],
                ],
            ],
        ],
    ]);

    $preview = $this->previewer->preview($proposal);

    expect($preview['google'])->toHaveCount(1);
    expect($preview['google'][0])
        ->ad_group->toBe('Aceites esenciales')
        ->headlines->toBe(['Aceites al mayoreo', 'Envio gratis'])
        ->descriptions->toBe(['Precios de distribuidor.'])
        ->keywords->toBe(['aceites esenciales mayoreo', 'proveedor aceites'])
        ->display_url->toBe('pro.ikonoverde.com');
});

it('promotes a single google headline string into the headline pool', function () {
    $proposal = AdProposal::factory()->make([
        'platform' => 'google',
        'creatives' => [
            ['headline' => 'Aceites al mayoreo', 'description' => 'Precios de distribuidor.'],
        ],
    ]);

    $preview = $this->previewer->preview($proposal);

    expect($preview['google'][0]['headlines'])->toBe(['Aceites al mayoreo']);
    expect($preview['google'][0]['descriptions'])->toBe(['Precios de distribuidor.']);
});

it('caps google assets at the platform limits', function () {
    $proposal = AdProposal::factory()->make([
        'platform' => 'google',
        'creatives' => [
            [
                'headlines' => array_map(fn (int $index): string => "Titular {$index}", range(1, 20)),
                'descriptions' => array_map(fn (int $index): string => "Descripcion {$index}", range(1, 8)),
            ],
        ],
    ]);

    $preview = $this->previewer->preview($proposal);

    expect($preview['google'][0]['headlines'])->toHaveCount(15);
    expect($preview['google'][0]['descriptions'])->toHaveCount(4);
});

it('only builds previews for the proposal platform', function () {
    $proposal = AdProposal::factory()->make(['platform' => 'google']);

    $preview = $this->previewer->preview($proposal);

    expect($preview['meta'])->toBe([]);
    expect($preview['google'])->not->toBeEmpty();
});
