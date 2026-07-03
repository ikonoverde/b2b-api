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
