<?php

namespace App\Ai\Tools\Meta;

use App\Ai\Tools\Ads\MetaTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetMetaPagePosts extends MetaTool
{
    public function name(): string
    {
        return 'meta_get_page_posts';
    }

    public function description(): Stringable|string
    {
        return 'List recent Facebook Page posts with organic engagement signals for creative research before paid promotion.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->meta->pagePosts(
            pageId: $request->string('page_id')->toString() ?: null,
            limit: $request->integer('limit', 25),
        ));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            ...$this->pageSchema($schema),
            ...$this->limitSchema($schema),
        ];
    }
}
