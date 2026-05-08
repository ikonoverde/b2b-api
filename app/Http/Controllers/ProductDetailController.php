<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductDetailResource;
use App\Models\Product;

/**
 * @group Products
 *
 * APIs for product management
 */
class ProductDetailController extends Controller
{
    /**
     * Get Product Details
     *
     * Retrieve a single product.
     *
     * @response 200 scenario="Success" {"data": {"id": 1, "name": "Fertilizante Premium", "sku": "FER-001", "category": "Fertilizantes", "description": "High quality fertilizer", "price": 45.00, "stock": 100, "is_active": true, "is_featured": true, "image": null, "images": [{"id": 1, "url": "https://example.com/img1.jpg", "position": 0}, {"id": 2, "url": "https://example.com/img2.jpg", "position": 1}]}}
     * @response 404 scenario="Not Found" {"message": "No query results for model [App\\Models\\Product] 999"}
     */
    public function __invoke(Product $product): ProductDetailResource
    {
        abort_if(! $product->category?->is_active, 404);

        $product->load(['category', 'images']);

        return new ProductDetailResource($product);
    }
}
