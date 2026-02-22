<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(Product $product): Response
    {
        $product->load(['pricingTiers', 'images']);

        return Inertia::render('Product/Show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'category' => $product->category,
                'description' => $product->description,
                'price' => (float) $product->price,
                'size' => null,
                'images' => $product->images->map(fn ($img) => [
                    'id' => $img->id,
                    'url' => $img->image_url,
                ]),
                'pricing_tiers' => $product->pricingTiers->map(fn ($tier) => [
                    'min_qty' => $tier->min_qty,
                    'max_qty' => $tier->max_qty,
                    'price' => (float) $tier->price,
                    'discount' => (float) $tier->discount,
                    'label' => $tier->label,
                ]),
            ],
        ]);
    }
}
