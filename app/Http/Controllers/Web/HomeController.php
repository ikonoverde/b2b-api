<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response|RedirectResponse
    {
        if (auth()->check()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Home', [
            'featuredProducts' => Product::featuredForHome()->limit(4)->get()->map(self::toCardPayload(...)),
            'banners' => Banner::resolvedActive(),
        ]);
    }

    /**
     * @return array{id: int, slug: string, name: string, category: ?string, image_url: ?string, price: float}
     */
    public static function toCardPayload(Product $product): array
    {
        return [
            'id' => $product->id,
            'slug' => $product->slug,
            'name' => $product->name,
            'category' => $product->category?->name,
            'image_url' => $product->images->first()?->image_url,
            'price' => (float) $product->price,
        ];
    }
}
