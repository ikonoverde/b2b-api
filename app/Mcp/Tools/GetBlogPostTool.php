<?php

namespace App\Mcp\Tools;

use App\Models\BlogPost;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Title;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Name('get-blog-post')]
#[Title('Get Blog Post')]
#[Description('Get the details of a blog post by ID or slug, including markdown content and cover image information.')]
#[IsReadOnly]
class GetBlogPostTool extends Tool
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
            'slug' => ['nullable', 'string', 'exists:blog_posts,slug'],
        ], [
            'id.exists' => 'No blog post exists for the provided id.',
            'slug.exists' => 'No blog post exists for the provided slug.',
        ]);

        if (($validated['id'] ?? null) === null && ($validated['slug'] ?? null) === null) {
            return Response::error('Provide either id or slug to choose the blog post to retrieve.');
        }

        $blogPost = BlogPost::query()
            ->when($validated['id'] ?? null, fn ($query, $id) => $query->whereKey($id))
            ->when(($validated['id'] ?? null) === null, fn ($query) => $query->where('slug', $validated['slug']))
            ->firstOrFail();

        return Response::structured([
            'id' => $blogPost->id,
            'title' => $blogPost->title,
            'slug' => $blogPost->slug,
            'excerpt' => $blogPost->excerpt,
            'content' => $blogPost->content,
            'is_published' => $blogPost->is_published,
            'published_at' => $blogPost->published_at?->toISOString(),
            'is_publicly_visible' => $blogPost->isPubliclyVisible(),
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
        if (array_key_exists('slug', $arguments) && is_string($arguments['slug'])) {
            $arguments['slug'] = trim($arguments['slug']) === '' ? null : trim($arguments['slug']);
        }

        return $arguments;
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
                ->description('Blog post ID to retrieve. Provide either id or slug.'),
            'slug' => $schema->string()
                ->nullable()
                ->description('Blog post URL slug to retrieve. Provide either id or slug.'),
        ];
    }

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()->description('Blog post ID.')->required(),
            'title' => $schema->string()->description('Blog post title.')->required(),
            'slug' => $schema->string()->description('Blog post URL slug.')->required(),
            'excerpt' => $schema->string()->nullable()->description('Blog post excerpt.'),
            'content' => $schema->string()->description('Blog post markdown content.')->required(),
            'is_published' => $schema->boolean()->description('Whether the post is marked published.')->required(),
            'published_at' => $schema->string()->nullable()->description('Publication timestamp.'),
            'is_publicly_visible' => $schema->boolean()->description('Whether the post is visible on the public storefront.')->required(),
            'url' => $schema->string()->description('Public blog post URL.')->required(),
            'cover_image_path' => $schema->string()->nullable()->description('Stored cover image path.'),
            'cover_image_url' => $schema->string()->nullable()->description('Public cover image URL.'),
        ];
    }
}
