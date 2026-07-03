<?php

namespace App\Ai\Tools;

use App\Ai\Tools\Ads\MetaTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetInstagramPostInsights extends MetaTool
{
    public function name(): string
    {
        return 'meta_get_instagram_post_insights';
    }

    public function description(): Stringable|string
    {
        return 'Get Instagram media insights such as impressions, reach, engagement, saved, likes, comments, shares, and plays where available.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->meta->instagramPostInsights(
            mediaId: $request->string('media_id')->toString(),
            metrics: $request->array('metrics'),
        ));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'media_id' => $schema->string()
                ->description('Instagram media ID.')
                ->required(),
            'metrics' => $schema->array()
                ->description('Insight metrics, for example ["impressions","reach","engagement","saved","likes","comments","shares","plays"].')
                ->required(),
        ];
    }
}
