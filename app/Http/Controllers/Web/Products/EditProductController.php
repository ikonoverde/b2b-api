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
        $product->load(['category', 'pricingTiers', 'images']);
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
                'price' => (string) $product->price,
                'cost' => $product->cost ? (string) $product->cost : '',
                'stock' => (string) $product->stock,
                'min_stock' => $product->min_stock ? (string) $product->min_stock : '',
                'is_active' => $product->is_active,
                'is_featured' => $product->is_featured,
                'images' => $product->images->map(fn ($img) => [
                    'id' => $img->id,
                    'image_url' => $img->image_url,
                    'position' => $img->position,
                ])->values()->all(),
                'pricing_tiers' => $product->pricingTiers->map(fn ($tier) => [
                    'min_qty' => (string) $tier->min_qty,
                    'max_qty' => $tier->max_qty ? (string) $tier->max_qty : '',
                    'price' => (string) $tier->price,
                    'discount' => (string) $tier->discount,
                    'label' => $tier->label,
                ])->values()->all(),
            ],
            'categories' => $categories,
            'formulas' => Inertia::defer(fn () => $this->productionApi->getFormulas()),
        ]);
    }
}
