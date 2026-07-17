<?php

namespace App\Services\Blog;

use App\Models\BlogPost;
use App\Services\PublicImagePath;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BlogPostService
{
    public function __construct(private PublicImagePath $images) {}

    /**
     * Fields an edit may set. Ordered as they appear on the model.
     *
     * @var list<string>
     */
    public const EDITABLE = ['title', 'slug', 'excerpt', 'content', 'cover_image_path', 'is_published', 'published_at'];

    /**
     * Fields an empty string clears rather than leaves untouched.
     *
     * @var list<string>
     */
    public const CLEARABLE = ['excerpt', 'cover_image_path', 'published_at'];

    /**
     * @return array<string, list<mixed>>
     */
    public function createRules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', Rule::unique('blog_posts', 'slug')],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'cover_image_path' => ['nullable', 'string', 'max:255'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function createMessages(): array
    {
        return [
            'title.required' => 'Provide a title for the blog post.',
            'content.required' => 'Provide markdown content for the blog post.',
            'slug.unique' => 'A blog post with this slug already exists.',
        ];
    }

    /**
     * @return array<string, list<mixed>>
     */
    public function editRules(): array
    {
        return [
            'id' => ['nullable', 'integer', 'exists:blog_posts,id'],
            'current_slug' => ['nullable', 'string', 'exists:blog_posts,slug'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', 'alpha_dash'],
            'excerpt' => ['sometimes', 'nullable', 'string', 'max:500'],
            'content' => ['sometimes', 'required', 'string'],
            'cover_image_path' => ['sometimes', 'nullable', 'string', 'max:255'],
            'is_published' => ['sometimes', 'boolean'],
            'published_at' => ['sometimes', 'nullable', 'date'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function editMessages(): array
    {
        return [
            'id.exists' => 'No blog post exists for the provided id.',
            'current_slug.exists' => 'No blog post exists for the provided current_slug.',
            'title.required' => 'Provide a non-empty title when updating the title.',
            'content.required' => 'Provide non-empty markdown content when updating the content.',
        ];
    }

    /**
     * The slug uniqueness rule can only be built once the post being edited is known.
     *
     * @return array<string, list<mixed>>
     */
    public function slugRules(BlogPost $blogPost): array
    {
        return [
            'slug' => ['sometimes', 'required', 'string', 'max:255', 'alpha_dash', Rule::unique('blog_posts', 'slug')->ignore($blogPost)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function slugMessages(): array
    {
        return ['slug.unique' => 'A blog post with this slug already exists.'];
    }

    /**
     * The states a post can actually be in. `is_published` alone does not put a post on the
     * storefront and neither does `published_at`: a post is live only when both agree, so a listing
     * that only reported the flag would call a scheduled post published and a post with no date live.
     *
     * @var list<string>
     */
    public const STATUSES = ['all', 'live', 'scheduled', 'draft'];

    /**
     * @return array<string, list<mixed>>
     */
    public function listRules(): array
    {
        return [
            'status' => ['nullable', 'string', Rule::in(self::STATUSES)],
            'search' => ['nullable', 'string', 'max:255'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function listMessages(): array
    {
        return [
            'status.in' => 'status must be one of: '.implode(', ', self::STATUSES).'.',
            'limit.max' => 'limit must be 100 or fewer. Narrow the list with status or search instead.',
        ];
    }

    /**
     * @return array<string, list<mixed>>
     */
    public function lookupRules(): array
    {
        return [
            'id' => ['nullable', 'integer', 'exists:blog_posts,id'],
            'slug' => ['nullable', 'string', 'exists:blog_posts,slug'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function lookupMessages(): array
    {
        return [
            'id.exists' => 'No blog post exists for the provided id.',
            'slug.exists' => 'No blog post exists for the provided slug.',
        ];
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function normalizeForCreate(array $arguments): array
    {
        foreach (['title', 'slug', 'excerpt', 'content', 'cover_image_path', 'published_at'] as $key) {
            if (array_key_exists($key, $arguments) && is_string($arguments[$key])) {
                $arguments[$key] = trim($arguments[$key]) === '' ? null : trim($arguments[$key]);
            }
        }

        if (($arguments['slug'] ?? null) === null && is_string($arguments['title'] ?? null)) {
            $arguments['slug'] = Str::slug($arguments['title']);
        }

        if (is_string($arguments['cover_image_path'] ?? null)) {
            $arguments['cover_image_path'] = $this->normalizeCoverImagePath($arguments['cover_image_path']);
        }

        return $arguments;
    }

    /**
     * An edit is a partial update, so an omitted field and a cleared field must stay distinguishable.
     * An empty string on a clearable field means "remove this value"; on anything else it means the
     * caller had nothing to say, and the key is dropped so the stored value survives.
     *
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function normalizeForEdit(array $arguments): array
    {
        $fieldsToClear = [];

        foreach (['current_slug', 'title', 'slug', 'excerpt', 'content', 'cover_image_path', 'published_at'] as $key) {
            if (array_key_exists($key, $arguments) && is_string($arguments[$key])) {
                $arguments[$key] = trim($arguments[$key]);

                if ($arguments[$key] === '' && in_array($key, self::CLEARABLE, true)) {
                    $arguments[$key] = null;
                    $fieldsToClear[$key] = true;
                }

                if ($arguments[$key] === '' && $key === 'current_slug') {
                    $arguments[$key] = null;
                }
            }
        }

        if (is_string($arguments['cover_image_path'] ?? null)) {
            $arguments['cover_image_path'] = $this->normalizeCoverImagePath($arguments['cover_image_path']);
        }

        foreach (['id', 'current_slug', ...self::EDITABLE] as $key) {
            if (($arguments[$key] ?? null) === null && ! isset($fieldsToClear[$key])) {
                unset($arguments[$key]);
            }
        }

        return $arguments;
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function normalizeForList(array $arguments): array
    {
        foreach (['status', 'search'] as $key) {
            if (array_key_exists($key, $arguments) && is_string($arguments[$key])) {
                $arguments[$key] = trim($arguments[$key]) === '' ? null : trim($arguments[$key]);
            }
        }

        if (is_string($arguments['status'] ?? null)) {
            $arguments['status'] = strtolower($arguments['status']);
        }

        return $arguments;
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function normalizeForLookup(array $arguments): array
    {
        if (array_key_exists('slug', $arguments) && is_string($arguments['slug'])) {
            $arguments['slug'] = trim($arguments['slug']) === '' ? null : trim($arguments['slug']);
        }

        return $arguments;
    }

    /**
     * Find the post an id-or-slug pair refers to.
     *
     * @param  array<string, mixed>  $validated
     */
    public function resolve(array $validated, string $slugKey = 'slug'): ?BlogPost
    {
        $id = $validated['id'] ?? null;
        $slug = $validated[$slugKey] ?? null;

        if ($id === null && $slug === null) {
            return null;
        }

        return BlogPost::query()
            ->when($id !== null, fn ($query) => $query->whereKey($id))
            ->when($id === null, fn ($query) => $query->where('slug', $slug))
            ->firstOrFail();
    }

    /**
     * The posts matching a filter, newest first, without their bodies.
     *
     * `total_matching` is counted before the limit is applied, so a caller can tell an empty blog from
     * a truncated page and never reports "we have 25 posts" because 25 is all it asked for.
     *
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public function list(array $validated): array
    {
        $status = $validated['status'] ?? 'all';
        $search = $validated['search'] ?? null;
        $limit = $validated['limit'] ?? 25;

        $query = BlogPost::query()
            ->when($status === 'live', fn (Builder $query) => $query->published())
            ->when($status === 'scheduled', fn (Builder $query) => $query
                ->where('is_published', true)
                ->whereNotNull('published_at')
                ->where('published_at', '>', now()))
            ->when($status === 'draft', fn (Builder $query) => $query
                ->where(fn (Builder $draft) => $draft
                    ->where('is_published', false)
                    ->orWhereNull('published_at')))
            ->when($search !== null, function (Builder $query) use ($search) {
                $term = '%'.addcslashes($search, '%_\\').'%';

                $query->where(fn (Builder $match) => $match
                    ->where('title', 'like', $term)
                    ->orWhere('slug', 'like', $term)
                    ->orWhere('excerpt', 'like', $term));
            });

        $totalMatching = (clone $query)->count();

        $posts = $query
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit($limit)
            ->get()
            ->map(fn (BlogPost $blogPost): array => $this->payload($blogPost, withVisibility: true))
            ->all();

        return [
            'filters' => [
                'status' => $status,
                'search' => $search,
                'limit' => $limit,
            ],
            'total_matching' => $totalMatching,
            'posts' => $posts,
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    public function create(array $validated): BlogPost
    {
        return BlogPost::create([
            'title' => $validated['title'],
            'slug' => $validated['slug'],
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'],
            'cover_image_path' => $validated['cover_image_path'] ?? null,
            'is_published' => $validated['is_published'] ?? false,
            'published_at' => $validated['published_at'] ?? null,
        ]);
    }

    /**
     * Reduce a validated edit payload to the fields it actually carries.
     *
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    public function updates(array $validated): array
    {
        $updates = [];

        foreach (self::EDITABLE as $field) {
            if (array_key_exists($field, $validated)) {
                $updates[$field] = $validated[$field];
            }
        }

        return $updates;
    }

    /**
     * @param  array<string, mixed>  $updates
     */
    public function update(BlogPost $blogPost, array $updates): BlogPost
    {
        $blogPost->update($updates);

        return $blogPost;
    }

    /**
     * @return array<string, mixed>
     */
    public function payload(BlogPost $blogPost, bool $withContent = false, bool $withVisibility = false): array
    {
        $payload = [
            'id' => $blogPost->id,
            'title' => $blogPost->title,
            'slug' => $blogPost->slug,
            'excerpt' => $blogPost->excerpt,
        ];

        if ($withContent) {
            $payload['content'] = $blogPost->content;
        }

        $payload['is_published'] = $blogPost->is_published;
        $payload['published_at'] = $blogPost->published_at?->toISOString();

        if ($withVisibility) {
            $payload['is_publicly_visible'] = $blogPost->isPubliclyVisible();
        }

        $payload['url'] = route('blog.show', ['blogPost' => $blogPost->slug]);
        $payload['cover_image_path'] = $blogPost->cover_image_path;
        $payload['cover_image_url'] = $blogPost->cover_image_url;

        return $payload;
    }

    public function coverImagePathIsValid(string $path): bool
    {
        return $this->images->isValid($path);
    }

    public function coverImageError(): string
    {
        return $this->images->error('cover_image_path');
    }

    public function normalizeCoverImagePath(string $path): string
    {
        return $this->images->normalize($path);
    }
}
