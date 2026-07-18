<?php

use App\Ai\Tools\StaticPages\CreateStaticPage;
use App\Ai\Tools\StaticPages\EditStaticPage;
use App\Ai\Tools\StaticPages\GetStaticPage;
use App\Ai\Tools\StaticPages\ListStaticPages;
use App\Models\StaticPage;
use Illuminate\JsonSchema\JsonSchemaTypeFactory;
use Laravel\Ai\Tools\Request;

/**
 * @param  array<string, mixed>  $arguments
 * @return array<string, mixed>
 */
function staticPageToolResult(object $tool, array $arguments = []): array
{
    return json_decode((string) $tool->handle(new Request($arguments)), true);
}

it('lists every static page without leaking its content', function () {
    StaticPage::factory()->create(['slug' => 'terms', 'title' => 'Términos y Condiciones']);
    StaticPage::factory()->create(['slug' => 'privacy', 'title' => 'Política de Privacidad']);

    $payload = staticPageToolResult(app(ListStaticPages::class));

    expect($payload['pages'])->toHaveCount(2)
        ->and($payload['pages'][0]['slug'])->toBe('privacy')
        ->and($payload['pages'][0])->not->toHaveKey('content');
});

/**
 * A page no route names has no URL, whatever is_published claims. Reporting one would be a lie the
 * model would happily pass on to a human.
 *
 * Since /terms, /privacy, /about and /faq render hardcoded components rather than database rows,
 * no static page is routed today — so this now holds for every slug, not just unrouted ones.
 */
it('reports no public URL for a page the storefront does not route', function () {
    StaticPage::factory()->create(['slug' => 'terms', 'is_published' => true]);

    $payload = staticPageToolResult(app(GetStaticPage::class), ['slug' => 'terms']);

    expect($payload['is_published'])->toBeTrue()
        ->and($payload['url'])->toBeNull()
        ->and($payload['is_publicly_visible'])->toBeFalse();
});

it('reads a page by slug, with its full content', function () {
    StaticPage::factory()->create(['slug' => 'faq', 'content' => '## Preguntas frecuentes']);

    $payload = staticPageToolResult(app(GetStaticPage::class), ['slug' => 'faq']);

    expect($payload['content'])->toBe('## Preguntas frecuentes');
});

it('explains itself when asked for a page that does not exist', function () {
    $payload = staticPageToolResult(app(GetStaticPage::class), ['slug' => 'devoluciones']);

    expect($payload['error'])->toContain('No static page exists');
});

it('creates a new page as an unpublished draft', function () {
    $payload = staticPageToolResult(app(CreateStaticPage::class), [
        'slug' => 'envios',
        'title' => 'Envíos',
        'content' => '## Política de envíos',
    ]);

    $page = StaticPage::query()->where('slug', 'envios')->firstOrFail();

    expect($payload['status'])->toBe('draft')
        ->and($payload['slug'])->toBe('envios')
        ->and($payload['content'])->toBe('## Política de envíos')
        ->and($payload['is_published'])->toBeFalse()
        ->and($page->is_published)->toBeFalse();
});

/**
 * The create tool runs unattended, so a model asking to publish must be refused the same way the edit
 * tool refuses it: the field never reaches the model, and even a hand-forged value is dropped.
 */
it('forces a draft even when asked to publish a new page', function () {
    staticPageToolResult(app(CreateStaticPage::class), [
        'slug' => 'devoluciones',
        'title' => 'Devoluciones',
        'content' => '## Devoluciones',
        'is_published' => true,
    ]);

    expect(StaticPage::query()->where('slug', 'devoluciones')->firstOrFail()->is_published)->toBeFalse();
});

it('does not offer the model any way to publish a new page', function () {
    $fields = array_keys(app(CreateStaticPage::class)->schema(new JsonSchemaTypeFactory));

    expect($fields)->not->toContain('is_published');
});

it('derives a slug from the title when none is given', function () {
    staticPageToolResult(app(CreateStaticPage::class), [
        'title' => 'Preguntas Frecuentes',
        'content' => '## FAQ',
    ]);

    expect(StaticPage::query()->where('slug', 'preguntas-frecuentes')->exists())->toBeTrue();
});

it('refuses to create a page whose slug already exists', function () {
    StaticPage::factory()->create(['slug' => 'terms']);

    $payload = staticPageToolResult(app(CreateStaticPage::class), [
        'slug' => 'terms',
        'title' => 'Términos',
        'content' => '## Términos',
    ]);

    expect($payload['error'])->toContain('already exists')
        ->and(StaticPage::query()->where('slug', 'terms')->count())->toBe(1);
});

it('rejects a slug that is not route-safe', function () {
    $payload = staticPageToolResult(app(CreateStaticPage::class), [
        'slug' => 'Políticas de Envío',
        'title' => 'Envíos',
        'content' => '## Envíos',
    ]);

    expect($payload['error'])->toContain('letters, numbers, dashes')
        ->and(StaticPage::query()->count())->toBe(0);
});

it('refuses to create a page with empty content', function () {
    $payload = staticPageToolResult(app(CreateStaticPage::class), [
        'slug' => 'envios',
        'title' => 'Envíos',
        'content' => '   ',
    ]);

    expect($payload['error'])->toContain('non-empty markdown content')
        ->and(StaticPage::query()->count())->toBe(0);
});

it('rewrites the title and content of an existing page', function () {
    $page = StaticPage::factory()->create([
        'slug' => 'about',
        'title' => 'Acerca de Nosotros',
        'content' => 'Texto viejo.',
    ]);

    $payload = staticPageToolResult(app(EditStaticPage::class), [
        'slug' => 'about',
        'content' => 'Texto nuevo.',
    ]);

    $page->refresh();

    expect($payload['content'])->toBe('Texto nuevo.')
        ->and($page->content)->toBe('Texto nuevo.')
        ->and($page->title)->toBe('Acerca de Nosotros');
});

/**
 * The publication field is absent from the schema, so a well-behaved model cannot even ask to take a
 * page down. The tests below cover the other case: a model that asks anyway.
 */
it('does not offer the model any way to publish or unpublish', function () {
    $fields = array_keys(app(EditStaticPage::class)->schema(new JsonSchemaTypeFactory));

    expect($fields)->not->toContain('is_published');
});

it('cannot 404 a live page by editing it', function () {
    $page = StaticPage::factory()->create(['slug' => 'terms', 'is_published' => true]);

    staticPageToolResult(app(EditStaticPage::class), [
        'slug' => 'terms',
        'content' => 'Términos actualizados.',
        'is_published' => false,
    ]);

    $page->refresh();

    expect($page->content)->toBe('Términos actualizados.')
        ->and($page->is_published)->toBeTrue();
});

it('cannot put an unpublished page on the storefront by editing it', function () {
    $page = StaticPage::factory()->unpublished()->create(['slug' => 'privacy']);

    staticPageToolResult(app(EditStaticPage::class), [
        'slug' => 'privacy',
        'title' => 'Política de Privacidad',
        'is_published' => true,
    ]);

    expect($page->refresh()->is_published)->toBeFalse();
});

/**
 * An edit replaces the whole body, so an empty string is not a clear, it is an erasure of a page a
 * customer can load. Validation rejects it rather than the normalizer silently dropping it.
 */
it('refuses to empty a page', function () {
    $page = StaticPage::factory()->create(['slug' => 'terms', 'content' => 'Términos vigentes.']);

    $payload = staticPageToolResult(app(EditStaticPage::class), [
        'slug' => 'terms',
        'content' => '   ',
    ]);

    expect($payload['error'])->toContain('non-empty markdown content')
        ->and($page->refresh()->content)->toBe('Términos vigentes.');
});

it('asks for a field when the edit carries none', function () {
    StaticPage::factory()->create(['slug' => 'faq']);

    $payload = staticPageToolResult(app(EditStaticPage::class), ['slug' => 'faq']);

    expect($payload['error'])->toContain('Provide a title or content');
});

it('asks which page to edit when given neither id nor slug', function () {
    StaticPage::factory()->create(['slug' => 'faq']);

    $payload = staticPageToolResult(app(EditStaticPage::class), ['content' => 'Texto.']);

    expect($payload['error'])->toContain('Provide either id or slug');
});

/**
 * The slug is the identity of the page and the storefront route is keyed on it, so an edit chooses a
 * page by slug and never renames one. A model that sends a slug is choosing, not renaming.
 */
it('leaves the slug alone', function () {
    $page = StaticPage::factory()->create(['slug' => 'terms']);

    staticPageToolResult(app(EditStaticPage::class), [
        'id' => $page->id,
        'slug' => 'terms',
        'title' => 'Términos',
    ]);

    expect($page->refresh()->slug)->toBe('terms');
});
