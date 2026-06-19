<?php

use App\Models\BlogPost;

test('blog index renders published posts', function () {
    $post = BlogPost::factory()->create([
        'title' => 'Guía de compra profesional',
        'slug' => 'guia-compra-profesional',
    ]);

    $response = $this->get('/blog');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Blog/Index')
        ->has('posts.data', 1)
        ->where('posts.data.0.slug', $post->slug)
    );
});

test('blog index hides unpublished and scheduled posts', function () {
    $published = BlogPost::factory()->create(['slug' => 'published-post']);
    BlogPost::factory()->unpublished()->create(['slug' => 'draft-post']);
    BlogPost::factory()->scheduled()->create(['slug' => 'scheduled-post']);

    $response = $this->get('/blog');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Blog/Index')
        ->has('posts.data', 1)
        ->where('posts.data.0.slug', $published->slug)
    );
});

test('blog show renders a published post', function () {
    $post = BlogPost::factory()->create([
        'title' => 'Cómo elegir un producto',
        'slug' => 'como-elegir-un-producto',
        'content' => '## Contenido de prueba',
    ]);

    $response = $this->get("/blog/{$post->slug}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Blog/Show')
        ->where('post.slug', $post->slug)
        ->where('post.title', 'Cómo elegir un producto')
    );
});

test('blog show returns not found for unpublished posts', function () {
    $post = BlogPost::factory()->unpublished()->create(['slug' => 'draft-post']);

    $response = $this->get("/blog/{$post->slug}");

    $response->assertNotFound();
});

test('blog show returns not found for scheduled posts', function () {
    $post = BlogPost::factory()->scheduled()->create(['slug' => 'scheduled-post']);

    $response = $this->get("/blog/{$post->slug}");

    $response->assertNotFound();
});
