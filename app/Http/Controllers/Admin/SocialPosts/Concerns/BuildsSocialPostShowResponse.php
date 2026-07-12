<?php

namespace App\Http\Controllers\Admin\SocialPosts\Concerns;

use App\Models\SocialPostDraft;
use Inertia\Inertia;
use Inertia\Response;

trait BuildsSocialPostShowResponse
{
    private const SHOW_VIEW = 'admin/social-posts/Show';

    protected function renderSocialPostShow(
        SocialPostDraft $draft,
        ?string $flashType = null,
        ?string $flashMessage = null,
    ): Response {
        $draft->load('reviewer:id,name');

        $data = ['draft' => $this->formatDraft($draft)];

        if ($flashType !== null && $flashMessage !== null) {
            $data['flash'] = [$flashType => $flashMessage];
        }

        return Inertia::render(self::SHOW_VIEW, $data);
    }

    /**
     * @return array<string, mixed>
     */
    private function formatDraft(SocialPostDraft $draft): array
    {
        return [
            'id' => $draft->id,
            'platform' => $draft->platform,
            'status' => $draft->status,
            'caption' => $draft->caption,
            'image_path' => $draft->image_path,
            'image_url' => $draft->imageUrl(),
            'link' => $draft->link,
            'rationale' => $draft->rationale,
            'brand_review' => $draft->brand_review,
            'proposed_for' => $draft->proposed_for?->toISOString(),
            'created_by_agent' => $draft->created_by_agent,
            'reviewer' => $draft->reviewer?->name,
            'reviewed_at' => $draft->reviewed_at?->toISOString(),
            'rejection_reason' => $draft->rejection_reason,
            'published_at' => $draft->published_at?->toISOString(),
            'remote_post_id' => $draft->remote_post_id,
            'remote_permalink' => $draft->remote_permalink,
            'publish_error' => $draft->publish_error,
            'created_at' => $draft->created_at?->toISOString(),
            'requires_image' => $draft->requiresImage(),
            'is_publishable' => $draft->isPublishable(),
        ];
    }
}
