<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

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
     * Retrieve all orders for the authenticated user.
     *
     * @response 200 scenario="Success" {"data": [{"id": 1, "user_id": 1, "status": "pending", "payment_status": "completed", "total_amount": 150.00, "shipping_cost": 10.00, "shipping_address": {"street": "123 Main St", "city": "Springfield", "state": "IL", "zip": "62701", "country": "USA"}, "items": [{"id": 1, "product_id": 1, "product_name": "Fertilizante Premium", "quantity": 2, "unit_price": 45.00, "subtotal": 90.00, "image": "products/fertilizer.jpg"}], "created_at": "2024-01-15T10:30:00Z"}]}
     * @response 200 scenario="No orders" {"data": []}
     *
     * @authenticated
     */
    public function __invoke(): JsonResponse
    {
        $orders = Order::where('user_id', auth()->id())
            ->with(['items'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => OrderResource::collection($orders)->resolve(),
        ]);
    }
}
