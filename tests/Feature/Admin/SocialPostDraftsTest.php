<?php

use App\Models\SocialPostDraft;
use App\Models\User;
use App\Services\Social\SocialPostAlreadyHandled;
use App\Services\Social\SocialPostPublisher;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    config()->set('services.meta_graph.access_token', 'test-token');
    config()->set('services.meta_graph.page_id', '111');
    config()->set('services.meta_graph.instagram_business_account_id', '222');
});

it('lists drafts for an admin', function () {
    $admin = User::factory()->admin()->create();

    SocialPostDraft::factory()->create(['caption' => 'Aceite de masaje 5 L']);

    $this->actingAs($admin)
        ->get('/admin/social-posts')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('admin/social-posts/Index')
            ->where('drafts.total', 1)
            ->where('drafts.data.0.caption', 'Aceite de masaje 5 L')
            ->where('drafts.data.0.status', 'pending')
            ->where('pendingCount', 1)
        );
});

it('shows a draft with the exact caption a reviewer would approve', function () {
    $admin = User::factory()->admin()->create();

    $draft = SocialPostDraft::factory()->create(['caption' => 'Deslizamiento prolongado, sin residuo graso.']);

    $this->actingAs($admin)
        ->get("/admin/social-posts/{$draft->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('admin/social-posts/Show')
            ->where('draft.caption', 'Deslizamiento prolongado, sin residuo graso.')
            ->where('draft.status', 'pending')
            ->where('draft.is_publishable', true)
        );
});

it('publishes a facebook draft and records what Meta returned', function () {
    $admin = User::factory()->admin()->create();
    $draft = SocialPostDraft::factory()->create();

    Http::fake([
        '*/111/feed' => Http::response(['id' => '111_999']),
        '*/111_999*' => Http::response(['permalink_url' => 'https://facebook.com/111_999']),
    ]);

    $this->actingAs($admin)->post("/admin/social-posts/{$draft->id}/publish")->assertSuccessful();

    $draft->refresh();

    expect($draft->status)->toBe(SocialPostDraft::STATUS_PUBLISHED)
        ->and($draft->remote_post_id)->toBe('111_999')
        ->and($draft->remote_permalink)->toBe('https://facebook.com/111_999')
        ->and($draft->published_at)->not->toBeNull()
        ->and($draft->reviewed_by_user_id)->toBe($admin->id)
        ->and($draft->publish_error)->toBeNull();
});

it('publishes an instagram draft by staging a container and then publishing it', function () {
    Storage::fake('public');
    Storage::disk('public')->put('social/posts/aceite-5l.webp', 'bytes');

    $admin = User::factory()->admin()->create();
    $draft = SocialPostDraft::factory()->instagram()->create();

    Http::fake([
        '*/222/media' => Http::response(['id' => 'container-1']),
        '*/222/media_publish' => Http::response(['id' => 'ig-media-1']),
        '*/ig-media-1*' => Http::response(['permalink' => 'https://instagram.com/p/abc']),
    ]);

    $this->actingAs($admin)->post("/admin/social-posts/{$draft->id}/publish")->assertSuccessful();

    $draft->refresh();

    expect($draft->status)->toBe(SocialPostDraft::STATUS_PUBLISHED)
        ->and($draft->remote_post_id)->toBe('ig-media-1')
        ->and($draft->remote_permalink)->toBe('https://instagram.com/p/abc');

    Http::assertSent(fn ($request) => str_contains($request->url(), '/222/media_publish')
        && $request['creation_id'] === 'container-1');
});

/**
 * The reason the whole queue exists. A post that Meta refused left nothing public, and the row has to
 * say so: no published_at, no post ID, and an error a human can act on. A row that recorded a
 * timestamp here would be claiming a post exists that nobody can open.
 */
it('records a rejected publish as failed, with nothing published', function () {
    $admin = User::factory()->admin()->create();
    $draft = SocialPostDraft::factory()->create();

    Http::fake([
        '*/111/feed' => Http::response(['error' => ['message' => 'Invalid OAuth access token.']], 400),
    ]);

    $this->actingAs($admin)->post("/admin/social-posts/{$draft->id}/publish")->assertSuccessful();

    $draft->refresh();

    expect($draft->status)->toBe(SocialPostDraft::STATUS_FAILED)
        ->and($draft->published_at)->toBeNull()
        ->and($draft->remote_post_id)->toBeNull()
        ->and($draft->publish_error)->toContain('Invalid OAuth access token.');
});

/**
 * Meta answered 200 but named no post. We cannot produce an ID we were not given, and inventing one
 * would put a link in the admin that opens nothing.
 */
it('treats a success with no post ID as a failure rather than inventing one', function () {
    $admin = User::factory()->admin()->create();
    $draft = SocialPostDraft::factory()->create();

    Http::fake(['*/111/feed' => Http::response(['ok' => true])]);

    $this->actingAs($admin)->post("/admin/social-posts/{$draft->id}/publish")->assertSuccessful();

    $draft->refresh();

    expect($draft->status)->toBe(SocialPostDraft::STATUS_FAILED)
        ->and($draft->remote_post_id)->toBeNull()
        ->and($draft->published_at)->toBeNull()
        ->and($draft->publish_error)->toContain('returned no post ID');
});

/**
 * The permalink is read after the post is already public. If that read fails, the post is still live,
 * and calling it failed would be the worst possible lie: it invites a retry, and the retry posts twice.
 */
it('stays published when the permalink lookup fails', function () {
    $admin = User::factory()->admin()->create();
    $draft = SocialPostDraft::factory()->create();

    Http::fake([
        '*/111/feed' => Http::response(['id' => '111_999']),
        '*/111_999*' => Http::response(['error' => ['message' => 'nope']], 400),
    ]);

    $this->actingAs($admin)->post("/admin/social-posts/{$draft->id}/publish")->assertSuccessful();

    $draft->refresh();

    expect($draft->status)->toBe(SocialPostDraft::STATUS_PUBLISHED)
        ->and($draft->remote_post_id)->toBe('111_999')
        ->and($draft->remote_permalink)->toBeNull();
});

/**
 * Publishing twice is the one mistake with no remedy: Meta has no undo, so a second POST is a second
 * post on the brand's page. The draft is claimed out of pending before the network call, so the
 * second request finds nothing to send.
 */
it('refuses to publish the same draft twice', function () {
    $admin = User::factory()->admin()->create();
    $draft = SocialPostDraft::factory()->create();

    Http::fake([
        '*/111/feed' => Http::response(['id' => '111_999']),
        '*/111_999*' => Http::response(['permalink_url' => 'https://facebook.com/111_999']),
    ]);

    $this->actingAs($admin)->post("/admin/social-posts/{$draft->id}/publish")->assertSuccessful();
    $this->actingAs($admin)->post("/admin/social-posts/{$draft->id}/publish")->assertSuccessful();

    Http::assertSentCount(2);

    expect($draft->refresh()->status)->toBe(SocialPostDraft::STATUS_PUBLISHED);
});

it('stops rather than resending a draft another request is already sending', function () {
    $admin = User::factory()->admin()->create();
    $draft = SocialPostDraft::factory()->create(['status' => SocialPostDraft::STATUS_PUBLISHING]);

    Http::preventStrayRequests();
    Http::fake();

    app(SocialPostPublisher::class)->publish($draft, $admin->id);
})->throws(SocialPostAlreadyHandled::class);

it('will not publish a rejected draft', function () {
    $admin = User::factory()->admin()->create();
    $draft = SocialPostDraft::factory()->rejected()->create();

    Http::preventStrayRequests();
    Http::fake();

    $this->actingAs($admin)->post("/admin/social-posts/{$draft->id}/publish")->assertSuccessful();

    Http::assertNothingSent();

    expect($draft->refresh()->status)->toBe(SocialPostDraft::STATUS_REJECTED);
});

it('rejects a draft with a reason, and sends nothing to Meta', function () {
    $admin = User::factory()->admin()->create();
    $draft = SocialPostDraft::factory()->create();

    Http::preventStrayRequests();
    Http::fake();

    $this->actingAs($admin)
        ->post("/admin/social-posts/{$draft->id}/reject", ['rejection_reason' => 'Menciona un precio.'])
        ->assertSuccessful();

    Http::assertNothingSent();

    $draft->refresh();

    expect($draft->status)->toBe(SocialPostDraft::STATUS_REJECTED)
        ->and($draft->rejection_reason)->toBe('Menciona un precio.')
        ->and($draft->reviewed_by_user_id)->toBe($admin->id)
        ->and($draft->published_at)->toBeNull();
});

it('requires a reason to reject', function () {
    $admin = User::factory()->admin()->create();
    $draft = SocialPostDraft::factory()->create();

    $this->actingAs($admin)
        ->post("/admin/social-posts/{$draft->id}/reject", ['rejection_reason' => ''])
        ->assertSessionHasErrors('rejection_reason');

    expect($draft->refresh()->status)->toBe(SocialPostDraft::STATUS_PENDING);
});

it('will not send an instagram draft that has no image', function () {
    $admin = User::factory()->admin()->create();
    $draft = SocialPostDraft::factory()->create([
        'platform' => SocialPostDraft::PLATFORM_INSTAGRAM,
        'image_path' => null,
    ]);

    Http::preventStrayRequests();
    Http::fake();

    $this->actingAs($admin)->post("/admin/social-posts/{$draft->id}/publish")->assertSuccessful();

    Http::assertNothingSent();

    expect($draft->refresh()->status)->toBe(SocialPostDraft::STATUS_PENDING);
});

it('denies a non-admin', function () {
    $user = User::factory()->create();
    $draft = SocialPostDraft::factory()->create();

    $this->actingAs($user)->get('/admin/social-posts')->assertForbidden();
    $this->actingAs($user)->get("/admin/social-posts/{$draft->id}")->assertForbidden();
    $this->actingAs($user)->post("/admin/social-posts/{$draft->id}/publish")->assertForbidden();

    expect($draft->refresh()->status)->toBe(SocialPostDraft::STATUS_PENDING);
});
