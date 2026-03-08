<?php

namespace App\Http\Controllers\Web\Checkout;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowCheckoutThankYouController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $order = Order::where('id', $request->query('order'))
            ->where('user_id', $request->user()->id)
            ->with('items')
            ->firstOrFail();

        return Inertia::render('Checkout/ThankYou', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total_amount' => (float) $order->total_amount,
                'shipping_cost' => (float) $order->shipping_cost,
                'shipping_address' => $order->shipping_address,
                'created_at' => $order->created_at->toISOString(),
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'subtotal' => (float) $item->subtotal,
                    'image' => $item->image,
                ]),
            ],
        ]);
    }
}
