<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * @group Orders
 *
 * APIs for order management
 */
class GetOrderController extends Controller
{
    /**
     * Get Order
     *
     * Retrieve a specific order by ID for the authenticated user.
     *
     * @urlParam id required The ID of the order. Example: 1
     *
     * @response 200 scenario="Success" {"data": {"id": 1, "user_id": 1, "status": "pending", "payment_status": "completed", "total_amount": 150.00, "shipping_cost": 10.00, "shipping_address": {"street": "123 Main St", "city": "Springfield", "state": "IL", "zip": "62701", "country": "USA"}, "items": [{"id": 1, "product_id": 1, "product_name": "Fertilizante Premium", "quantity": 2, "unit_price": 45.00, "subtotal": 90.00, "image": "products/fertilizer.jpg"}], "created_at": "2024-01-15T10:30:00Z"}}
     * @response 404 scenario="Order not found" {"message": "Order not found"}
     * @response 403 scenario="Order belongs to different user" {"message": "Forbidden"}
     *
     * @authenticated
     */
    public function __invoke(Order $order): JsonResponse
    {
        if ($order->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Forbidden',
            ], Response::HTTP_FORBIDDEN);
        }

        $order->load(['items']);

        return response()->json([
            'data' => (new OrderResource($order))->resolve(),
        ]);
    }
}
