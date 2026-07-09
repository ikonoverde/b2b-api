<?php

use App\Mcp\Servers\AdsServer;
use App\Mcp\Tools\Ads\CreateGoogleAdProposal;
use App\Mcp\Tools\Ads\CreateMetaAdProposal;
use App\Models\AdProposal;
use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;

it('creates a draft meta ad proposal for an admin', function () {
    $admin = User::factory()->admin()->create();

    AdsServer::actingAs($admin)->tool(CreateMetaAdProposal::class, [
        'name' => 'Retargeting viveros Merida',
        'objective' => 'sales',
        'budget_amount' => 12000,
        'budget_period' => 'monthly',
        'audience' => 'Dueños de viveros y paisajistas en Yucatan',
        'creatives' => [
            ['hook' => 'Compra profesional sin minimo', 'cta' => 'Ver productos'],
        ],
        'tracking_plan' => ['events' => ['view_content', 'purchase']],
    ])
        ->assertOk()
        ->assertName('create-meta-ad-proposal')
        ->assertSee('No external ad platform changes were made');

    $proposal = AdProposal::query()->sole();

    expect($proposal->platform)->toBe('meta')
        ->and($proposal->status)->toBe('draft')
        ->and($proposal->currency)->toBe('MXN')
        ->and($proposal->created_by_agent)->toBeTrue()
        ->and($proposal->budget_amount)->toBe('12000.00')
        ->and($proposal->creatives[0]['hook'])->toBe('Compra profesional sin minimo');
});

it('creates a draft google ads proposal for an admin', function () {
    $admin = User::factory()->admin()->create();

    AdsServer::actingAs($admin)->tool(CreateGoogleAdProposal::class, [
        'name' => 'Busqueda fertilizantes profesionales',
        'objective' => 'high-intent search sales',
        'currency' => 'mxn',
        'keywords' => ['fertilizante soluble profesional'],
        'negative_keywords' => ['gratis'],
    ])
        ->assertOk()
        ->assertName('create-google-ad-proposal')
        ->assertStructuredContent(fn (AssertableJson $json) => $json
            ->where('platform', 'google')
            ->where('status', 'draft')
            ->etc()
        );

    $proposal = AdProposal::query()->sole();

    expect($proposal->platform)->toBe('google')
        ->and($proposal->currency)->toBe('MXN')
        ->and($proposal->keywords)->toBe(['fertilizante soluble profesional'])
        ->and($proposal->negative_keywords)->toBe(['gratis']);
});

it('denies ad proposal tools to non admin users', function (string $tool) {
    $customer = User::factory()->create();

    AdsServer::actingAs($customer)->tool($tool, [
        'name' => 'Should never be stored',
        'objective' => 'sales',
    ])->assertHasErrors(['Permission denied.']);

    expect(AdProposal::query()->count())->toBe(0);
})->with([
    'meta' => CreateMetaAdProposal::class,
    'google' => CreateGoogleAdProposal::class,
]);

it('rejects a proposal without a name and stores nothing', function () {
    $admin = User::factory()->admin()->create();

    AdsServer::actingAs($admin)->tool(CreateMetaAdProposal::class, [
        'objective' => 'sales',
    ])->assertHasErrors();

    expect(AdProposal::query()->count())->toBe(0);
});

it('rejects an unsupported budget period', function () {
    $admin = User::factory()->admin()->create();

    AdsServer::actingAs($admin)->tool(CreateGoogleAdProposal::class, [
        'name' => 'Busqueda fertilizantes',
        'objective' => 'sales',
        'budget_period' => 'yearly',
    ])->assertHasErrors();

    expect(AdProposal::query()->count())->toBe(0);
});

it('treats a blank optional string as omitted', function () {
    $admin = User::factory()->admin()->create();

    AdsServer::actingAs($admin)->tool(CreateMetaAdProposal::class, [
        'name' => '  Retargeting catalogo  ',
        'objective' => 'sales',
        'landing_page_url' => '',
    ])->assertOk();

    $proposal = AdProposal::query()->sole();

    expect($proposal->name)->toBe('Retargeting catalogo')
        ->and($proposal->landing_page_url)->toBeNull();
});
