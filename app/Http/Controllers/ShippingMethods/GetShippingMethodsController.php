<?php

namespace App\Http\Controllers\ShippingMethods;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShippingMethodResource;
use App\Models\ShippingMethod;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * @group Shipping Methods
 */
class GetShippingMethodsController extends Controller
{
    /**
     * List Shipping Methods
     *
     * Returns all active shipping methods sorted by cost (ascending).
     *
     * @response 200 scenario="Success" {
     *   "data": [
     *     {
     *       "id": 1, "name": "Standard",
     *       "description": "Standard shipping",
     *       "cost": 10.00, "estimated_delivery_days": 7
     *     },
     *     {
     *       "id": 2, "name": "Express",
     *       "description": "Express shipping",
     *       "cost": 25.00, "estimated_delivery_days": 3
     *     }
     *   ]
     * }
     *
     * @authenticated
     */
    public function __invoke(): AnonymousResourceCollection
    {
        $methods = ShippingMethod::query()
            ->where('is_active', true)
            ->orderBy('cost')
            ->get();

        return ShippingMethodResource::collection($methods);
    }
}
