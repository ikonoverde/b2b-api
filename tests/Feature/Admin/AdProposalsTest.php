<?php

use App\Models\AdProposal;
use App\Models\User;

test('admin can view ad proposals', function () {
    $admin = User::factory()->admin()->create();

    AdProposal::factory()->create([
        'platform' => 'meta',
        'name' => 'Retargeting verano',
    ]);

    $response = $this->actingAs($admin)->get('/admin/ad-proposals');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/ad-proposals/Index')
        ->where('proposals.total', 1)
        ->where('proposals.data.0.name', 'Retargeting verano')
        ->where('proposals.data.0.platform', 'meta')
        ->has('filters')
    );
});

test('admin can search ad proposals', function () {
    $admin = User::factory()->admin()->create();

    AdProposal::factory()->create(['name' => 'Retargeting verano']);
    AdProposal::factory()->create(['name' => 'Prospeccion invierno']);

    $response = $this->actingAs($admin)->get('/admin/ad-proposals?search=verano');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('proposals.total', 1)
        ->where('proposals.data.0.name', 'Retargeting verano')
        ->where('filters.search', 'verano')
    );
});

test('admin can filter ad proposals by platform', function () {
    $admin = User::factory()->admin()->create();

    AdProposal::factory()->create(['platform' => 'meta', 'name' => 'Meta draft']);
    AdProposal::factory()->create(['platform' => 'google', 'name' => 'Google draft']);

    $response = $this->actingAs($admin)->get('/admin/ad-proposals?platform=google');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('proposals.total', 1)
        ->where('proposals.data.0.name', 'Google draft')
        ->where('filters.platform', 'google')
    );
});

test('admin can filter ad proposals by status', function () {
    $admin = User::factory()->admin()->create();

    AdProposal::factory()->create(['status' => 'draft', 'name' => 'Borrador']);
    AdProposal::factory()->create(['status' => 'approved', 'name' => 'Aprobada']);

    $response = $this->actingAs($admin)->get('/admin/ad-proposals?status=approved');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('proposals.total', 1)
        ->where('proposals.data.0.name', 'Aprobada')
        ->where('filters.status', 'approved')
    );
});

test('admin can view a meta ad proposal with rendered creatives', function () {
    $admin = User::factory()->admin()->create();

    $proposal = AdProposal::factory()->create([
        'platform' => 'meta',
        'name' => 'Retargeting verano',
        'landing_page_url' => 'https://pro.ikonoverde.com/aceites',
        'creatives' => [
            [
                'primary_text' => 'Aceites esenciales para tu spa.',
                'headline' => 'Mayoreo con envio gratis',
                'description' => 'Precios de distribuidor',
                'call_to_action' => 'Comprar ahora',
            ],
        ],
    ]);

    $response = $this->actingAs($admin)->get("/admin/ad-proposals/{$proposal->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/ad-proposals/Show')
        ->where('proposal.id', $proposal->id)
        ->where('preview.platform', 'meta')
        ->where('preview.brand.display_url', 'pro.ikonoverde.com')
        ->where('preview.meta.0.headline', 'Mayoreo con envio gratis')
        ->where('preview.meta.0.cta', 'Comprar ahora')
        ->where('preview.google', [])
    );
});

test('admin can view a google ad proposal with rendered creatives', function () {
    $admin = User::factory()->admin()->create();

    $proposal = AdProposal::factory()->create([
        'platform' => 'google',
        'landing_page_url' => 'https://pro.ikonoverde.com/aceites',
        'creatives' => [
            [
                'headlines' => ['Aceites al mayoreo', 'Envio gratis', 'Precios de distribuidor'],
                'descriptions' => ['Compra aceites esenciales al mayoreo.'],
            ],
        ],
    ]);

    $response = $this->actingAs($admin)->get("/admin/ad-proposals/{$proposal->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/ad-proposals/Show')
        ->where('preview.platform', 'google')
        ->where('preview.google.0.headlines.0', 'Aceites al mayoreo')
        ->where('preview.google.0.display_url', 'pro.ikonoverde.com')
        ->where('preview.meta', [])
    );
});

test('non-admin cannot access ad proposals', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/admin/ad-proposals')->assertForbidden();

    $proposal = AdProposal::factory()->create();

    $this->actingAs($user)->get("/admin/ad-proposals/{$proposal->id}")->assertForbidden();
});
