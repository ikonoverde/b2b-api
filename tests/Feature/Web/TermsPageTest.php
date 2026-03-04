<?php

declare(strict_types=1);

use App\Models\StaticPage;
use App\Models\User;

it('displays the terms page', function () {
    StaticPage::factory()->create(['slug' => 'terms', 'is_published' => true]);

    $response = $this->get('/terms');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('StaticPage')
            ->has('page')
            ->where('page.slug', 'terms')
        );
});

it('displays terms page without authentication', function () {
    StaticPage::factory()->create(['slug' => 'terms', 'is_published' => true]);

    $response = $this->get('/terms');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('StaticPage')
            ->has('auth.user', null)
        );
});

it('displays terms page for authenticated users', function () {
    StaticPage::factory()->create(['slug' => 'terms', 'is_published' => true]);
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/terms');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('StaticPage')
            ->has('auth.user')
            ->where('auth.user.id', $user->id)
        );
});

it('contains page content', function () {
    StaticPage::factory()->create([
        'slug' => 'terms',
        'title' => 'Términos y Condiciones',
        'content' => '## Test Content',
        'is_published' => true,
    ]);

    $response = $this->get('/terms');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('StaticPage')
            ->where('page.title', 'Términos y Condiciones')
            ->where('page.content', '## Test Content')
        );
});

it('returns 404 when page not seeded', function () {
    $response = $this->get('/terms');

    $response->assertNotFound();
});
