<?php

namespace App\Models;

use Database\Factories\SocialPostDraftFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SocialPostDraft extends Artifact
{
    /** @use HasFactory<SocialPostDraftFactory> */
    use HasFactory;

    public const PLATFORM_FACEBOOK = 'facebook';

    public const PLATFORM_INSTAGRAM = 'instagram';

    /**
     * Nobody has sent this to Meta. The only state from which publishing is allowed.
     */
    public const STATUS_PENDING = 'pending';

    /**
     * We are mid-call to Meta, and the row is claimed so a second click cannot post it again.
     *
     * A draft still sitting here has not failed: it means we sent the request and never recorded an
     * answer, which is exactly the case where nobody can say whether the post is public. Collapsing
     * that into "failed" would invite a retry, and a retry of a request that actually succeeded posts
     * to the brand's page twice. Somebody has to open the page and look.
     */
    public const STATUS_PUBLISHING = 'publishing';

    /**
     * Meta accepted it and returned an ID. Terminal, and irreversible in the world.
     */
    public const STATUS_PUBLISHED = 'published';

    /**
     * A human declined it. Terminal.
     */
    public const STATUS_REJECTED = 'rejected';

    /**
     * We called Meta and Meta refused. Nothing is public. Terminal here too: a retry that reused this
     * row could not tell you afterwards how many times we asked Meta to post it, and the honest way
     * to try again is a new draft.
     */
    public const STATUS_FAILED = 'failed';

    /**
     * @var list<string>
     */
    public const PLATFORMS = [self::PLATFORM_FACEBOOK, self::PLATFORM_INSTAGRAM];

    /**
     * @var list<string>
     */
    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_PUBLISHING,
        self::STATUS_PUBLISHED,
        self::STATUS_REJECTED,
        self::STATUS_FAILED,
    ];

    protected $fillable = [
        'growth_task_id',
        'platform',
        'status',
        'caption',
        'image_path',
        'link',
        'rationale',
        'brand_review',
        'proposed_for',
        'created_by_agent',
        'reviewed_by_user_id',
        'reviewed_at',
        'rejection_reason',
        'published_at',
        'remote_post_id',
        'remote_permalink',
        'publish_error',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'proposed_for' => 'datetime',
            'reviewed_at' => 'datetime',
            'published_at' => 'datetime',
            'created_by_agent' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by_user_id');
    }

    public function scopePending(Builder $query): void
    {
        $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Whether a human may still act on this draft. Every other status has already had its one chance
     * to reach Meta, and asking twice is how a post gets published twice.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    /**
     * Instagram will not accept a caption without an image, so a draft lacking one cannot be sent.
     * Say this before a human clicks publish rather than after Meta rejects it.
     */
    public function requiresImage(): bool
    {
        return $this->platform === self::PLATFORM_INSTAGRAM;
    }

    public function isPublishable(): bool
    {
        if (! $this->isPending()) {
            return false;
        }

        return ! $this->requiresImage() || $this->image_path !== null;
    }

    public function imageUrl(): ?string
    {
        if ($this->image_path === null) {
            return null;
        }

        return Storage::disk('public')->url($this->image_path);
    }

    public function artifactLabel(): string
    {
        return 'Borrador de redes';
    }

    public function artifactTitle(): string
    {
        return Str::limit((string) $this->caption, 60);
    }

    public function adminUrl(): ?string
    {
        return "/admin/social-posts/{$this->id}";
    }
}
