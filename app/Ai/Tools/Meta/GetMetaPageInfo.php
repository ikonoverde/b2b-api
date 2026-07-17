<?php

namespace App\Ai\Tools\Meta;

use App\Ai\Tools\Ads\MetaTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetMetaPageInfo extends MetaTool
{
    public function name(): string
    {
        return 'meta_get_page_info';
    }

    public function description(): Stringable|string
    {
        return 'Get read-only Facebook Page profile, audience, and linkage data for ads context and creative research.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->meta->pageInfo($request->string('page_id')->toString() ?: null));
    }

    public function schema(JsonSchema $schema): array
    {
        return $this->pageSchema($schema);
    }
}
