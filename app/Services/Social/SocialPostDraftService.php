<?php

namespace App\Services\Social;

use App\Models\SocialPostDraft;
use App\Services\PublicImagePath;
use Illuminate\Validation\Rule;

class SocialPostDraftService
{
    /**
     * Instagram's caption ceiling. Facebook's is far higher, but a caption written to one limit and
     * posted to the other is a caption that gets truncated somewhere nobody is looking, so hold both
     * to the lower one.
     */
    public const CAPTION_MAX = 2200;

    public function __construct(private PublicImagePath $images) {}

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'platform' => ['required', 'string', Rule::in(SocialPostDraft::PLATFORMS)],
            'caption' => ['required', 'string', 'max:'.self::CAPTION_MAX],
            'image_path' => ['nullable', 'string', 'max:255', 'required_if:platform,'.SocialPostDraft::PLATFORM_INSTAGRAM],
            'link' => ['nullable', 'url', 'max:1000'],
            'rationale' => ['nullable', 'string', 'max:2000'],
            'brand_review' => ['nullable', 'string', 'max:2000'],
            'proposed_for' => ['nullable', 'date'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'platform.required' => 'Choose the platform this post is for: facebook or instagram.',
            'platform.in' => 'The platform must be facebook or instagram.',
            'caption.required' => 'Write the caption exactly as it should appear if a human approves it.',
            'caption.max' => 'The caption is longer than Instagram accepts ('.self::CAPTION_MAX.' characters).',
            'image_path.required_if' => 'Instagram will not accept a post without an image. Generate one first, then pass its path.',
            'link.url' => 'The link must be a full URL.',
        ];
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function normalize(array $arguments): array
    {
        foreach (['platform', 'caption', 'image_path', 'link', 'rationale', 'brand_review', 'proposed_for'] as $key) {
            if (array_key_exists($key, $arguments) && is_string($arguments[$key])) {
                $arguments[$key] = trim($arguments[$key]) === '' ? null : trim($arguments[$key]);
            }
        }

        if (is_string($arguments['platform'] ?? null)) {
            $arguments['platform'] = strtolower($arguments['platform']);
        }

        if (is_string($arguments['image_path'] ?? null)) {
            $arguments['image_path'] = $this->images->normalize($arguments['image_path']);
        }

        return $arguments;
    }

    public function imagePathIsValid(string $path): bool
    {
        return $this->images->isValid($path);
    }

    public function imageError(): string
    {
        return $this->images->error('image_path');
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    public function create(array $validated): SocialPostDraft
    {
        return SocialPostDraft::create([
            'platform' => $validated['platform'],
            'status' => SocialPostDraft::STATUS_PENDING,
            'caption' => $validated['caption'],
            'image_path' => $validated['image_path'] ?? null,
            'link' => $validated['link'] ?? null,
            'rationale' => $validated['rationale'] ?? null,
            'brand_review' => $validated['brand_review'] ?? null,
            'proposed_for' => $validated['proposed_for'] ?? null,
            'created_by_agent' => true,
        ]);
    }

    /**
     * What the tool hands back to the model.
     *
     * It says "pending", it says nothing is public, and it deliberately returns no post ID and no
     * permalink, because there is no post and there is no link. A model that receives a plausible
     * looking identifier will report it as published, and the person reading the chat will believe it.
     *
     * @return array<string, mixed>
     */
    public function payload(SocialPostDraft $draft): array
    {
        return [
            'id' => $draft->id,
            'platform' => $draft->platform,
            'status' => $draft->status,
            'caption' => $draft->caption,
            'image_path' => $draft->image_path,
            'link' => $draft->link,
            'proposed_for' => $draft->proposed_for?->toISOString(),
            'published' => false,
            'review_url' => route('admin.social-posts.show', ['socialPostDraft' => $draft->id]),
            'note' => 'Nothing has been posted. This is a proposal waiting for a human to approve it in the admin. Do not describe it as published, and do not invent a post ID or permalink for it.',
        ];
    }

    public function description(): string
    {
        return 'Propose a Facebook or Instagram post for a human to review. It is saved to an internal queue that Meta never sees; it is not published, not scheduled, and not visible to anyone outside this admin. Publishing is a human decision made in the admin, and you have no tool that can make it. Write the caption exactly as it should appear if approved.';
    }
}
