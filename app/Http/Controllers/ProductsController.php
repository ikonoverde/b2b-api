<?php

namespace App\Http\Controllers;

use App\Http\Requests\Products\ListProductsRequest;
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
     * Retrieve a paginated list of products.
     *
     * @queryParam page integer The page number. Example: 1
     * @queryParam per_page integer Items per page (1-100, default 15). Example: 15
     *
     * @response 200 scenario="Success" {
     *   "data": [
     *     {
     *       "id": 1,
     *       "name": "Fertilizante Premium",
     *       "sku": "FER-001",
     *       "category": "Fertilizantes",
     *       "description": "High quality fertilizer",
     *       "price": 45.00,
     *       "stock": 100,
     *       "is_active": true,
     *       "is_featured": true,
     *       "image": null
     *     }
     *   ],
     *   "links": {
     *     "first": "/api/products?page=1",
     *     "last": "/api/products?page=5",
     *     "prev": null,
     *     "next": "/api/products?page=2"
     *   },
     *   "meta": {
     *     "current_page": 1,
     *     "last_page": 5,
     *     "per_page": 15,
     *     "total": 73
     *   }
     * }
     */
    public function __invoke(ListProductsRequest $request): AnonymousResourceCollection
    {
        $perPage = (int) $request->validated('per_page', 15);

        $products = Product::query()
            ->with(['category', 'images' => fn ($query) => $query->orderBy('position')->limit(1)])
            ->paginate($perPage);

        return ProductResource::collection($products);
    }
}
