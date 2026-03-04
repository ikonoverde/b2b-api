<?php

use App\Models\StaticPage;
use App\Models\User;

test('admin can view static pages index', function () {
    $admin = User::factory()->admin()->create();
    StaticPage::factory(4)->create();

    $response = $this->actingAs($admin)->get('/admin/static-pages');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Content/StaticPages')
        ->has('pages', 4)
    );
});

test('admin can view static page edit form', function () {
    $admin = User::factory()->admin()->create();
    $page = StaticPage::factory()->create(['slug' => 'terms', 'title' => 'Términos']);

    $response = $this->actingAs($admin)->get("/admin/static-pages/{$page->id}/edit");

    $response->assertSuccessful();
    $response->assertInertia(fn ($inertia) => $inertia
        ->component('Content/StaticPages/Edit')
        ->where('page.slug', 'terms')
        ->where('page.title', 'Términos')
    );
});

test('admin can update a static page', function () {
    $admin = User::factory()->admin()->create();
    $page = StaticPage::factory()->create(['title' => 'Old Title']);

    $response = $this->actingAs($admin)->put("/admin/static-pages/{$page->id}", [
        'title' => 'New Title',
        'content' => '## Updated Content',
        'is_published' => true,
    ]);

    $response->assertRedirect('/admin/static-pages');
    expect($page->fresh()->title)->toBe('New Title');
    expect($page->fresh()->content)->toBe('## Updated Content');
});

test('static page update requires title and content', function () {
    $admin = User::factory()->admin()->create();
    $page = StaticPage::factory()->create();

    $response = $this->actingAs($admin)->put("/admin/static-pages/{$page->id}", []);

    $response->assertSessionHasErrors(['title', 'content']);
});

test('unauthenticated user cannot access static pages admin', function () {
    $response = $this->get('/admin/static-pages');

    $response->assertRedirect('/admin/login');
});
