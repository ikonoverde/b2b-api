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

class GetStaticPage implements Tool
{
    use FormatsToolResponses;

    public function __construct(private StaticPageService $pages) {}

    public function name(): string
    {
        return 'static_page_get';
    }

    public function description(): Stringable|string
    {
        return 'Read a static storefront page by ID or slug, including its full markdown content and whether it is live. An edit replaces the whole page body, so read the page first and rewrite from what is actually there.';
    }

    public function handle(Request $request): Stringable|string
    {
        $validator = Validator::make(
            $this->pages->normalizeForLookup($request->all()),
            $this->pages->lookupRules(),
            $this->pages->lookupMessages(),
        );

        if ($validator->fails()) {
            return $this->json(['error' => $validator->errors()->first()]);
        }

        /** @var array<string, mixed> $validated */
        $validated = $validator->validated();

        $staticPage = $this->pages->resolve($validated);

        if ($staticPage === null) {
            return $this->json(['error' => 'Provide either id or slug to choose the static page to retrieve.']);
        }

        return $this->json($this->pages->payload($staticPage, withContent: true));
    }

    /**
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return StaticPageSchema::lookupFields($schema);
    }
}
