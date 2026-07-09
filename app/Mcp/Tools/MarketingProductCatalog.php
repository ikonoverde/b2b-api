<?php

namespace App\Mcp\Tools;

use App\Services\MarketingProductCatalogService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Title;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Name('marketing-product-catalog')]
#[Title('Marketing Product Catalog')]
#[Description('Return active storefront products for marketing planning, including category, SKU, slug, price, stock, featured flag, ingredients, recommendations, and description summary.')]
#[IsReadOnly]
class MarketingProductCatalog extends Tool
{
    public function __construct(private MarketingProductCatalogService $catalog) {}

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response|ResponseFactory
    {
        $user = $request->user();

        if ($user === null || ! in_array($user->role, ['admin', 'super_admin'], true)) {
            return Response::error('Permission denied.');
        }

        $validated = $request->validate([
            'category' => ['nullable', 'string'],
            'search' => ['nullable', 'string'],
            'featured_only' => ['nullable', 'boolean'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        return Response::structured($this->catalog->build($validated));
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'category' => $schema->string()
                ->nullable()
                ->description('Optional category name or slug fragment to filter products.'),
            'search' => $schema->string()
                ->nullable()
                ->description('Optional search term matched against product name, description, or SKU.'),
            'featured_only' => $schema->boolean()
                ->nullable()
                ->description('Whether to return only featured products.'),
            'limit' => $schema->integer()
                ->nullable()
                ->description('Maximum products to return. Defaults to 25. Must be between 1 and 100; larger values are rejected.'),
        ];
    }

    /**
     * @return array<string, Type>
     */
    public function outputSchema(JsonSchema $schema): array
    {
        return [
            'filters' => $schema->object([
                'category' => $schema->string()->nullable()->description('Applied category filter.'),
                'search' => $schema->string()->nullable()->description('Applied search term.'),
                'featured_only' => $schema->boolean()->description('Whether only featured products were returned.')->required(),
                'limit' => $schema->integer()->description('Applied maximum product count.')->required(),
            ])->description('The filters applied to the catalog query.')->required(),
            'count' => $schema->integer()->description('Number of products returned.')->required(),
            'products' => $schema->array()->items($schema->object([
                'id' => $schema->integer()->description('Product ID.')->required(),
                'name' => $schema->string()->description('Product name.')->required(),
                'sku' => $schema->string()->nullable()->description('Product SKU.'),
                'slug' => $schema->string()->description('Product URL slug.')->required(),
                'category' => $schema->string()->nullable()->description('Category name.'),
                'price' => $schema->number()->description('Product price.')->required(),
                'stock' => $schema->integer()->description('Units in stock.')->required(),
                'is_featured' => $schema->boolean()->description('Whether the product is featured.')->required(),
                'active_ingredients' => $schema->string()->nullable()->description('Active ingredients summary.'),
                'recommendations' => $schema->string()->nullable()->description('Usage recommendations summary.'),
                'description_summary' => $schema->string()->nullable()->description('Squished description, capped at 300 characters.'),
            ]))->description('The matching active products.')->required(),
        ];
    }
}
