<?php

namespace App\Ai\Tools;

use App\Models\Product;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Database\Eloquent\Builder;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class MarketingProductCatalog implements Tool
{
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
        $data = $request->all();
        $limit = min(max((int) ($data['limit'] ?? 25), 1), 100);
        $category = isset($data['category']) ? trim((string) $data['category']) : null;
        $search = isset($data['search']) ? trim((string) $data['search']) : null;
        $featuredOnly = (bool) ($data['featured_only'] ?? false);

        $products = Product::query()
            ->with('category')
            ->where('is_active', true)
            ->whereHas('category', fn (Builder $query) => $query->where('is_active', true))
            ->when($category !== null && $category !== '', function (Builder $query) use ($category): void {
                $query->whereHas('category', function (Builder $query) use ($category): void {
                    $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $category).'%';

                    $query->where('name', 'like', $like)
                        ->orWhere('slug', 'like', $like);
                });
            })
            ->when($search !== null && $search !== '', fn (Builder $query) => $query->search($search))
            ->when($featuredOnly, fn (Builder $query) => $query->where('is_featured', true))
            ->orderByDesc('is_featured')
            ->orderBy('featured_order')
            ->orderBy('name')
            ->limit($limit)
            ->get();

        return $this->json([
            'filters' => [
                'category' => $category,
                'search' => $search,
                'featured_only' => $featuredOnly,
                'limit' => $limit,
            ],
            'count' => $products->count(),
            'products' => $products->map(fn (Product $product): array => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'slug' => $product->slug,
                'category' => $product->category?->name,
                'price' => (float) $product->price,
                'stock' => $product->stock,
                'is_featured' => $product->is_featured,
                'active_ingredients' => $this->summary($product->active_ingredients),
                'recommendations' => $this->summary($product->recommendations),
                'description_summary' => $this->summary($product->description),
            ])->all(),
        ]);
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

    private function summary(?string $value): ?string
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        return str($value)->squish()->limit(300)->toString();
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function json(array $payload): string
    {
        return json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    }
}
