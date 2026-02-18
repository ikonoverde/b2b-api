<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featuredProducts = Product::query()
            ->where('is_active', true)
            ->orderByDesc('is_featured')
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'image_url' => $product->image_url,
            ]);

        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
