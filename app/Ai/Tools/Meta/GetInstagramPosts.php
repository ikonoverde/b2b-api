<?php

namespace App\Ai\Tools\Meta;

use App\Ai\Tools\Ads\MetaTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetInstagramPosts extends MetaTool
{
    public function name(): string
    {
        return 'meta_get_instagram_posts';
    }

    public function description(): Stringable|string
    {
        return 'List recent Instagram posts with organic engagement signals for paid creative research.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->meta->instagramPosts(
            instagramAccountId: $request->string('instagram_business_account_id')->toString() ?: null,
            limit: $request->integer('limit', 25),
        ));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            ...$this->instagramAccountSchema($schema),
            ...$this->limitSchema($schema),
        ];
    }
}
