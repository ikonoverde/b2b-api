<?php

namespace App\Models;

use Database\Factories\BlogPostFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogPost extends Artifact
{
    /** @use HasFactory<BlogPostFactory> */
    use HasFactory;

    use SoftDeletes;

    protected $fillable = [
        'growth_task_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image_path',
        'is_published',
        'published_at',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::saving(function (self $blogPost): void {
            if (blank($blogPost->slug)) {
                $blogPost->slug = Str::slug($blogPost->title);
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        if (blank($this->cover_image_path)) {
            return null;
        }

        return Storage::url($this->cover_image_path);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function isPubliclyVisible(): bool
    {
        return $this->is_published
            && $this->published_at !== null
            && ! $this->published_at->isFuture();
    }

    public function artifactLabel(): string
    {
        return 'Entrada de blog';
    }

    public function artifactTitle(): string
    {
        return $this->title;
    }

    public function adminUrl(): ?string
    {
        return "/admin/blog-posts/{$this->id}/edit";
    }
}
