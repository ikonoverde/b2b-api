<?php

namespace App\Services\Social;

use App\Models\SocialPostDraft;
use App\Services\Ads\MetaGraphService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

/**
 * Takes a draft a human approved and puts it on Meta.
 *
 * The order of operations is the whole point. The row is claimed in a transaction before the network
 * call, so a double-click, a double-submit, or two admins clicking at once produce one post and one
 * refusal rather than two posts. The claim is what makes the operation safe; the publish is what
 * makes it irreversible.
 */
class SocialPostPublisher
{
    public function __construct(private MetaGraphService $meta) {}

    /**
     * @throws SocialPostAlreadyHandled when another request got to this draft first
     */
    public function publish(SocialPostDraft $draft, int $reviewerId): SocialPostDraft
    {
        $claimed = $this->claim($draft, $reviewerId);

        try {
            $result = $this->send($claimed);
        } catch (Throwable $exception) {
            return $this->recordFailure($claimed, $exception->getMessage());
        }

        if (($result['error'] ?? false) === true) {
            return $this->recordFailure($claimed, $this->errorMessage($result));
        }

        $remoteId = $this->remoteId($result);

        if ($remoteId === null) {
            return $this->recordFailure($claimed, 'Meta accepted the request but returned no post ID: '.$this->encode($result));
        }

        return $this->recordSuccess($claimed, $remoteId);
    }

    /**
     * Move the draft out of pending inside a locked transaction, so it can only ever be sent once.
     *
     * @throws SocialPostAlreadyHandled
     */
    private function claim(SocialPostDraft $draft, int $reviewerId): SocialPostDraft
    {
        return DB::transaction(function () use ($draft, $reviewerId): SocialPostDraft {
            $fresh = SocialPostDraft::query()
                ->whereKey($draft->getKey())
                ->lockForUpdate()
                ->first();

            if ($fresh === null || ! $fresh->isPending()) {
                throw new SocialPostAlreadyHandled(
                    $fresh?->status ?? SocialPostDraft::STATUS_PENDING,
                );
            }

            if (! $fresh->isPublishable()) {
                throw new RuntimeException('Instagram will not accept a post without an image.');
            }

            $fresh->update([
                'status' => SocialPostDraft::STATUS_PUBLISHING,
                'reviewed_by_user_id' => $reviewerId,
                'reviewed_at' => now(),
                'publish_error' => null,
            ]);

            return $fresh;
        });
    }

    /**
     * @return array<string, mixed>
     */
    private function send(SocialPostDraft $draft): array
    {
        if ($draft->platform === SocialPostDraft::PLATFORM_INSTAGRAM) {
            return $this->sendToInstagram($draft);
        }

        if ($draft->image_path !== null) {
            return $this->meta->publishPagePhoto($draft->caption, $this->publicImageUrl($draft));
        }

        return $this->meta->publishPagePost($draft->caption, $draft->link);
    }

    /**
     * Instagram is two calls: stage a container, then publish it. Only the second one is public, so a
     * container that never gets published leaves nothing behind.
     *
     * @return array<string, mixed>
     */
    private function sendToInstagram(SocialPostDraft $draft): array
    {
        $container = $this->meta->createInstagramMediaContainer(
            $this->publicImageUrl($draft),
            $draft->caption,
        );

        if (($container['error'] ?? false) === true) {
            return $container;
        }

        $containerId = $container['id'] ?? null;

        if (! is_string($containerId) || $containerId === '') {
            return ['error' => true, 'message' => 'Instagram returned no container ID: '.$this->encode($container)];
        }

        return $this->meta->publishInstagramMediaContainer($containerId);
    }

    /**
     * Meta fetches the image over the public internet. If APP_URL is not reachable from outside, this
     * is where publishing fails, and it should: the alternative is a live post with a broken image.
     */
    private function publicImageUrl(SocialPostDraft $draft): string
    {
        if ($draft->image_path === null) {
            throw new RuntimeException('This draft has no image to publish.');
        }

        return Storage::disk('public')->url($draft->image_path);
    }

    /**
     * A Facebook photo post reports the feed story as post_id; the bare id belongs to the photo.
     * Prefer the story, because that is the thing a person can open.
     *
     * @param  array<string, mixed>  $result
     */
    private function remoteId(array $result): ?string
    {
        foreach (['post_id', 'id'] as $key) {
            $value = $result[$key] ?? null;

            if (is_string($value) && $value !== '') {
                return $value;
            }
        }

        return null;
    }

    private function recordSuccess(SocialPostDraft $draft, string $remoteId): SocialPostDraft
    {
        $draft->update([
            'status' => SocialPostDraft::STATUS_PUBLISHED,
            'published_at' => now(),
            'remote_post_id' => $remoteId,
            'remote_permalink' => $this->resolvePermalink($draft, $remoteId),
            'publish_error' => null,
        ]);

        return $draft;
    }

    private function recordFailure(SocialPostDraft $draft, string $error): SocialPostDraft
    {
        $draft->update([
            'status' => SocialPostDraft::STATUS_FAILED,
            'publish_error' => $error,
            'published_at' => null,
            'remote_post_id' => null,
            'remote_permalink' => null,
        ]);

        return $draft;
    }

    /**
     * The permalink is a convenience, and reading it happens after the post is already public. A
     * failure here must never be allowed to mark a published post as failed.
     */
    private function resolvePermalink(SocialPostDraft $draft, string $remoteId): ?string
    {
        $field = $draft->platform === SocialPostDraft::PLATFORM_INSTAGRAM ? 'permalink' : 'permalink_url';

        try {
            $response = $this->meta->permalink($remoteId, $field);
        } catch (Throwable) {
            return null;
        }

        $permalink = $response[$field] ?? null;

        return is_string($permalink) && $permalink !== '' ? $permalink : null;
    }

    /**
     * @param  array<string, mixed>  $result
     */
    private function errorMessage(array $result): string
    {
        $message = $result['response']['error']['message'] ?? $result['message'] ?? null;

        if (is_string($message) && $message !== '') {
            return $message;
        }

        return 'Meta Graph rejected the post: '.$this->encode($result);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function encode(array $payload): string
    {
        return json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?: '{}';
    }
}
