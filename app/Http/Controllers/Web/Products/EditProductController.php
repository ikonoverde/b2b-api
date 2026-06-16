<?php

namespace App\Http\Controllers\Web\Products;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Services\ProductionApiService;
use Inertia\Inertia;
use Inertia\Response;

class EditProductController extends Controller
{
    public function __construct(private ProductionApiService $productionApi) {}

    public function __invoke(Product $product): Response
    {
        $product->load(['category', 'images']);
        $categories = Category::query()->active()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Products/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'category_id' => $product->category_id,
                'formula_id' => $product->formula_id,
                'description' => $product->description ?? '',
                'active_ingredients' => $product->active_ingredients ?? '',
                'price' => (string) $product->price,
                'cost' => $product->cost ? (string) $product->cost : '',
                'stock' => (string) $product->stock,
                'min_stock' => $product->min_stock ? (string) $product->min_stock : '',
                'weight_kg' => $product->weight_kg !== null ? (string) $product->weight_kg : '',
                'width_cm' => $product->width_cm !== null ? (string) $product->width_cm : '',
                'height_cm' => $product->height_cm !== null ? (string) $product->height_cm : '',
                'depth_cm' => $product->depth_cm !== null ? (string) $product->depth_cm : '',
                'shipping_packages' => collect($product->shipping_packages ?? [])
                    ->map(fn (array $package): array => $this->formatShippingPackage($package))
                    ->values()
                    ->all(),
                'is_active' => $product->is_active,
                'is_featured' => $product->is_featured,
                'images' => $product->images->map(fn ($img) => [
                    'id' => $img->id,
                    'image_url' => $img->image_url,
                    'position' => $img->position,
                ])->values()->all(),
            ],
            'categories' => $categories,
            'formulas' => Inertia::defer(fn () => $this->productionApi->getFormulas()),
        ]);
    }

    /**
     * @param  array<string, mixed>  $package
     * @return array{quantity: string, weight_kg: string, width_cm: string, height_cm: string, depth_cm: string}
     */
    private function formatShippingPackage(array $package): array
    {
        return [
            'quantity' => (string) ($package['quantity'] ?? ''),
            'weight_kg' => (string) ($package['weight_kg'] ?? ''),
            'width_cm' => (string) ($package['width_cm'] ?? ''),
            'height_cm' => (string) ($package['height_cm'] ?? ''),
            'depth_cm' => (string) ($package['depth_cm'] ?? ''),
        ];
    }
}
