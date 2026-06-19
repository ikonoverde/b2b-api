<?php

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can view blog posts index', function () {
    $admin = User::factory()->admin()->create();
    BlogPost::factory(3)->create();

    $response = $this->actingAs($admin)->get('/admin/blog-posts');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/blog-posts/Index')
        ->has('posts.data', 3)
    );
});

test('admin can view blog post create form', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/admin/blog-posts/create');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/blog-posts/Create')
    );
});

test('admin can create a blog post with cover image', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/blog-posts', [
        'title' => 'Nuevo blog',
        'slug' => 'nuevo-blog',
        'excerpt' => 'Un extracto breve',
        'content' => '## Contenido',
        'cover_image' => UploadedFile::fake()->image('cover.jpg'),
        'is_published' => true,
        'published_at' => now()->format('Y-m-d H:i:s'),
    ]);

    $response->assertRedirect('/admin/blog-posts');
    $post = BlogPost::query()->where('slug', 'nuevo-blog')->firstOrFail();

    expect($post->title)->toBe('Nuevo blog');
    expect($post->is_published)->toBeTrue();
    expect($post->cover_image_path)->not->toBeNull();
    Storage::disk('public')->assertExists($post->cover_image_path);
});

test('admin can update a blog post and replace cover image', function () {
    Storage::fake('public');
    Storage::disk('public')->put('blog/covers/old.jpg', 'old');
    $admin = User::factory()->admin()->create();
    $post = BlogPost::factory()->create([
        'cover_image_path' => 'blog/covers/old.jpg',
        'slug' => 'old-slug',
    ]);

    $response = $this->actingAs($admin)->post("/admin/blog-posts/{$post->id}", [
        '_method' => 'PUT',
        'title' => 'Entrada actualizada',
        'slug' => 'entrada-actualizada',
        'excerpt' => 'Extracto actualizado',
        'content' => 'Contenido actualizado',
        'cover_image' => UploadedFile::fake()->image('new-cover.png'),
        'is_published' => false,
        'published_at' => null,
    ]);

    $response->assertRedirect('/admin/blog-posts');
    $post->refresh();

    expect($post->title)->toBe('Entrada actualizada');
    expect($post->slug)->toBe('entrada-actualizada');
    expect($post->is_published)->toBeFalse();
    expect($post->cover_image_path)->not->toBe('blog/covers/old.jpg');
    Storage::disk('public')->assertMissing('blog/covers/old.jpg');
    Storage::disk('public')->assertExists($post->cover_image_path);
});

test('admin can delete a blog post', function () {
    Storage::fake('public');
    Storage::disk('public')->put('blog/covers/delete.jpg', 'delete');
    $admin = User::factory()->admin()->create();
    $post = BlogPost::factory()->create(['cover_image_path' => 'blog/covers/delete.jpg']);

    $response = $this->actingAs($admin)->delete("/admin/blog-posts/{$post->id}");

    $response->assertRedirect('/admin/blog-posts');
    $this->assertSoftDeleted($post);
    Storage::disk('public')->assertMissing('blog/covers/delete.jpg');
});

test('blog post create requires title and content', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/blog-posts', []);

    $response->assertSessionHasErrors(['title', 'content']);
});

test('guest cannot access blog posts admin', function () {
    $response = $this->get('/admin/blog-posts');

    $response->assertRedirect('/admin/login');
});
