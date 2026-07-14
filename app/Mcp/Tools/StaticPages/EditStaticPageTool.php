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
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

/**
 * This tool may set is_published; the AI tool of the same purpose may not. The difference is that a
 * human approves every call to this one before it runs. Unpublishing a routed page 404s a live URL,
 * so it is marked destructive.
 */
#[Name('edit-static-page')]
#[Title('Edit Static Page')]
#[Description('Edit a static storefront page by ID or slug. Content replaces the whole page body, so read the page first with get-static-page. The slug identifies the page and cannot be changed, and pages cannot be created. Unpublishing a routed page such as terms makes its public URL return 404.')]
#[IsDestructive]
class EditStaticPageTool extends Tool
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

        $request->setArguments($this->pages->normalizeForEdit($request->all()));

        $validated = $request->validate($this->pages->editRules(), $this->pages->editMessages());

        $staticPage = $this->pages->resolve($validated);

        if ($staticPage === null) {
            return Response::error('Provide either id or slug to choose the static page to edit.');
        }

        $updates = $this->pages->updates($validated);

        if ($updates === []) {
            return Response::error('Provide a title, content, or is_published value to update on the static page.');
        }

        return Response::structured(
            $this->pages->payload($this->pages->update($staticPage, $updates), withContent: true)
        );
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return StaticPageSchema::editFields($schema);
    }

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return StaticPageSchema::outputFields($schema, withContent: true);
    }
}
