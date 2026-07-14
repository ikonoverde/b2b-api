<?php

use App\Mcp\Servers\StaticPagesServer;
use App\Mcp\Tools\StaticPages\EditStaticPageTool;
use App\Mcp\Tools\StaticPages\GetStaticPageTool;
use App\Mcp\Tools\StaticPages\ListStaticPagesTool;
use App\Models\StaticPage;
use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Laravel\Passport\Passport;

it('requires authentication for the static pages mcp http server', function () {
    $this->postJson('/mcp/pages', [
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

    $response = $this->postJson('/mcp/pages', [
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
        ->assertJsonPath('result.serverInfo.name', 'Static Pages Server');
});

it('lists the static pages through the mcp tool', function () {
    $admin = User::factory()->admin()->create();
    StaticPage::factory()->create(['slug' => 'terms', 'title' => 'Términos y Condiciones']);

    $response = StaticPagesServer::actingAs($admin)->tool(ListStaticPagesTool::class);

    $response
        ->assertOk()
        ->assertName('list-static-pages')
        ->assertSee(['terms', 'Términos y Condiciones']);
});

it('reads a static page through the mcp tool', function () {
    $admin = User::factory()->admin()->create();
    StaticPage::factory()->create(['slug' => 'faq', 'content' => '## Preguntas frecuentes']);

    $response = StaticPagesServer::actingAs($admin)->tool(GetStaticPageTool::class, ['slug' => 'faq']);

    $response
        ->assertOk()
        ->assertName('get-static-page')
        ->assertSee('## Preguntas frecuentes');
});

it('rewrites a static page through the mcp tool', function () {
    $admin = User::factory()->admin()->create();
    $page = StaticPage::factory()->create(['slug' => 'about', 'content' => 'Texto viejo.']);

    $response = StaticPagesServer::actingAs($admin)->tool(EditStaticPageTool::class, [
        'slug' => 'about',
        'content' => 'Texto nuevo.',
    ]);

    $response->assertOk()->assertName('edit-static-page');

    expect($page->refresh()->content)->toBe('Texto nuevo.');
});

/**
 * Unlike the AI tool of the same purpose, this one may change publication state, because Claude Code
 * asks a human before every call. That is the whole of the difference between them, so it is tested.
 */
it('can take a page off the storefront, because a human approved the call', function () {
    $admin = User::factory()->admin()->create();
    $page = StaticPage::factory()->create(['slug' => 'terms', 'is_published' => true]);

    $response = StaticPagesServer::actingAs($admin)->tool(EditStaticPageTool::class, [
        'slug' => 'terms',
        'is_published' => false,
    ]);

    $response->assertOk();

    expect($page->refresh()->is_published)->toBeFalse();
});

it('rejects an edit that would empty a live page', function () {
    $admin = User::factory()->admin()->create();
    $page = StaticPage::factory()->create(['slug' => 'terms', 'content' => 'Términos vigentes.']);

    $response = StaticPagesServer::actingAs($admin)->tool(EditStaticPageTool::class, [
        'slug' => 'terms',
        'content' => '   ',
    ]);

    $response->assertHasErrors();

    expect($page->refresh()->content)->toBe('Términos vigentes.');
});

it('cannot create a page by editing a slug that does not exist', function () {
    $admin = User::factory()->admin()->create();

    $response = StaticPagesServer::actingAs($admin)->tool(EditStaticPageTool::class, [
        'slug' => 'devoluciones',
        'content' => '## Devoluciones',
    ]);

    $response->assertHasErrors();

    $this->assertDatabaseCount('static_pages', 0);
});

it('denies static page tools to non-admin users', function () {
    $customer = User::factory()->create();
    $page = StaticPage::factory()->create(['slug' => 'terms', 'content' => 'Términos vigentes.']);

    StaticPagesServer::actingAs($customer)
        ->tool(EditStaticPageTool::class, ['slug' => 'terms', 'content' => 'Texto inyectado.'])
        ->assertHasErrors(['Permission denied.']);

    StaticPagesServer::actingAs($customer)
        ->tool(ListStaticPagesTool::class)
        ->assertHasErrors(['Permission denied.']);

    expect($page->refresh()->content)->toBe('Términos vigentes.');
});
