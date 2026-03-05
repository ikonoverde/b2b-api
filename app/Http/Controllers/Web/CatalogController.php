<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $categoryId = $request->integer('category_id') ?: null;

        $products = Product::query()
            ->with(['category', 'images' => fn ($query) => $query->orderBy('position')->limit(1)])
            ->whereHas('category', fn ($q) => $q->where('is_active', true))
            ->where('is_active', true)
            ->when($categoryId, fn ($q) => $q->filterByCategory($categoryId))
            ->latest()
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'slug' => $product->slug,
                'name' => $product->name,
                'sku' => $product->sku,
                'category' => $product->category?->name,
                'category_id' => $product->category_id,
                'price' => (float) $product->price,
                'image' => $product->images->first()?->image_url,
                'is_featured' => $product->is_featured,
            ]);

        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get(['id', 'name']);

        return Inertia::render('Catalog', [
            'products' => $products,
            'categories' => $categories,
            'selectedCategoryId' => $categoryId,
        ]);
    }
}
