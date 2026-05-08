<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(Request $request, string $slug): Response
    {
        $product = Product::with(['images', 'category.parent'])
            ->where('slug', $slug)
            ->firstOrFail();

        $breadcrumbs = $this->buildBreadcrumbs($product);

        $relatedProducts = Product::with(['images'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->limit(8)
            ->get();

        return Inertia::render('Product/Show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'category' => [
                    'id' => $product->category?->id,
                    'name' => $product->category?->name,
                    'slug' => $product->category?->slug,
                ],
                'description' => Str::of($product->description)->markdown(),
                'price' => (float) $product->price,
                'stock' => $product->stock,
                'is_active' => $product->is_active,
                'images' => $product->images->map(fn ($img) => [
                    'id' => $img->id,
                    'url' => $img->image_url,
                    'position' => $img->position,
                ]),
                'breadcrumbs' => $breadcrumbs,
            ],
            'related_products' => $relatedProducts->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'price' => (float) $p->price,
                'image' => $p->image_url,
            ]),
        ]);
    }

    /**
     * @return array<int, array{name: string, slug: string|null}>
     */
    private function buildBreadcrumbs(Product $product): array
    {
        $breadcrumbs = [];
        $breadcrumbs[] = ['name' => 'Inicio', 'slug' => null, 'url' => route('home')];

        $category = $product->category;
        $categoryChain = [];

        while ($category !== null) {
            $categoryChain[] = $category;
            $category = $category->parent;
        }

        foreach (array_reverse($categoryChain) as $cat) {
            $breadcrumbs[] = [
                'name' => $cat->name,
                'slug' => $cat->slug,
                'url' => route('catalog', ['category' => $cat->slug]),
            ];
        }

        $breadcrumbs[] = [
            'name' => $product->name,
            'slug' => $product->slug,
            'url' => null,
        ];

        return $breadcrumbs;
    }
}
