<?php

namespace App\Ai\Tools\StaticPages;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Services\StaticPages\StaticPageSchema;
use App\Services\StaticPages\StaticPageService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Facades\Validator;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

/**
 * Edit a static page's words. Never whether it is served.
 *
 * `is_published` is stripped for the same reason the blog's publication fields are stripped: nothing
 * asks a human before this call runs. It matters more here. A blog draft that never goes live is a
 * post nobody reads; an unpublished `terms` page is a live storefront whose terms of service 404,
 * and the page it takes down was already published by someone who meant it.
 *
 * The model may rewrite these pages, which a human can revert. It may not decide whether a customer
 * can read the privacy policy.
 */
class EditStaticPage implements Tool
{
    use FormatsToolResponses;

    public function __construct(private StaticPageService $pages) {}

    public function name(): string
    {
        return 'static_page_edit';
    }

    public function description(): Stringable|string
    {
        return 'Rewrite an existing static storefront page by ID or slug. Partial update: omit a field to keep its stored value. Content replaces the entire page body, so call static_page_get first and edit what is there rather than sending a fragment. This tool cannot publish or unpublish a page, and cannot create or rename one.';
    }

    public function handle(Request $request): Stringable|string
    {
        $arguments = $this->pages->normalizeForEdit($request->all());

        unset($arguments['is_published']);

        $validator = Validator::make($arguments, $this->pages->editRules(), $this->pages->editMessages());

        if ($validator->fails()) {
            return $this->json(['error' => $validator->errors()->first()]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        $staticPage = $this->pages->resolve($validated);

        if ($staticPage === null) {
            return $this->json(['error' => 'Provide either id or slug to choose the static page to edit.']);
        }

        $updates = $this->pages->updates($validated);

        if ($updates === []) {
            return $this->json(['error' => 'Provide a title or content to update on the static page.']);
        }

        return $this->json(
            $this->pages->payload($this->pages->update($staticPage, $updates), withContent: true)
        );
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return StaticPageSchema::editFields($schema, withPublication: false);
    }
}
