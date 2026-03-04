<?php

use App\Models\StaticPage;

test('terms page renders content from database', function () {
    StaticPage::factory()->create([
        'slug' => 'terms',
        'title' => 'Términos y Condiciones',
        'content' => '## Test Terms Content',
        'is_published' => true,
    ]);

    $response = $this->get('/terms');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('StaticPage')
        ->where('page.slug', 'terms')
        ->where('page.title', 'Términos y Condiciones')
    );
});

test('privacy page renders content from database', function () {
    StaticPage::factory()->create([
        'slug' => 'privacy',
        'title' => 'Política de Privacidad',
        'is_published' => true,
    ]);

    $response = $this->get('/privacy');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('StaticPage')
        ->where('page.slug', 'privacy')
    );
});

test('about page renders content from database', function () {
    StaticPage::factory()->create([
        'slug' => 'about',
        'title' => 'Acerca de Nosotros',
        'is_published' => true,
    ]);

    $response = $this->get('/about');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('StaticPage')
        ->where('page.slug', 'about')
    );
});

test('faq page renders content from database', function () {
    StaticPage::factory()->create([
        'slug' => 'faq',
        'title' => 'Preguntas Frecuentes',
        'is_published' => true,
    ]);

    $response = $this->get('/faq');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('StaticPage')
        ->where('page.slug', 'faq')
    );
});

test('unpublished page returns 404', function () {
    StaticPage::factory()->unpublished()->create(['slug' => 'terms']);

    $response = $this->get('/terms');

    $response->assertNotFound();
});

test('page without seeded content returns 404', function () {
    $response = $this->get('/terms');

    $response->assertNotFound();
});
