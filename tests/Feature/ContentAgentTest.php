<?php

use App\Ai\Agents\BrandAgent;
use App\Ai\Agents\ContentAgent;
use App\Ai\Tools\Blog\CreateBlogPost;
use App\Ai\Tools\Blog\EditBlogPost;
use App\Ai\Tools\Blog\GetBlogPost;
use App\Ai\Tools\GenerateImage;
use App\Ai\Tools\MarketingProductCatalog;
use App\Models\BlogPost;
use Illuminate\JsonSchema\JsonSchemaTypeFactory;
use Laravel\Ai\Tools\Request;

it('carries the pre-launch editorial rules', function () {
    $instructions = (string) (new ContentAgent)->instructions();

    expect($instructions)
        ->toContain('You write drafts. You cannot publish, and you must not say that you did.')
        ->toContain('Organic content is the one channel that compounds')
        ->toContain('Never state a price in a post')
        ->toContain('One post serves one intent')
        ->toContain('send it to brand_reviewer');
});

it('can write and revise posts, and can ask the brand reviewer', function () {
    $tools = collect((new ContentAgent)->tools())->map(fn (object $tool): string => $tool::class);

    expect($tools->all())
        ->toContain(MarketingProductCatalog::class)
        ->toContain(GetBlogPost::class)
        ->toContain(CreateBlogPost::class)
        ->toContain(EditBlogPost::class)
        ->toContain(GenerateImage::class)
        ->toContain(BrandAgent::class);
});

/**
 * The publication fields are absent from the schema, so a well-behaved model cannot even ask to
 * publish. The tests below cover the other case: a model that asks anyway.
 */
it('does not offer the model any way to publish', function () {
    $fields = array_keys(app(CreateBlogPost::class)->schema(new JsonSchemaTypeFactory));

    expect($fields)
        ->not->toContain('is_published')
        ->not->toContain('published_at');
});

it('creates an unpublished draft even when the model asks for a published post', function () {
    $response = app(CreateBlogPost::class)->handle(new Request([
        'title' => 'Aceites de masaje para spas',
        'content' => '# Aceites',
        'is_published' => true,
        'published_at' => now()->subDay()->toISOString(),
    ]));

    $payload = json_decode((string) $response, true);
    $post = BlogPost::query()->firstOrFail();

    expect($payload['is_published'])->toBeFalse()
        ->and($payload['published_at'])->toBeNull()
        ->and($post->is_published)->toBeFalse()
        ->and($post->published_at)->toBeNull()
        ->and($post->isPubliclyVisible())->toBeFalse();
});

/**
 * A backdated published_at is the other way onto the storefront: is_published alone does nothing
 * without it, and it alone does nothing without is_published. Neither may come from the model.
 */
it('cannot publish an existing post by editing it', function () {
    $post = BlogPost::factory()->create([
        'is_published' => false,
        'published_at' => null,
    ]);

    app(EditBlogPost::class)->handle(new Request([
        'id' => $post->id,
        'content' => 'Contenido actualizado.',
        'is_published' => true,
        'published_at' => now()->subDay()->toISOString(),
    ]));

    $post->refresh();

    expect($post->content)->toBe('Contenido actualizado.')
        ->and($post->is_published)->toBeFalse()
        ->and($post->published_at)->toBeNull();
});

it('cannot take a live post down by editing it', function () {
    $post = BlogPost::factory()->create([
        'is_published' => true,
        'published_at' => now()->subDay(),
    ]);

    app(EditBlogPost::class)->handle(new Request([
        'id' => $post->id,
        'is_published' => false,
    ]));

    expect($post->refresh()->is_published)->toBeTrue();
});
