<?php

namespace App\Ai\Tools;

use App\Ai\Tools\Ads\MetaTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetMetaPostInsights extends MetaTool
{
    public function name(): string
    {
        return 'meta_get_post_insights';
    }

    public function description(): Stringable|string
    {
        return 'Get Facebook post insights such as impressions, reach, clicks, engaged users, reactions, and paid/organic splits where available.';
    }

    public function handle(Request $request): Stringable|string
    {
        return $this->json($this->meta->postInsights(
            postId: $request->string('post_id')->toString(),
            metrics: $request->array('metrics'),
            period: $request->string('period')->toString() ?: null,
        ));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'post_id' => $schema->string()
                ->description('Facebook post ID.')
                ->required(),
            'metrics' => $schema->array()
                ->description('Insight metrics, for example ["post_impressions","post_impressions_paid","post_impressions_organic","post_clicks","post_engaged_users","post_reactions_by_type_total"].')
                ->required(),
            'period' => $schema->string()
                ->nullable()
                ->description('Optional Meta insights period, such as lifetime, day, week, days_28.'),
        ];
    }
}
