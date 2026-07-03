<?php

namespace App\Ai\Tools;

use App\Ai\Tools\Ads\MetaTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetInstagramPostComments extends MetaTool
{
    public function name(): string
    {
        return 'meta_get_instagram_post_comments';
    }

    public function description(): Stringable|string
    {
        return 'Read Instagram post comments for qualitative creative research. This tool does not reply, hide, delete, or moderate comments.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->meta->instagramPostComments(
            mediaId: $request->string('media_id')->toString(),
            limit: $request->integer('limit', 25),
        ));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'media_id' => $schema->string()
                ->description('Instagram media ID.')
                ->required(),
            ...$this->limitSchema($schema),
        ];
    }
}
