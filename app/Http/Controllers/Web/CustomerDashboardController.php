<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $featuredProducts = Product::query()
            ->with(['images' => fn ($query) => $query->orderBy('position')->limit(1)])
            ->where('is_active', true)
            ->orderByDesc('is_featured')
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'slug' => $product->slug,
                'name' => $product->name,
                'category' => $product->category?->name,
                'price' => (float) $product->price,
                'image' => $product->images->first()?->image_url,
            ]);

        $profile = [
            'orders_count' => $user->orders()->count(),
            'total_spent' => (float) $user->orders()->sum('total_amount'),
            'discount_percentage' => (float) $user->discount_percentage,
        ];

        return Inertia::render('CustomerDashboard', [
            'featuredProducts' => $featuredProducts,
            'profile' => $profile,
            'banners' => Inertia::defer(fn () => Banner::resolvedActive()),
        ]);
    }
}
