<?php

namespace App\Services\Ads;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

class MetaGraphService
{
    public function __construct(
        private ?string $accessToken = null,
        private ?string $apiVersion = null,
        private ?string $baseUrl = null,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function pageInfo(?string $pageId = null): array
    {
        return $this->get($this->pageId($pageId), [
            'fields' => 'id,name,username,link,fan_count,followers_count,about,category,website,instagram_business_account',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function pagePosts(?string $pageId = null, int $limit = 25): array
    {
        return $this->get($this->pageId($pageId).'/posts', [
            'limit' => $limit,
            'fields' => 'id,message,created_time,permalink_url,shares,comments.summary(true),reactions.summary(true)',
        ]);
    }

    /**
     * @param  array<int, string>  $metrics
     * @return array<string, mixed>
     */
    public function postInsights(string $postId, array $metrics, ?string $period = null): array
    {
        return $this->get($postId.'/insights', array_filter([
            'metric' => implode(',', $metrics),
            'period' => $period,
        ]));
    }

    /**
     * @return array<string, mixed>
     */
    public function postComments(string $postId, int $limit = 25): array
    {
        return $this->get($postId.'/comments', [
            'limit' => $limit,
            'fields' => 'id,from,message,created_time,like_count,comment_count,permalink_url',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function instagramAccountInfo(?string $instagramAccountId = null): array
    {
        return $this->get($this->instagramAccountId($instagramAccountId), [
            'fields' => 'id,username,name,biography,website,followers_count,follows_count,media_count,profile_picture_url',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function instagramPosts(?string $instagramAccountId = null, int $limit = 25): array
    {
        return $this->get($this->instagramAccountId($instagramAccountId).'/media', [
            'limit' => $limit,
            'fields' => 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
        ]);
    }

    /**
     * @param  array<int, string>  $metrics
     * @return array<string, mixed>
     */
    public function instagramPostInsights(string $mediaId, array $metrics): array
    {
        return $this->get($mediaId.'/insights', [
            'metric' => implode(',', $metrics),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function instagramPostComments(string $mediaId, int $limit = 25): array
    {
        return $this->get($mediaId.'/comments', [
            'limit' => $limit,
            'fields' => 'id,text,timestamp,username,like_count,replies{id,text,timestamp,username}',
        ]);
    }

    /**
     * Publish a text post, optionally with a link, to the Page feed.
     *
     * Everything below this line is irreversible. Meta has no draft state and no unpublish, so these
     * are called from exactly one place: an admin controller acting on a human's click. No AI tool
     * wraps them.
     *
     * @return array<string, mixed>
     */
    public function publishPagePost(string $message, ?string $link = null, ?string $pageId = null): array
    {
        return $this->post($this->pageId($pageId).'/feed', array_filter([
            'message' => $message,
            'link' => $link,
        ]));
    }

    /**
     * Publish a photo post to the Page feed. Meta fetches the image itself, so the URL has to be
     * reachable from the public internet: a localhost URL fails here, and it fails at Meta.
     *
     * @return array<string, mixed>
     */
    public function publishPagePhoto(string $message, string $imageUrl, ?string $pageId = null): array
    {
        return $this->post($this->pageId($pageId).'/photos', [
            'caption' => $message,
            'url' => $imageUrl,
            'published' => 'true',
        ]);
    }

    /**
     * Stage an Instagram post. This creates a container and publishes nothing on its own.
     *
     * @return array<string, mixed>
     */
    public function createInstagramMediaContainer(string $imageUrl, string $caption, ?string $instagramAccountId = null): array
    {
        return $this->post($this->instagramAccountId($instagramAccountId).'/media', [
            'image_url' => $imageUrl,
            'caption' => $caption,
        ]);
    }

    /**
     * Publish a staged container. This is the call that makes the post public.
     *
     * @return array<string, mixed>
     */
    public function publishInstagramMediaContainer(string $containerId, ?string $instagramAccountId = null): array
    {
        return $this->post($this->instagramAccountId($instagramAccountId).'/media_publish', [
            'creation_id' => $containerId,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function permalink(string $postId, string $field): array
    {
        return $this->get($postId, ['fields' => $field]);
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function post(string $path, array $payload): array
    {
        try {
            $response = $this->request()->asForm()->post(ltrim($path, '/'), [
                ...$payload,
                'access_token' => $this->token(),
            ]);
        } catch (Throwable $exception) {
            return [
                'error' => true,
                'message' => $exception->getMessage(),
            ];
        }

        $body = $response->json();

        if (! is_array($body)) {
            return [
                'error' => true,
                'status' => $response->status(),
                'message' => 'Meta Graph returned a non-JSON response.',
            ];
        }

        if ($response->failed()) {
            return [
                'error' => true,
                'status' => $response->status(),
                'response' => $body,
            ];
        }

        return $body;
    }

    /**
     * @param  array<string, mixed>  $query
     * @return array<string, mixed>
     */
    private function get(string $path, array $query = []): array
    {
        try {
            $response = $this->request()->get(ltrim($path, '/'), [
                ...$query,
                'access_token' => $this->token(),
            ]);
        } catch (Throwable $exception) {
            return [
                'error' => true,
                'message' => $exception->getMessage(),
            ];
        }

        $payload = $response->json();

        if (! is_array($payload)) {
            return [
                'error' => true,
                'status' => $response->status(),
                'message' => 'Meta Graph returned a non-JSON response.',
            ];
        }

        if ($response->failed()) {
            return [
                'error' => true,
                'status' => $response->status(),
                'response' => $payload,
            ];
        }

        return $payload;
    }

    private function request(): PendingRequest
    {
        return Http::baseUrl(sprintf('%s/%s', rtrim($this->baseUrl ?? config('services.meta_graph.base_url'), '/'), $this->apiVersion ?? config('services.meta_graph.api_version')))
            ->acceptJson()
            ->timeout(15);
    }

    private function pageId(?string $pageId): string
    {
        return $pageId ?: config('services.meta_graph.page_id') ?: throw new RuntimeException('Meta page id is not configured.');
    }

    private function instagramAccountId(?string $instagramAccountId): string
    {
        return $instagramAccountId ?: config('services.meta_graph.instagram_business_account_id') ?: throw new RuntimeException('Instagram business account id is not configured.');
    }

    private function token(): string
    {
        return $this->accessToken ?: config('services.meta_graph.access_token') ?: throw new RuntimeException('Meta Graph access token is not configured.');
    }
}
