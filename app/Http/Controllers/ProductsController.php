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
     * Retrieve a paginated list of products with optional filtering and sorting.
     *
     * @queryParam page integer The page number. Example: 1
     * @queryParam per_page integer Items per page (1-100, default 15). Example: 15
     * @queryParam category_id integer[] Filter by category ID(s). Example: [1]
     * @queryParam price_min number Minimum price filter. Example: 10.00
     * @queryParam price_max number Maximum price filter. Example: 100.00
     * @queryParam search string Search keyword (matches name, description, SKU). Example: fertilizer
     * @queryParam sort string Sort order: price_asc, price_desc, name_asc, name_desc, newest, oldest. Example: newest
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

        $priceMin = $request->validated('price_min');
        $priceMax = $request->validated('price_max');

        $products = Product::query()
            ->with(['category', 'images' => fn ($query) => $query->orderBy('position')->limit(1)])
            ->whereHas('category', fn ($q) => $q->where('is_active', true))
            ->when($request->validated('category_id'), fn ($q, $ids) => $q->filterByCategory($ids))
            ->when($priceMin !== null || $priceMax !== null, fn ($q) => $q->filterByPriceRange(
                $priceMin !== null ? (float) $priceMin : null,
                $priceMax !== null ? (float) $priceMax : null,
            ))
            ->when($request->validated('search'), fn ($q, $term) => $q->search($term))
            ->when($request->validated('sort'), fn ($q, $sort) => $q->sortBy($sort))
            ->paginate($perPage);

        return ProductResource::collection($products);
    }
}
