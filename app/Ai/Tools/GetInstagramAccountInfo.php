<?php

namespace App\Ai\Tools;

use App\Ai\Tools\Ads\MetaTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetInstagramAccountInfo extends MetaTool
{
    public function name(): string
    {
        return 'meta_get_instagram_account_info';
    }

    public function description(): Stringable|string
    {
        return 'Get read-only Instagram business account profile and audience size data for ads context.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->meta->instagramAccountInfo($request->string('instagram_business_account_id')->toString() ?: null));
    }

    public function schema(JsonSchema $schema): array
    {
        return $this->instagramAccountSchema($schema);
    }
}
