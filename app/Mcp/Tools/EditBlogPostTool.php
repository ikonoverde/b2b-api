<?php

namespace App\Mcp\Tools;

use App\Models\BlogPost;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Title;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

#[Name('edit-blog-post')]
#[Title('Edit Blog Post')]
#[Description('Edit an existing blog post using partial updates. Cover images must be existing paths on the public storage disk, such as blog/covers/example.webp or /storage/blog/covers/example.webp.')]
#[IsDestructive]
class EditBlogPostTool extends Tool
{
    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response|ResponseFactory
    {
        $user = $request->user();

        if ($user === null || ! in_array($user->role, ['admin', 'super_admin'], true)) {
            return Response::error('Permission denied.');
        }

        $request->setArguments($this->normalizeArguments($request->all()));

        $validated = $request->validate([
            'id' => ['nullable', 'integer', 'exists:blog_posts,id'],
            'current_slug' => ['nullable', 'string', 'exists:blog_posts,slug'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', 'alpha_dash'],
            'excerpt' => ['sometimes', 'nullable', 'string', 'max:500'],
            'content' => ['sometimes', 'required', 'string'],
            'cover_image_path' => ['sometimes', 'nullable', 'string', 'max:255'],
            'is_published' => ['sometimes', 'boolean'],
            'published_at' => ['sometimes', 'nullable', 'date'],
        ], [
            'id.exists' => 'No blog post exists for the provided id.',
            'current_slug.exists' => 'No blog post exists for the provided current_slug.',
            'title.required' => 'Provide a non-empty title when updating the title.',
            'content.required' => 'Provide non-empty markdown content when updating the content.',
        ]);

        if (($validated['id'] ?? null) === null && ($validated['current_slug'] ?? null) === null) {
            return Response::error('Provide either id or current_slug to choose the blog post to edit.');
        }

        $blogPost = BlogPost::query()
            ->when($validated['id'] ?? null, fn ($query, $id) => $query->whereKey($id))
            ->when(($validated['id'] ?? null) === null, fn ($query) => $query->where('slug', $validated['current_slug']))
            ->firstOrFail();

        $slugRule = Rule::unique('blog_posts', 'slug')->ignore($blogPost);

        $request->validate([
            'slug' => ['sometimes', 'required', 'string', 'max:255', 'alpha_dash', $slugRule],
        ], [
            'slug.unique' => 'A blog post with this slug already exists.',
        ]);

        if (array_key_exists('cover_image_path', $validated) && $validated['cover_image_path'] !== null && ! $this->isValidCoverImagePath($validated['cover_image_path'])) {
            return Response::error('The cover_image_path must reference an existing PNG, JPG, JPEG, or WebP image on the public storage disk.');
        }

        $updates = [];

        foreach (['title', 'slug', 'excerpt', 'content', 'cover_image_path', 'is_published', 'published_at'] as $field) {
            if (array_key_exists($field, $validated)) {
                $updates[$field] = $validated[$field];
            }
        }

        if ($updates === []) {
            return Response::error('Provide at least one blog post field to update.');
        }

        $blogPost->update($updates);

        return Response::structured([
            'id' => $blogPost->id,
            'title' => $blogPost->title,
            'slug' => $blogPost->slug,
            'excerpt' => $blogPost->excerpt,
            'content' => $blogPost->content,
            'is_published' => $blogPost->is_published,
            'published_at' => $blogPost->published_at?->toISOString(),
            'url' => route('blog.show', ['blogPost' => $blogPost->slug]),
            'cover_image_path' => $blogPost->cover_image_path,
            'cover_image_url' => $blogPost->cover_image_url,
        ]);
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    private function normalizeArguments(array $arguments): array
    {
        $clearableFields = ['excerpt', 'cover_image_path', 'published_at'];
        $fieldsToClear = [];

        foreach (['current_slug', 'title', 'slug', 'excerpt', 'content', 'cover_image_path', 'published_at'] as $key) {
            if (array_key_exists($key, $arguments) && is_string($arguments[$key])) {
                $arguments[$key] = trim($arguments[$key]);

                if ($arguments[$key] === '' && in_array($key, $clearableFields, true)) {
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

        foreach (['id', 'current_slug', 'title', 'slug', 'excerpt', 'content', 'cover_image_path', 'is_published', 'published_at'] as $key) {
            if (($arguments[$key] ?? null) === null && ! isset($fieldsToClear[$key])) {
                unset($arguments[$key]);
            }
        }

        return $arguments;
    }

    private function normalizeCoverImagePath(string $path): string
    {
        $publicRoot = Storage::disk('public')->path('');
        $normalizedPath = str_replace('\\', '/', $path);
        $normalizedPublicRoot = rtrim(str_replace('\\', '/', $publicRoot), '/').'/';

        if (str_starts_with($normalizedPath, $normalizedPublicRoot)) {
            $normalizedPath = substr($normalizedPath, strlen($normalizedPublicRoot));
        }

        return Str::of($normalizedPath)
            ->after(config('app.url').'/storage/')
            ->after('/storage/')
            ->after('storage/')
            ->ltrim('/')
            ->toString();
    }

    private function isValidCoverImagePath(string $path): bool
    {
        if (! Storage::disk('public')->exists($path)) {
            return false;
        }

        return in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), ['png', 'jpg', 'jpeg', 'webp'], true);
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()
                ->nullable()
                ->description('Blog post ID to edit. Provide either id or current_slug.'),
            'current_slug' => $schema->string()
                ->nullable()
                ->description('Current blog post slug to edit. Provide either id or current_slug. Use slug to set a new slug.'),
            'title' => $schema->string()
                ->nullable()
                ->description('New blog post title.'),
            'content' => $schema->string()
                ->nullable()
                ->description('New markdown content for the blog post.'),
            'slug' => $schema->string()
                ->nullable()
                ->description('New URL slug. Must be unique.'),
            'excerpt' => $schema->string()
                ->nullable()
                ->description('New short summary shown on blog listing pages. Maximum 500 characters. Pass an empty string to clear.'),
            'cover_image_path' => $schema->string()
                ->nullable()
                ->description('Existing PNG, JPG, JPEG, or WebP image path on the public storage disk. Accepts blog/covers/image.webp, storage/blog/covers/image.webp, /storage/blog/covers/image.webp, or an absolute path under storage/app/public. Pass an empty string to remove the cover image.'),
            'is_published' => $schema->boolean()
                ->nullable()
                ->description('Whether the blog post is published. Public visibility also requires published_at to be now or in the past.'),
            'published_at' => $schema->string()
                ->nullable()
                ->description('Publication date/time. Use an ISO 8601 string, any Laravel-parseable date, or an empty string to clear.'),
        ];
    }

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()->description('Updated blog post ID.')->required(),
            'title' => $schema->string()->description('Blog post title.')->required(),
            'slug' => $schema->string()->description('Blog post URL slug.')->required(),
            'excerpt' => $schema->string()->nullable()->description('Blog post excerpt.'),
            'content' => $schema->string()->description('Blog post markdown content.')->required(),
            'is_published' => $schema->boolean()->description('Whether the post is marked published.')->required(),
            'published_at' => $schema->string()->nullable()->description('Publication timestamp.'),
            'url' => $schema->string()->description('Public blog post URL.')->required(),
            'cover_image_path' => $schema->string()->nullable()->description('Stored cover image path.'),
            'cover_image_url' => $schema->string()->nullable()->description('Public cover image URL.'),
        ];
    }
}
