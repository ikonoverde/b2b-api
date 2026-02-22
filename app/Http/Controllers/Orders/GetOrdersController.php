<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * @group Orders
 *
 * APIs for order management
 */
class GetOrdersController extends Controller
{
    /**
     * Get Orders
     *
     * Retrieve paginated orders for the authenticated user.
     *
     * @queryParam page integer The page number. Example: 1
     * @queryParam per_page integer Items per page (max 100). Example: 15
     *
     * @response 200 scenario="Success" {"data": [{"id": 1, "user_id": 1, "status": "pending", "payment_status": "completed", "total_amount": 150.00, "shipping_cost": 10.00, "shipping_address": {"street": "123 Main St", "city": "Springfield", "state": "IL", "zip": "62701", "country": "USA"}, "items": [{"id": 1, "product_id": 1, "product_name": "Fertilizante Premium", "quantity": 2, "unit_price": 45.00, "subtotal": 90.00, "image": "products/fertilizer.jpg"}], "created_at": "2024-01-15T10:30:00Z"}], "links": {"first": "/api/orders?page=1", "last": "/api/orders?page=5", "prev": null, "next": "/api/orders?page=2"}, "meta": {"current_page": 1, "last_page": 5, "per_page": 15, "total": 73}}
     * @response 200 scenario="No orders" {"data": [], "links": {"first": "/api/orders?page=1", "last": "/api/orders?page=1", "prev": null, "next": null}, "meta": {"current_page": 1, "last_page": 1, "per_page": 15, "total": 0}}
     *
     * @authenticated
     */
    public function __invoke(Request $request): AnonymousResourceCollection
    {
        $perPage = min((int) $request->get('per_page', 15), 100);

        $orders = Order::where('user_id', auth()->id())
            ->with(['items'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return OrderResource::collection($orders);
    }
}
