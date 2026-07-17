<?php

use App\Ai\Agents\BrandAgent;
use App\Ai\Agents\MetaAgent;
use App\Ai\Agents\SocialMediaAgent;
use App\Ai\Tools\Images\GenerateImage;
use App\Ai\Tools\Marketing\MarketingProductCatalog;
use App\Ai\Tools\Social\CreateSocialPostDraft;
use App\Models\SocialPostDraft;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Laravel\Ai\Tools\Request;

it('carries the pre-launch social rules and the no-publish contract', function () {
    $instructions = (string) (new SocialMediaAgent)->instructions();

    expect($instructions)
        ->toContain('You propose posts. You cannot publish them, and nothing you do reaches Meta.')
        ->toContain('Never describe a draft as published, posted, scheduled, or live')
        ->toContain('Never invent a post ID, a permalink, or a reach number')
        ->toContain('a good post and a bad post have identical reach')
        ->toContain('Never state a price');
});

/**
 * The single most important assertion in this file. Claude Code's social agent can publish because
 * the harness stops and asks a human first. The admin chat has no such step, so the agent must not
 * hold a tool that reaches Meta at all: it proposes, and a person publishes.
 */
it('holds no tool that can reach Meta', function () {
    $tools = collect((new SocialMediaAgent)->tools())->map(fn (object $tool): string => $tool::class);

    expect($tools->all())
        ->toContain(CreateSocialPostDraft::class)
        ->toContain(GenerateImage::class)
        ->toContain(MarketingProductCatalog::class)
        ->toContain(MetaAgent::class)
        ->toContain(BrandAgent::class);

    $toolNames = collect((new SocialMediaAgent)->tools())
        ->map(fn (object $tool): string => method_exists($tool, 'name') ? $tool->name() : '')
        ->all();

    foreach (['post_to_facebook', 'post_image_to_instagram', 'schedule_post', 'reply_to_comment', 'delete_post'] as $forbidden) {
        expect($toolNames)->not->toContain($forbidden);
    }
});

it('creates a draft that is pending, and says nothing was posted', function () {
    $response = app(CreateSocialPostDraft::class)->handle(new Request([
        'platform' => 'facebook',
        'caption' => 'Aceite de masaje profesional en 5 L.',
        'rationale' => 'ESTIMATED: el formato 5 L es el diferenciador para compradores profesionales.',
    ]));

    $payload = json_decode((string) $response, true);
    $draft = SocialPostDraft::query()->firstOrFail();

    expect($draft->status)->toBe(SocialPostDraft::STATUS_PENDING)
        ->and($draft->published_at)->toBeNull()
        ->and($draft->remote_post_id)->toBeNull()
        ->and($payload['published'])->toBeFalse()
        ->and($payload['status'])->toBe('pending')
        ->and($payload)->not->toHaveKey('remote_post_id')
        ->and($payload)->not->toHaveKey('remote_permalink');
});

/**
 * Nothing the tool does may cause an outbound call. If a draft could touch Meta, the whole gate is
 * decoration.
 */
it('makes no HTTP call when the agent creates a draft', function () {
    Http::preventStrayRequests();
    Http::fake();

    app(CreateSocialPostDraft::class)->handle(new Request([
        'platform' => 'facebook',
        'caption' => 'Sin llamadas salientes.',
    ]));

    Http::assertNothingSent();
});

it('refuses an Instagram draft without an image, because Instagram would', function () {
    $response = app(CreateSocialPostDraft::class)->handle(new Request([
        'platform' => 'instagram',
        'caption' => 'Una foto que no existe.',
    ]));

    $payload = json_decode((string) $response, true);

    expect($payload['error'])->toContain('Instagram will not accept a post without an image')
        ->and(SocialPostDraft::query()->count())->toBe(0);
});

it('refuses an image path that resolves to nothing', function () {
    Storage::fake('public');

    $response = app(CreateSocialPostDraft::class)->handle(new Request([
        'platform' => 'instagram',
        'caption' => 'Imagen fantasma.',
        'image_path' => 'social/posts/no-existe.webp',
    ]));

    $payload = json_decode((string) $response, true);

    expect($payload['error'])->toContain('must reference an existing PNG, JPG, JPEG, or WebP image')
        ->and(SocialPostDraft::query()->count())->toBe(0);
});

it('accepts an image the generator actually wrote, in any of the shapes a model may send it', function () {
    Storage::fake('public');
    Storage::disk('public')->put('social/posts/aceite.webp', 'fake-bytes');

    $response = app(CreateSocialPostDraft::class)->handle(new Request([
        'platform' => 'instagram',
        'caption' => 'Aceite 5 L.',
        'image_path' => '/storage/social/posts/aceite.webp',
    ]));

    json_decode((string) $response, true);

    expect(SocialPostDraft::query()->firstOrFail()->image_path)->toBe('social/posts/aceite.webp');
});
