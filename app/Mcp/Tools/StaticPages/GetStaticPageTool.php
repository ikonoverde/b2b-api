<?php

namespace App\Mcp\Tools\StaticPages;

use App\Services\StaticPages\StaticPageSchema;
use App\Services\StaticPages\StaticPageService;
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

#[Name('get-static-page')]
#[Title('Get Static Page')]
#[Description('Get a static storefront page by ID or slug, including its full markdown content, publication state, and public URL.')]
#[IsReadOnly]
class GetStaticPageTool extends Tool
{
    public function __construct(private StaticPageService $pages) {}

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response|ResponseFactory
    {
        $user = $request->user();

        if ($user === null || ! in_array($user->role, ['admin', 'super_admin'], true)) {
            return Response::error('Permission denied.');
        }

        $request->setArguments($this->pages->normalizeForLookup($request->all()));

        $validated = $request->validate($this->pages->lookupRules(), $this->pages->lookupMessages());

        $staticPage = $this->pages->resolve($validated);

        if ($staticPage === null) {
            return Response::error('Provide either id or slug to choose the static page to retrieve.');
        }

        return Response::structured($this->pages->payload($staticPage, withContent: true));
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return StaticPageSchema::lookupFields($schema);
    }

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return StaticPageSchema::outputFields($schema, withContent: true);
    }
}
