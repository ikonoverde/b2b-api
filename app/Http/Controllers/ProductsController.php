<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * @group Products
 *
 * APIs for product management
 */
class ProductsController extends Controller
{
    /**
     * Get All Products
     *
     * Retrieve all products.
     *
     * @response 200 scenario="Success" {"data": [{"id": 1, "name": "Fertilizante Premium", "sku": "FER-001", "category": "Fertilizantes", "description": "High quality fertilizer", "price": 45.00, "stock": 100, "is_active": true, "is_featured": true, "image": null}]}
     */
    public function __invoke(): AnonymousResourceCollection
    {
        $products = Product::query()->get();

        return ProductResource::collection($products);
    }
}
