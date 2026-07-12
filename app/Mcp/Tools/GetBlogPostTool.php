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
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Name('get-blog-post')]
#[Title('Get Blog Post')]
#[Description('Get the details of a blog post by ID or slug, including markdown content and cover image information.')]
#[IsReadOnly]
class GetBlogPostTool extends Tool
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

        $request->setArguments($this->posts->normalizeForLookup($request->all()));

        $validated = $request->validate($this->posts->lookupRules(), $this->posts->lookupMessages());

        $blogPost = $this->posts->resolve($validated);

        if ($blogPost === null) {
            return Response::error('Provide either id or slug to choose the blog post to retrieve.');
        }

        return Response::structured($this->posts->payload($blogPost, withContent: true, withVisibility: true));
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return BlogPostSchema::lookupFields($schema);
    }

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return BlogPostSchema::outputFields($schema, withContent: true, withVisibility: true);
    }
}
