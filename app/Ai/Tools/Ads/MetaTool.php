<?php

namespace App\Ai\Tools\Ads;

use App\Ai\Tools\Ads\Concerns\FormatsToolResponses;
use App\Services\Ads\MetaGraphService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Ai\Contracts\Tool;

abstract class MetaTool implements Tool
{
    use FormatsToolResponses;

    public function __construct(protected MetaGraphService $meta) {}

    /**
     * @return array<string, Type>
     */
    protected function pageSchema(JsonSchema $schema): array
    {
        return [
            'page_id' => $schema->string()
                ->nullable()
                ->description('Facebook Page ID. Defaults to services.meta_graph.page_id.'),
        ];
    }

    /**
     * @return array<string, Type>
     */
    protected function instagramAccountSchema(JsonSchema $schema): array
    {
        return [
            'instagram_business_account_id' => $schema->string()
                ->nullable()
                ->description('Instagram Business Account ID. Defaults to services.meta_graph.instagram_business_account_id.'),
        ];
    }

    /**
     * @return array<string, Type>
     */
    protected function limitSchema(JsonSchema $schema): array
    {
        return [
            'limit' => $schema->integer()
                ->nullable()
                ->description('Maximum records to return. Defaults to 25.'),
        ];
    }
}
