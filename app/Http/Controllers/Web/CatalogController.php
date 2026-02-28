<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function __invoke(): Response
    {
        $products = Product::query()
            ->with(['images' => fn ($query) => $query->orderBy('position')->limit(1)])
            ->whereHas('category', fn ($q) => $q->where('is_active', true))
            ->where('is_active', true)
            ->latest()
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'slug' => $product->slug,
                'name' => $product->name,
                'sku' => $product->sku,
                'category' => $product->category?->name,
                'price' => (float) $product->price,
                'image' => $product->images->first()?->image_url,
                'is_featured' => $product->is_featured,
            ]);

        return Inertia::render('Catalog', [
            'products' => $products,
        ]);
    }
}
