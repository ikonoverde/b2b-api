<?php

namespace App\Services\StaticPages;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;

/**
 * Shared field definitions for every static page tool, MCP or AI.
 *
 * There is no create schema, because there is no create tool: the storefront routes name their pages
 * one by one, so a page nobody routed to is a row, not a page.
 *
 * `is_published` is optional here for the same reason it is on the blog schema. On a static page it is
 * not a draft flag at all: unpublishing `terms` does not hide a draft, it takes the terms of service
 * off a live storefront. A tool that omits the field cannot do that, whatever the model decides to send.
 */
final class StaticPageSchema
{
    /**
     * @return array<string, Type>
     */
    public static function editFields(JsonSchema $schema, bool $withPublication = true): array
    {
        $fields = [
            'id' => $schema->integer()
                ->nullable()
                ->description('Static page ID to edit. Provide either id or slug.'),
            'slug' => $schema->string()
                ->nullable()
                ->description('Slug of the static page to edit, such as terms or faq. Provide either id or slug. The slug identifies the page and cannot be changed.'),
            'title' => $schema->string()
                ->nullable()
                ->description('New page title.'),
            'content' => $schema->string()
                ->nullable()
                ->description('New markdown content for the page. This replaces the whole page body, so send the complete text, not a fragment.'),
        ];

        if (! $withPublication) {
            return $fields;
        }

        return [
            ...$fields,
            'is_published' => $schema->boolean()
                ->nullable()
                ->description('Whether the page is served on the storefront. Unpublishing a routed page such as terms makes its URL return 404.'),
        ];
    }

    /**
     * @return array<string, Type>
     */
    public static function lookupFields(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()
                ->nullable()
                ->description('Static page ID to retrieve. Provide either id or slug.'),
            'slug' => $schema->string()
                ->nullable()
                ->description('Static page slug to retrieve, such as terms or faq. Provide either id or slug.'),
        ];
    }

    /**
     * @return array<string, Type>
     */
    public static function outputFields(JsonSchema $schema, bool $withContent = false): array
    {
        $fields = [
            'id' => $schema->integer()->description('Static page ID.')->required(),
            'slug' => $schema->string()->description('Static page slug.')->required(),
            'title' => $schema->string()->description('Static page title.')->required(),
        ];

        if ($withContent) {
            $fields['content'] = $schema->string()->description('Static page markdown content.')->required();
        }

        $fields['is_published'] = $schema->boolean()->description('Whether the page is marked published.')->required();
        $fields['is_publicly_visible'] = $schema->boolean()->description('Whether the page is actually reachable on the storefront: published and routed.')->required();
        $fields['url'] = $schema->string()->nullable()->description('Public page URL, or null when no storefront route serves this slug.');
        $fields['updated_at'] = $schema->string()->nullable()->description('Last update timestamp.');

        return $fields;
    }

    /**
     * @return array<string, Type>
     */
    public static function listOutputFields(JsonSchema $schema): array
    {
        return [
            'pages' => $schema->array()
                ->items($schema->object(self::outputFields($schema)))
                ->description('Every static page on the storefront.')
                ->required(),
        ];
    }
}
