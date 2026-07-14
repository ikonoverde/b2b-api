<?php

namespace App\Ai\Tools\StaticPages;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Services\StaticPages\StaticPageService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

/**
 * The static pages are a closed set, so listing them is how a model learns what it may touch.
 * There is no tool to add one: a new slug would be a row in a table nothing routes to.
 */
class ListStaticPages implements Tool
{
    use FormatsToolResponses;

    public function __construct(private StaticPageService $pages) {}

    public function name(): string
    {
        return 'static_pages_list';
    }

    public function description(): Stringable|string
    {
        return 'List every static storefront page (terms, privacy, about, FAQ, and any others) with its slug, title, and whether it is live. Static pages are a fixed set: you cannot create or delete one, only rewrite the pages that already exist. Call this first to learn the slugs.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json(['pages' => $this->pages->all()]);
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
