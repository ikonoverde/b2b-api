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

#[Name('create-blog-post')]
#[Title('Create Blog Post')]
#[Description('Create a blog post using markdown content. Cover images must be existing paths on the public storage disk, such as blog/covers/example.webp or /storage/blog/covers/example.webp.')]
#[IsDestructive(false)]
class CreateBlogPostTool extends Tool
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
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', Rule::unique('blog_posts', 'slug')],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'cover_image_path' => ['nullable', 'string', 'max:255'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ], [
            'title.required' => 'Provide a title for the blog post.',
            'content.required' => 'Provide markdown content for the blog post.',
            'slug.unique' => 'A blog post with this slug already exists.',
        ]);

        if (($validated['cover_image_path'] ?? null) !== null && ! $this->isValidCoverImagePath($validated['cover_image_path'])) {
            return Response::error('The cover_image_path must reference an existing PNG, JPG, JPEG, or WebP image on the public storage disk.');
        }

        $blogPost = BlogPost::create([
            'title' => $validated['title'],
            'slug' => $validated['slug'],
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'],
            'cover_image_path' => $validated['cover_image_path'] ?? null,
            'is_published' => $validated['is_published'] ?? false,
            'published_at' => $validated['published_at'] ?? null,
        ]);

        return Response::structured([
            'id' => $blogPost->id,
            'title' => $blogPost->title,
            'slug' => $blogPost->slug,
            'excerpt' => $blogPost->excerpt,
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
            'title' => $schema->string()
                ->description('Blog post title.')
                ->required(),
            'content' => $schema->string()
                ->description('Markdown content for the blog post.')
                ->required(),
            'slug' => $schema->string()
                ->nullable()
                ->description('URL slug. If omitted, it is generated from the title.'),
            'excerpt' => $schema->string()
                ->nullable()
                ->description('Short summary shown on blog listing pages. Maximum 500 characters.'),
            'cover_image_path' => $schema->string()
                ->nullable()
                ->description('Existing PNG, JPG, JPEG, or WebP image path on the public storage disk. Accepts blog/covers/image.webp, storage/blog/covers/image.webp, /storage/blog/covers/image.webp, or an absolute path under storage/app/public.'),
            'is_published' => $schema->boolean()
                ->description('Whether the blog post is published. Public visibility also requires published_at to be now or in the past.')
                ->default(false),
            'published_at' => $schema->string()
                ->nullable()
                ->description('Publication date/time. Use an ISO 8601 string or any Laravel-parseable date.'),
        ];
    }

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()->description('Created blog post ID.')->required(),
            'title' => $schema->string()->description('Blog post title.')->required(),
            'slug' => $schema->string()->description('Blog post URL slug.')->required(),
            'excerpt' => $schema->string()->nullable()->description('Blog post excerpt.'),
            'is_published' => $schema->boolean()->description('Whether the post is marked published.')->required(),
            'published_at' => $schema->string()->nullable()->description('Publication timestamp.'),
            'url' => $schema->string()->description('Public blog post URL.')->required(),
            'cover_image_path' => $schema->string()->nullable()->description('Stored cover image path.'),
            'cover_image_url' => $schema->string()->nullable()->description('Public cover image URL.'),
        ];
    }
}
