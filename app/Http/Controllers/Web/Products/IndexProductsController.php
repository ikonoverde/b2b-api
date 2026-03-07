<?php

namespace App\Http\Controllers\Web\Products;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class IndexProductsController extends Controller
{
    public function __invoke(): Response
    {
        $products = Product::query()
            ->with(['category', 'images' => fn ($query) => $query->orderBy('position')->limit(1)])
            ->withCount(['orderItems as pending_orders_count' => function ($query) {
                $query->whereHas('order', function ($orderQuery) {
                    $orderQuery->whereIn('status', Order::PENDING_STATUSES);
                });
            }])
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'category' => $product->category?->name,
                'price' => (float) $product->price,
                'stock' => $product->stock,
                'status' => $product->status,
                'image' => $product->images->first()?->image_url,
                'has_pending_orders' => $product->pending_orders_count > 0,
            ]);

        return Inertia::render('Products', [
            'products' => $products,
        ]);
    }
}
