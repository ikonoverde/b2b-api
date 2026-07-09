<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;

class MarketingProductCatalogService
{
    /**
     * Build the marketing catalog payload from raw tool arguments.
     *
     * @param  array<string, mixed>  $arguments
     * @return array{filters: array{category: ?string, search: ?string, featured_only: bool, limit: int}, count: int, products: array<int, array<string, mixed>>}
     */
    public function build(array $arguments): array
    {
        $limit = min(max((int) ($arguments['limit'] ?? 25), 1), 100);
        $category = $this->filterValue($arguments['category'] ?? null);
        $search = $this->filterValue($arguments['search'] ?? null);
        $featuredOnly = (bool) ($arguments['featured_only'] ?? false);

        $products = Product::query()
            ->with('category')
            ->where('is_active', true)
            ->whereHas('category', fn (Builder $query) => $query->where('is_active', true))
            ->when($category !== null, function (Builder $query) use ($category): void {
                $query->whereHas('category', function (Builder $query) use ($category): void {
                    $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $category).'%';

                    $query->where('name', 'like', $like)
                        ->orWhere('slug', 'like', $like);
                });
            })
            ->when($search !== null, fn (Builder $query) => $query->search($search))
            ->when($featuredOnly, fn (Builder $query) => $query->where('is_featured', true))
            ->orderByDesc('is_featured')
            ->orderBy('featured_order')
            ->orderBy('name')
            ->limit($limit)
            ->get();

        return [
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
        ];
    }

    private function filterValue(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        return trim($value) === '' ? null : trim($value);
    }

    private function summary(?string $value): ?string
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        return str($value)->squish()->limit(300)->toString();
    }
}
