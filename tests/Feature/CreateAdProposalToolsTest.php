<?php

use App\Ai\Tools\Ads\CreateGoogleAdProposal;
use App\Ai\Tools\Ads\CreateMetaAdProposal;
use App\Models\AdProposal;
use Laravel\Ai\Tools\Request;

it('creates a draft meta ad proposal', function () {
    $payload = json_decode((string) app(CreateMetaAdProposal::class)->handle(new Request([
        'name' => 'Retargeting viveros Merida',
        'objective' => 'sales',
        'budget_amount' => 12000,
        'budget_period' => 'monthly',
        'audience' => 'Dueños de viveros y paisajistas en Yucatan',
        'geography' => 'Merida, Yucatan',
        'landing_page_url' => 'https://pro.ikonoverde.com/productos',
        'offer' => 'Fertilizantes con precios publicos y sin minimo de compra',
        'campaign_structure' => [
            'campaigns' => [
                ['name' => 'Retargeting catalogo', 'objective' => 'sales'],
            ],
        ],
        'creatives' => [
            ['hook' => 'Compra profesional sin minimo', 'cta' => 'Ver productos'],
        ],
        'tracking_plan' => ['events' => ['view_content', 'add_to_cart', 'purchase']],
        'success_metrics' => ['target_roas' => 3.0],
        'assumptions' => ['Pixel and CAPI are testable before launch.'],
    ])), true, 512, JSON_THROW_ON_ERROR);

    $proposal = AdProposal::query()->sole();

    expect($payload)
        ->toMatchArray([
            'proposal_id' => $proposal->id,
            'platform' => 'meta',
            'status' => 'draft',
            'name' => 'Retargeting viveros Merida',
            'objective' => 'sales',
        ])
        ->and($payload['summary'])->toContain('No external ad platform changes were made')
        ->and($proposal->platform)->toBe('meta')
        ->and($proposal->status)->toBe('draft')
        ->and($proposal->budget_amount)->toBe('12000.00')
        ->and($proposal->currency)->toBe('MXN')
        ->and($proposal->created_by_agent)->toBeTrue()
        ->and($proposal->campaign_structure['campaigns'][0]['name'])->toBe('Retargeting catalogo')
        ->and($proposal->creatives[0]['hook'])->toBe('Compra profesional sin minimo');
});

it('stores a generated image url on a meta creative', function () {
    app(CreateMetaAdProposal::class)->handle(new Request([
        'name' => 'Retargeting viveros Merida',
        'objective' => 'sales',
        'creatives' => [
            [
                'headline' => 'Aceites al mayoreo',
                'primary_text' => 'Compra profesional sin minimo',
                'cta' => 'Comprar ahora',
                'image_url' => 'https://cdn.ikonoverde.com/ads/aceites-mayoreo.webp',
            ],
        ],
    ]));

    $proposal = AdProposal::query()->sole();

    expect($proposal->creatives[0]['image_url'])
        ->toBe('https://cdn.ikonoverde.com/ads/aceites-mayoreo.webp');
});

it('creates a draft google ads proposal', function () {
    $payload = json_decode((string) app(CreateGoogleAdProposal::class)->handle(new Request([
        'name' => 'Busqueda fertilizantes profesionales',
        'objective' => 'high-intent search sales',
        'budget_amount' => 500,
        'budget_period' => 'daily',
        'currency' => 'mxn',
        'ad_groups' => [
            ['name' => 'Fertilizante soluble', 'match_types' => ['phrase', 'exact']],
        ],
        'keywords' => ['fertilizante soluble profesional', 'fertilizante para viveros'],
        'negative_keywords' => ['gratis', 'casero'],
        'success_metrics' => ['target_cpa' => 350],
    ])), true, 512, JSON_THROW_ON_ERROR);

    $proposal = AdProposal::query()->sole();

    expect($payload['proposal_id'])->toBe($proposal->id)
        ->and($proposal->platform)->toBe('google')
        ->and($proposal->status)->toBe('draft')
        ->and($proposal->currency)->toBe('MXN')
        ->and($proposal->ad_groups[0]['name'])->toBe('Fertilizante soluble')
        ->and($proposal->keywords)->toBe(['fertilizante soluble profesional', 'fertilizante para viveros'])
        ->and($proposal->negative_keywords)->toBe(['gratis', 'casero']);
});

it('returns validation errors without creating a proposal', function () {
    $payload = json_decode((string) app(CreateMetaAdProposal::class)->handle(new Request([
        'objective' => 'sales',
        'budget_period' => 'yearly',
    ])), true, 512, JSON_THROW_ON_ERROR);

    expect($payload['error'])->toBe('The name field is required.')
        ->and(AdProposal::query()->count())->toBe(0);
});
