<?php

namespace App\Mcp\Tools;

use App\Services\Blog\BlogPostSchema;
use App\Services\Blog\BlogPostService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
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
    public function __construct(private BlogPostService $posts) {}

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response|ResponseFactory
    {
        $user = $request->user();

        if ($user === null || ! in_array($user->role, ['admin', 'super_admin'], true)) {
            return Response::error('Permission denied.');
        }

        $request->setArguments($this->posts->normalizeForEdit($request->all()));

        $validated = $request->validate($this->posts->editRules(), $this->posts->editMessages());

        $blogPost = $this->posts->resolve($validated, slugKey: 'current_slug');

        if ($blogPost === null) {
            return Response::error('Provide either id or current_slug to choose the blog post to edit.');
        }

        $request->validate($this->posts->slugRules($blogPost), $this->posts->slugMessages());

        if (array_key_exists('cover_image_path', $validated) && $validated['cover_image_path'] !== null && ! $this->posts->coverImagePathIsValid($validated['cover_image_path'])) {
            return Response::error($this->posts->coverImageError());
        }

        $updates = $this->posts->updates($validated);

        if ($updates === []) {
            return Response::error('Provide at least one blog post field to update.');
        }

        return Response::structured(
            $this->posts->payload($this->posts->update($blogPost, $updates), withContent: true)
        );
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return BlogPostSchema::editFields($schema);
    }

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return BlogPostSchema::outputFields($schema, withContent: true);
    }
}
