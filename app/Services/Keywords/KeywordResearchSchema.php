<?php

namespace App\Services\Keywords;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;

class KeywordResearchSchema
{
    /**
     * Input fields shared by every keyword research tool, in both the AI and MCP flavors.
     *
     * @return array<string, Type>
     */
    public static function commonFields(JsonSchema $schema): array
    {
        return [
            'query' => $schema->string()
                ->nullable()
                ->description('Seed keyword, topic, product, category, or search query to investigate.'),
            'keywords' => $schema->array()
                ->nullable()
                ->description('Optional list of seed keywords when researching a cluster.'),
            'domain' => $schema->string()
                ->nullable()
                ->description('Optional target domain for keyword gap, ranking, or Search Console style analysis.'),
            'competitors' => $schema->array()
                ->nullable()
                ->description('Optional competitor domains to compare against.'),
            'country' => $schema->string()
                ->nullable()
                ->description('Country or market code. Prefer MX for Ikonoverde unless the user asks otherwise.'),
            'language' => $schema->string()
                ->nullable()
                ->description('Language code. Prefer es for Mexican Spanish keyword research unless the user asks otherwise.'),
            'date_range' => $schema->string()
                ->nullable()
                ->description('Optional reporting date range such as last_28_days, last_3_months, or 2026-01-01:2026-01-31.'),
            'limit' => $schema->integer()
                ->nullable()
                ->description('Maximum records to return when the provider integration is implemented.'),
        ];
    }
}
