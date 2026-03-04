<?php

use App\Models\StaticPage;

test('can retrieve a published static page by slug', function () {
    StaticPage::factory()->create([
        'slug' => 'terms',
        'title' => 'Términos y Condiciones',
        'content' => '## Test Content',
        'is_published' => true,
    ]);

    $response = $this->getJson('/api/pages/terms');

    $response->assertSuccessful();
    $response->assertJsonPath('data.slug', 'terms');
    $response->assertJsonPath('data.title', 'Términos y Condiciones');
    $response->assertJsonPath('data.content', '## Test Content');
});

test('returns 404 for unpublished page', function () {
    StaticPage::factory()->unpublished()->create(['slug' => 'draft']);

    $response = $this->getJson('/api/pages/draft');

    $response->assertNotFound();
});

test('returns 404 for non-existent slug', function () {
    $response = $this->getJson('/api/pages/nonexistent');

    $response->assertNotFound();
});

test('static page endpoint returns correct structure', function () {
    StaticPage::factory()->create(['slug' => 'about']);

    $response = $this->getJson('/api/pages/about');

    $response->assertJsonStructure([
        'data' => ['slug', 'title', 'content', 'updated_at'],
    ]);
});

test('static pages endpoint is publicly accessible', function () {
    StaticPage::factory()->create(['slug' => 'faq']);

    $response = $this->getJson('/api/pages/faq');

    $response->assertSuccessful();
});
