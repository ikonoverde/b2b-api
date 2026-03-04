<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Content\UpdateFeaturedProductsRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ContentFeaturedProductsController extends Controller
{
    public function index(): Response
    {
        $featuredProducts = Product::query()
            ->with(['category', 'images' => fn ($query) => $query->orderBy('position')->limit(1)])
            ->where('is_featured', true)
            ->orderBy('featured_order')
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'category' => $product->category?->name,
                'image_url' => $product->images->first()?->image_url,
                'featured_order' => $product->featured_order,
            ]);

        $availableProducts = Product::query()
            ->with('category')
            ->where('is_active', true)
            ->where('is_featured', false)
            ->whereHas('category', fn ($q) => $q->where('is_active', true))
            ->orderBy('name')
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'category' => $product->category?->name,
            ]);

        return Inertia::render('Content/FeaturedProducts', [
            'featuredProducts' => $featuredProducts,
            'availableProducts' => $availableProducts,
        ]);
    }

    public function update(UpdateFeaturedProductsRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            Product::query()
                ->where('is_featured', true)
                ->update(['is_featured' => false, 'featured_order' => 0]);

            foreach ($validated['products'] as $item) {
                Product::query()
                    ->where('id', $item['id'])
                    ->update([
                        'is_featured' => true,
                        'featured_order' => $item['featured_order'],
                    ]);
            }
        });

        return redirect()->route('admin.featured-products')
            ->with('success', 'Productos destacados actualizados exitosamente.');
    }
}
