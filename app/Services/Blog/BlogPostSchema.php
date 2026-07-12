<?php

namespace App\Services\Blog;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;

/**
 * Shared field definitions for every blog tool, MCP or AI.
 *
 * The publication fields are optional here because not every caller is allowed to set them. A tool
 * that omits them cannot put a post on the public storefront no matter what the model decides to
 * send, which is a stronger guarantee than any sentence in a prompt.
 */
final class BlogPostSchema
{
    /**
     * @return array<string, Type>
     */
    public static function createFields(JsonSchema $schema, bool $withPublication = true): array
    {
        $fields = [
            'title' => $schema->string()
                ->description('Blog post title.')
                ->required(),
            'content' => $schema->string()
                ->description('Markdown content for the blog post.')
                ->required(),
            'slug' => $schema->string()
                ->nullable()
                ->description('URL slug. If omitted, it is generated from the title.'),
            'excerpt' => $schema->string()
                ->nullable()
                ->description('Short summary shown on blog listing pages. Maximum 500 characters.'),
            'cover_image_path' => $schema->string()
                ->nullable()
                ->description(self::coverImageDescription()),
        ];

        if (! $withPublication) {
            return $fields;
        }

        return [
            ...$fields,
            'is_published' => $schema->boolean()
                ->description('Whether the blog post is published. Public visibility also requires published_at to be now or in the past.')
                ->default(false),
            'published_at' => $schema->string()
                ->nullable()
                ->description('Publication date/time. Use an ISO 8601 string or any Laravel-parseable date.'),
        ];
    }

    /**
     * @return array<string, Type>
     */
    public static function editFields(JsonSchema $schema, bool $withPublication = true): array
    {
        $fields = [
            'id' => $schema->integer()
                ->nullable()
                ->description('Blog post ID to edit. Provide either id or current_slug.'),
            'current_slug' => $schema->string()
                ->nullable()
                ->description('Current blog post slug to edit. Provide either id or current_slug. Use slug to set a new slug.'),
            'title' => $schema->string()
                ->nullable()
                ->description('New blog post title.'),
            'content' => $schema->string()
                ->nullable()
                ->description('New markdown content for the blog post.'),
            'slug' => $schema->string()
                ->nullable()
                ->description('New URL slug. Must be unique.'),
            'excerpt' => $schema->string()
                ->nullable()
                ->description('New short summary shown on blog listing pages. Maximum 500 characters. Pass an empty string to clear.'),
            'cover_image_path' => $schema->string()
                ->nullable()
                ->description(self::coverImageDescription().' Pass an empty string to remove the cover image.'),
        ];

        if (! $withPublication) {
            return $fields;
        }

        return [
            ...$fields,
            'is_published' => $schema->boolean()
                ->nullable()
                ->description('Whether the blog post is published. Public visibility also requires published_at to be now or in the past.'),
            'published_at' => $schema->string()
                ->nullable()
                ->description('Publication date/time. Use an ISO 8601 string, any Laravel-parseable date, or an empty string to clear.'),
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
                ->description('Blog post ID to retrieve. Provide either id or slug.'),
            'slug' => $schema->string()
                ->nullable()
                ->description('Blog post URL slug to retrieve. Provide either id or slug.'),
        ];
    }

    /**
     * @return array<string, Type>
     */
    public static function outputFields(JsonSchema $schema, bool $withContent = false, bool $withVisibility = false): array
    {
        $fields = [
            'id' => $schema->integer()->description('Blog post ID.')->required(),
            'title' => $schema->string()->description('Blog post title.')->required(),
            'slug' => $schema->string()->description('Blog post URL slug.')->required(),
            'excerpt' => $schema->string()->nullable()->description('Blog post excerpt.'),
        ];

        if ($withContent) {
            $fields['content'] = $schema->string()->description('Blog post markdown content.')->required();
        }

        $fields['is_published'] = $schema->boolean()->description('Whether the post is marked published.')->required();
        $fields['published_at'] = $schema->string()->nullable()->description('Publication timestamp.');

        if ($withVisibility) {
            $fields['is_publicly_visible'] = $schema->boolean()->description('Whether the post is visible on the public storefront.')->required();
        }

        $fields['url'] = $schema->string()->description('Public blog post URL.')->required();
        $fields['cover_image_path'] = $schema->string()->nullable()->description('Stored cover image path.');
        $fields['cover_image_url'] = $schema->string()->nullable()->description('Public cover image URL.');

        return $fields;
    }

    private static function coverImageDescription(): string
    {
        return 'Existing PNG, JPG, JPEG, or WebP image path on the public storage disk. Accepts blog/covers/image.webp, storage/blog/covers/image.webp, /storage/blog/covers/image.webp, or an absolute path under storage/app/public.';
    }
}
