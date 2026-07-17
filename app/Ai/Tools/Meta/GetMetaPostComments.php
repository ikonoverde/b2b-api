<?php

namespace App\Ai\Tools\Meta;

use App\Ai\Tools\Ads\MetaTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetMetaPostComments extends MetaTool
{
    public function name(): string
    {
        return 'meta_get_post_comments';
    }

    public function description(): Stringable|string
    {
        return 'Read Facebook post comments for qualitative creative research. This tool does not reply, hide, delete, or moderate comments.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->meta->postComments(
            postId: $request->string('post_id')->toString(),
            limit: $request->integer('limit', 25),
        ));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'post_id' => $schema->string()
                ->description('Facebook post ID.')
                ->required(),
            ...$this->limitSchema($schema),
        ];
    }
}
