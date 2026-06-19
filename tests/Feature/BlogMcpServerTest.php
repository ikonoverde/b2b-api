<?php

use App\Mcp\Servers\BlogServer;
use App\Mcp\Tools\CreateBlogPostTool;
use App\Mcp\Tools\EditBlogPostTool;
use App\Mcp\Tools\GetBlogPostTool;
use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Storage;
use Laravel\Passport\Passport;

it('requires authentication for the blog mcp http server', function () {
    $this->postJson('/mcp/blog', [
        'jsonrpc' => '2.0',
        'id' => 1,
        'method' => 'initialize',
        'params' => [
            'protocolVersion' => '2025-06-18',
            'capabilities' => [],
            'clientInfo' => [
                'name' => 'test-client',
                'version' => '1.0.0',
            ],
        ],
    ])->assertUnauthorized();
});

it('allows mcp initialization with oauth authentication', function () {
    /** @var Authenticatable $admin */
    $admin = User::factory()->admin()->create();

    Passport::actingAs($admin, ['mcp:use']);

    $response = $this->postJson('/mcp/blog', [
        'jsonrpc' => '2.0',
        'id' => 1,
        'method' => 'initialize',
        'params' => [
            'protocolVersion' => '2025-06-18',
            'capabilities' => [],
            'clientInfo' => [
                'name' => 'test-client',
                'version' => '1.0.0',
            ],
        ],
    ]);

    $response
        ->assertOk()
        ->assertHeader('MCP-Session-Id')
        ->assertJsonPath('result.serverInfo.name', 'Blog Server');
});

it('creates a draft blog post through the mcp tool', function () {
    $admin = User::factory()->admin()->create();

    $response = BlogServer::actingAs($admin)->tool(CreateBlogPostTool::class, [
        'title' => 'Guía para compradores profesionales',
        'content' => '## Contenido de prueba',
    ]);

    $response
        ->assertOk()
        ->assertName('create-blog-post')
        ->assertSee([
            'guia-para-compradores-profesionales',
            'is_published',
        ]);

    $this->assertDatabaseHas('blog_posts', [
        'title' => 'Guía para compradores profesionales',
        'slug' => 'guia-para-compradores-profesionales',
        'is_published' => false,
        'cover_image_path' => null,
    ]);
});

it('creates a published blog post with an existing storage cover image', function () {
    Storage::fake('public');
    Storage::disk('public')->put('blog/covers/existing.webp', 'image');
    $admin = User::factory()->admin()->create();

    BlogServer::actingAs($admin)->tool(CreateBlogPostTool::class, [
        'title' => 'Nuevo lanzamiento',
        'slug' => 'nuevo-lanzamiento',
        'excerpt' => 'Resumen breve',
        'content' => 'Contenido del lanzamiento',
        'cover_image_path' => '/storage/blog/covers/existing.webp',
        'is_published' => true,
        'published_at' => now()->toISOString(),
    ])->assertOk();

    $post = BlogPost::query()->where('slug', 'nuevo-lanzamiento')->firstOrFail();

    expect($post->is_published)->toBeTrue()
        ->and($post->cover_image_path)->toBe('blog/covers/existing.webp')
        ->and($post->isPubliclyVisible())->toBeTrue();
});

it('creates a blog post with an existing absolute local storage cover image path', function () {
    Storage::fake('public');
    Storage::disk('public')->put('blog/covers/local.webp', 'image');
    $admin = User::factory()->admin()->create();

    BlogServer::actingAs($admin)->tool(CreateBlogPostTool::class, [
        'title' => 'Imagen local',
        'content' => 'Contenido con imagen local',
        'cover_image_path' => Storage::disk('public')->path('blog/covers/local.webp'),
    ])->assertOk();

    $this->assertDatabaseHas('blog_posts', [
        'slug' => 'imagen-local',
        'cover_image_path' => 'blog/covers/local.webp',
    ]);
});

it('rejects missing cover image paths', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();

    BlogServer::actingAs($admin)->tool(CreateBlogPostTool::class, [
        'title' => 'Imagen faltante',
        'content' => 'Contenido',
        'cover_image_path' => 'blog/covers/missing.webp',
    ])->assertHasErrors([
        'The cover_image_path must reference an existing PNG, JPG, JPEG, or WebP image on the public storage disk.',
    ]);

    $this->assertDatabaseMissing('blog_posts', [
        'slug' => 'imagen-faltante',
    ]);
});

it('rejects non image cover image paths', function () {
    Storage::fake('public');
    Storage::disk('public')->put('blog/covers/not-image.txt', 'not an image');
    $admin = User::factory()->admin()->create();

    BlogServer::actingAs($admin)->tool(CreateBlogPostTool::class, [
        'title' => 'Imagen invalida',
        'content' => 'Contenido',
        'cover_image_path' => 'blog/covers/not-image.txt',
    ])->assertHasErrors([
        'The cover_image_path must reference an existing PNG, JPG, JPEG, or WebP image on the public storage disk.',
    ]);

    $this->assertDatabaseMissing('blog_posts', [
        'slug' => 'imagen-invalida',
    ]);
});

it('rejects duplicate slugs', function () {
    BlogPost::factory()->create(['slug' => 'duplicated']);
    $admin = User::factory()->admin()->create();

    BlogServer::actingAs($admin)->tool(CreateBlogPostTool::class, [
        'title' => 'Duplicated',
        'slug' => 'duplicated',
        'content' => 'Contenido',
    ])->assertHasErrors([
        'A blog post with this slug already exists.',
    ]);
});

it('gets blog post details by id through the mcp tool', function () {
    $admin = User::factory()->admin()->create();
    $post = BlogPost::factory()->create([
        'title' => 'Detalle completo',
        'slug' => 'detalle-completo',
        'excerpt' => 'Resumen del detalle',
        'content' => '## Markdown del detalle',
        'cover_image_path' => 'blog/covers/detail.webp',
    ]);

    $response = BlogServer::actingAs($admin)->tool(GetBlogPostTool::class, [
        'id' => $post->id,
    ]);

    $response
        ->assertOk()
        ->assertName('get-blog-post')
        ->assertSee([
            'Detalle completo',
            'detalle-completo',
            '## Markdown del detalle',
            'blog/covers/detail.webp',
            'is_publicly_visible',
        ]);
});

it('gets blog post details by slug through the mcp tool', function () {
    $admin = User::factory()->admin()->create();
    $post = BlogPost::factory()->scheduled()->create([
        'title' => 'Publicacion programada',
        'slug' => 'publicacion-programada',
        'content' => 'Contenido programado',
    ]);

    $response = BlogServer::actingAs($admin)->tool(GetBlogPostTool::class, [
        'slug' => " {$post->slug} ",
    ]);

    $response
        ->assertOk()
        ->assertSee([
            'Publicacion programada',
            'publicacion-programada',
            'Contenido programado',
        ]);
});

it('requires an id or slug when getting blog post details', function () {
    $admin = User::factory()->admin()->create();

    BlogServer::actingAs($admin)->tool(GetBlogPostTool::class, [
        'slug' => ' ',
    ])->assertHasErrors([
        'Provide either id or slug to choose the blog post to retrieve.',
    ]);
});

it('edits a blog post and adds a cover image through the mcp tool', function () {
    Storage::fake('public');
    Storage::disk('public')->put('blog/covers/added.webp', 'image');
    $admin = User::factory()->admin()->create();
    $post = BlogPost::factory()->unpublished()->create([
        'title' => 'Borrador original',
        'slug' => 'borrador-original',
        'cover_image_path' => null,
    ]);

    $response = BlogServer::actingAs($admin)->tool(EditBlogPostTool::class, [
        'id' => $post->id,
        'title' => 'Borrador actualizado',
        'content' => 'Contenido actualizado',
        'cover_image_path' => '/storage/blog/covers/added.webp',
    ]);

    $response
        ->assertOk()
        ->assertName('edit-blog-post')
        ->assertSee([
            'Borrador actualizado',
            'blog/covers/added.webp',
        ]);

    $post->refresh();

    expect($post->title)->toBe('Borrador actualizado')
        ->and($post->content)->toBe('Contenido actualizado')
        ->and($post->cover_image_path)->toBe('blog/covers/added.webp');
});

it('edits a blog post by current slug and replaces the cover image path', function () {
    Storage::fake('public');
    Storage::disk('public')->put('blog/covers/old.webp', 'old');
    Storage::disk('public')->put('blog/covers/new.webp', 'new');
    $admin = User::factory()->admin()->create();
    $post = BlogPost::factory()->create([
        'slug' => 'old-slug',
        'cover_image_path' => 'blog/covers/old.webp',
    ]);

    BlogServer::actingAs($admin)->tool(EditBlogPostTool::class, [
        'current_slug' => $post->slug,
        'slug' => 'new-slug',
        'cover_image_path' => Storage::disk('public')->path('blog/covers/new.webp'),
        'is_published' => true,
        'published_at' => now()->toISOString(),
    ])->assertOk();

    $post->refresh();

    expect($post->slug)->toBe('new-slug')
        ->and($post->cover_image_path)->toBe('blog/covers/new.webp')
        ->and($post->isPubliclyVisible())->toBeTrue();
});

it('ignores null optional fields while partially editing a blog post', function () {
    Storage::fake('public');
    Storage::disk('public')->put('blog/covers/partial.webp', 'image');
    $admin = User::factory()->admin()->create();
    $post = BlogPost::factory()->create([
        'title' => 'Titulo original',
        'slug' => 'titulo-original',
        'excerpt' => 'Resumen original',
        'content' => 'Contenido original',
        'cover_image_path' => null,
    ]);

    BlogServer::actingAs($admin)->tool(EditBlogPostTool::class, [
        'id' => $post->id,
        'current_slug' => null,
        'title' => null,
        'slug' => null,
        'excerpt' => null,
        'content' => null,
        'cover_image_path' => 'blog/covers/partial.webp',
        'is_published' => null,
        'published_at' => null,
    ])->assertOk();

    $post->refresh();

    expect($post->title)->toBe('Titulo original')
        ->and($post->slug)->toBe('titulo-original')
        ->and($post->excerpt)->toBe('Resumen original')
        ->and($post->content)->toBe('Contenido original')
        ->and($post->published_at)->not->toBeNull()
        ->and($post->cover_image_path)->toBe('blog/covers/partial.webp');
});

it('clears nullable blog post fields with empty strings while editing', function () {
    $admin = User::factory()->admin()->create();
    $post = BlogPost::factory()->create([
        'excerpt' => 'Resumen original',
        'cover_image_path' => 'blog/covers/original.webp',
    ]);

    BlogServer::actingAs($admin)->tool(EditBlogPostTool::class, [
        'id' => $post->id,
        'excerpt' => ' ',
        'cover_image_path' => ' ',
        'published_at' => ' ',
    ])->assertOk();

    $post->refresh();

    expect($post->excerpt)->toBeNull()
        ->and($post->cover_image_path)->toBeNull()
        ->and($post->published_at)->toBeNull();
});

it('rejects duplicate slugs when editing blog posts', function () {
    $existing = BlogPost::factory()->create(['slug' => 'existing-slug']);
    $post = BlogPost::factory()->create(['slug' => 'editable-slug']);
    $admin = User::factory()->admin()->create();

    BlogServer::actingAs($admin)->tool(EditBlogPostTool::class, [
        'id' => $post->id,
        'slug' => $existing->slug,
    ])->assertHasErrors([
        'A blog post with this slug already exists.',
    ]);

    expect($post->refresh()->slug)->toBe('editable-slug');
});

it('rejects missing cover image paths when editing blog posts', function () {
    Storage::fake('public');
    $post = BlogPost::factory()->create(['cover_image_path' => null]);
    $admin = User::factory()->admin()->create();

    BlogServer::actingAs($admin)->tool(EditBlogPostTool::class, [
        'id' => $post->id,
        'cover_image_path' => 'blog/covers/missing.webp',
    ])->assertHasErrors([
        'The cover_image_path must reference an existing PNG, JPG, JPEG, or WebP image on the public storage disk.',
    ]);

    expect($post->refresh()->cover_image_path)->toBeNull();
});

it('denies non admin users from creating blog posts', function () {
    $customer = User::factory()->create();

    BlogServer::actingAs($customer)->tool(CreateBlogPostTool::class, [
        'title' => 'No permitido',
        'content' => 'Contenido',
    ])->assertHasErrors([
        'Permission denied.',
    ]);

    $this->assertDatabaseMissing('blog_posts', [
        'slug' => 'no-permitido',
    ]);
});

it('denies non admin users from getting blog post details', function () {
    $customer = User::factory()->create();
    $post = BlogPost::factory()->create();

    BlogServer::actingAs($customer)->tool(GetBlogPostTool::class, [
        'id' => $post->id,
    ])->assertHasErrors([
        'Permission denied.',
    ]);
});

it('denies non admin users from editing blog posts', function () {
    $customer = User::factory()->create();
    $post = BlogPost::factory()->create(['title' => 'Original']);

    BlogServer::actingAs($customer)->tool(EditBlogPostTool::class, [
        'id' => $post->id,
        'title' => 'No permitido',
    ])->assertHasErrors([
        'Permission denied.',
    ]);

    expect($post->refresh()->title)->toBe('Original');
});
