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
     * Retrieve a single product with its pricing tiers.
     *
     * @response 200 scenario="Success" {"data": {"id": 1, "name": "Fertilizante Premium", "sku": "FER-001", "category": "Fertilizantes", "description": "High quality fertilizer", "price": 45.00, "stock": 100, "is_active": true, "is_featured": true, "image": null, "pricing_tiers": [{"id": 1, "min_qty": 10, "max_qty": 50, "price": 40.00, "discount": 11.11, "label": "Mayorista"}]}}
     * @response 404 scenario="Not Found" {"message": "No query results for model [App\\Models\\Product] 999"}
     */
    public function __invoke(Product $product): ProductDetailResource
    {
        $product->load('pricingTiers');

        return new ProductDetailResource($product);
    }
}
