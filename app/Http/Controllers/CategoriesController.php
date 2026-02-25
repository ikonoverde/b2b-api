<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * @group Categories
 *
 * APIs for product categories
 */
class CategoriesController extends Controller
{
    /**
     * Get All Categories
     *
     * Retrieve all active categories.
     *
     * @response 200 scenario="Success" {"data": [
     *   {"id": 1, "name": "Fertilizantes", "slug": "fertilizantes",
     *    "description": null, "is_active": true}
     * ]}
     */
    public function __invoke(): AnonymousResourceCollection
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return CategoryResource::collection($categories);
    }
}
