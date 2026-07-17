<?php

use App\Ai\Agents\BrandAgent;
use App\Ai\Agents\ContentAgent;
use App\Ai\Tools\Blog\CreateBlogPost;
use App\Ai\Tools\Blog\EditBlogPost;
use App\Ai\Tools\Blog\GetBlogPost;
use App\Ai\Tools\Blog\ListBlogPosts;
use App\Ai\Tools\Growth\FetchGrowthTask;
use App\Ai\Tools\Images\GenerateImage;
use App\Ai\Tools\Marketing\MarketingProductCatalog;
use App\Ai\Tools\StaticPages\EditStaticPage;
use App\Ai\Tools\StaticPages\GetStaticPage;
use App\Ai\Tools\StaticPages\ListStaticPages;
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

/**
 * A static page edit lands on a live URL with no draft step in between, which is the opposite of how
 * the blog tools behave. The agent is told so, because a model that treats a page like a draft will
 * send a fragment and delete a terms of service.
 */
it('knows that static page edits are live immediately', function () {
    $instructions = (string) (new ContentAgent)->instructions();

    expect($instructions)
        ->toContain('Static pages are the exception')
        ->toContain('Never send a fragment')
        ->toContain('Treat terms and privacy as legal copy');
});

/**
 * The agent that invents its own editorial plan while open tasks sit on file is doing a second plan
 * that competes with the first, and its report reads like progress either way.
 */
it('is told to read the growth plan before deciding what to do', function () {
    $instructions = (string) (new ContentAgent)->instructions();

    expect($instructions)
        ->toContain('Call growth_fetch_task before you decide what to do')
        ->toContain('rather than inventing work to fill the silence')
        ->toContain('nothing you hold can close one');
});

it('can write and revise posts, edit the static pages, and ask the brand reviewer', function () {
    $tools = collect((new ContentAgent)->tools())->map(fn (object $tool): string => $tool::class);

    expect($tools->all())
        ->toContain(MarketingProductCatalog::class)
        ->toContain(FetchGrowthTask::class)
        ->toContain(ListBlogPosts::class)
        ->toContain(GetBlogPost::class)
        ->toContain(CreateBlogPost::class)
        ->toContain(EditBlogPost::class)
        ->toContain(ListStaticPages::class)
        ->toContain(GetStaticPage::class)
        ->toContain(EditStaticPage::class)
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
