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

#[Name('create-blog-post')]
#[Title('Create Blog Post')]
#[Description('Create a blog post using markdown content. Cover images must be existing paths on the public storage disk, such as blog/covers/example.webp or /storage/blog/covers/example.webp.')]
#[IsDestructive(false)]
class CreateBlogPostTool extends Tool
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

        $request->setArguments($this->posts->normalizeForCreate($request->all()));

        $validated = $request->validate($this->posts->createRules(), $this->posts->createMessages());

        if (($validated['cover_image_path'] ?? null) !== null && ! $this->posts->coverImagePathIsValid($validated['cover_image_path'])) {
            return Response::error($this->posts->coverImageError());
        }

        return Response::structured($this->posts->payload($this->posts->create($validated)));
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return BlogPostSchema::createFields($schema);
    }

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return BlogPostSchema::outputFields($schema);
    }
}
