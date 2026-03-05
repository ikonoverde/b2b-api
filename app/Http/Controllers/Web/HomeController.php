<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Models\Banner;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featuredProducts = Product::query()
            ->with(['category', 'images' => fn ($query) => $query->orderBy('position')->limit(1)])
            ->whereHas('category', fn ($q) => $q->where('is_active', true))
            ->where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('featured_order')
            ->limit(4)
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'slug' => $product->slug,
                'name' => $product->name,
                'category' => $product->category?->name,
                'image_url' => $product->images->first()?->image_url,
            ]);

        $banners = BannerResource::collection(
            Banner::query()
                ->active()
                ->with(['product:id,slug'])
                ->orderBy('display_order')
                ->get()
        )->resolve();

        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts,
            'banners' => $banners,
        ]);
    }
}
