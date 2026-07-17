<?php

namespace App\Ai\Tools\Marketing;

use App\Services\MarketingProductCatalogService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class MarketingProductCatalog implements Tool
{
    public function __construct(private MarketingProductCatalogService $catalog) {}

    public function name(): string
    {
        return 'marketing_product_catalog';
    }

    public function description(): Stringable|string
    {
        return 'Return active storefront products for marketing planning, including category, SKU, slug, price, stock, featured flag, ingredients, recommendations, and description summary.';
    }

    public function handle(Request $request): Stringable|string
    {
        return json_encode(
            $this->catalog->build($request->all()),
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR,
        );
    }

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
                ->description('Maximum products to return. Defaults to 25 and caps at 100.'),
        ];
    }
}
