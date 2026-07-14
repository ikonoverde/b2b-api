<?php

use App\Ai\Tools\Blog\ListBlogPosts;
use App\Models\BlogPost;
use Laravel\Ai\Tools\Request;

/**
 * @param  array<string, mixed>  $arguments
 * @return array<string, mixed>
 */
function listBlogPosts(array $arguments = []): array
{
    return json_decode((string) app(ListBlogPosts::class)->handle(new Request($arguments)), true);
}

it('lists posts newest first, without their bodies', function () {
    BlogPost::factory()->create(['title' => 'Primero', 'created_at' => now()->subWeek()]);
    BlogPost::factory()->create(['title' => 'Segundo', 'created_at' => now()]);

    $payload = listBlogPosts();

    expect($payload['total_matching'])->toBe(2)
        ->and($payload['posts'])->toHaveCount(2)
        ->and($payload['posts'][0]['title'])->toBe('Segundo')
        ->and($payload['posts'][0])->not->toHaveKey('content')
        ->and($payload['filters'])->toBe(['status' => 'all', 'search' => null, 'limit' => 25]);
});

it('says plainly that the blog is empty', function () {
    $payload = listBlogPosts();

    expect($payload['total_matching'])->toBe(0)
        ->and($payload['posts'])->toBe([]);
});

/**
 * is_published alone does not put a post on the storefront, and neither does published_at. A listing
 * that reported the flag would call the scheduled post live and the dateless post published, and the
 * model would tell a human their post is up when no reader can open it.
 */
it('separates live posts from scheduled ones and drafts', function () {
    BlogPost::factory()->create(['title' => 'En vivo', 'is_published' => true, 'published_at' => now()->subDay()]);
    BlogPost::factory()->create(['title' => 'Programado', 'is_published' => true, 'published_at' => now()->addWeek()]);
    BlogPost::factory()->create(['title' => 'Sin fecha', 'is_published' => true, 'published_at' => null]);
    BlogPost::factory()->create(['title' => 'Borrador', 'is_published' => false, 'published_at' => null]);

    $live = listBlogPosts(['status' => 'live']);
    $scheduled = listBlogPosts(['status' => 'scheduled']);
    $drafts = listBlogPosts(['status' => 'draft']);

    expect(array_column($live['posts'], 'title'))->toBe(['En vivo'])
        ->and($live['posts'][0]['is_publicly_visible'])->toBeTrue()
        ->and(array_column($scheduled['posts'], 'title'))->toBe(['Programado'])
        ->and($scheduled['posts'][0]['is_publicly_visible'])->toBeFalse()
        ->and(array_column($drafts['posts'], 'title'))->toEqualCanonicalizing(['Sin fecha', 'Borrador'])
        ->and($drafts['total_matching'])->toBe(2);
});

it('searches title, slug, and excerpt', function () {
    BlogPost::factory()->create(['title' => 'Aceites de masaje', 'slug' => 'aceites-de-masaje', 'excerpt' => 'Guía profesional.']);
    BlogPost::factory()->create(['title' => 'Velas de soya', 'slug' => 'velas-de-soya', 'excerpt' => 'Para spas.']);

    expect(listBlogPosts(['search' => 'aceites'])['total_matching'])->toBe(1)
        ->and(listBlogPosts(['search' => 'spas'])['posts'][0]['title'])->toBe('Velas de soya')
        ->and(listBlogPosts(['search' => 'velas-de'])['total_matching'])->toBe(1)
        ->and(listBlogPosts(['search' => 'jabones'])['posts'])->toBe([]);
});

/**
 * The count is taken before the limit, so a truncated page cannot be read as the whole library.
 */
it('reports how many posts exist beyond the limit', function () {
    BlogPost::factory(5)->create();

    $payload = listBlogPosts(['limit' => 2]);

    expect($payload['posts'])->toHaveCount(2)
        ->and($payload['total_matching'])->toBe(5);
});

it('rejects a status it cannot honour rather than silently listing everything', function () {
    BlogPost::factory()->create();

    expect(listBlogPosts(['status' => 'published'])['error'])
        ->toContain('status must be one of: all, live, scheduled, draft.');
});

it('rejects a limit that would dump the whole table', function () {
    expect(listBlogPosts(['limit' => 500])['error'])->toContain('limit must be 100 or fewer');
});

it('leaves deleted posts out of the listing', function () {
    BlogPost::factory()->create(['title' => 'Vigente']);
    BlogPost::factory()->create(['title' => 'Eliminado'])->delete();

    $payload = listBlogPosts();

    expect($payload['total_matching'])->toBe(1)
        ->and($payload['posts'][0]['title'])->toBe('Vigente');
});
