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

#[Name('list-blog-posts')]
#[Title('List Blog Posts')]
#[Description('List blog posts, newest first, without their markdown bodies. Filter by status (live, scheduled, draft, or all) and by a search term matched against title, slug, and excerpt.')]
#[IsReadOnly]
class ListBlogPostsTool extends Tool
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

        $request->setArguments($this->posts->normalizeForList($request->all()));

        $validated = $request->validate($this->posts->listRules(), $this->posts->listMessages());

        return Response::structured($this->posts->list($validated));
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return BlogPostSchema::listFields($schema);
    }

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return BlogPostSchema::listOutputFields($schema);
    }
}
