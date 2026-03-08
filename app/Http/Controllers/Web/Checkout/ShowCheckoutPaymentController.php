<?php

namespace App\Http\Controllers\Web\Checkout;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Cashier;

class ShowCheckoutPaymentController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $order = Order::where('id', $request->query('order'))
            ->where('user_id', $request->user()->id)
            ->where('status', 'payment_pending')
            ->with('items')
            ->firstOrFail();

        $paymentIntent = Cashier::stripe()->paymentIntents->retrieve($order->payment_intent_id);

        return Inertia::render('Checkout/Payment', [
            'order' => [
                'id' => $order->id,
                'total_amount' => (float) $order->total_amount,
                'shipping_cost' => (float) $order->shipping_cost,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'subtotal' => (float) $item->subtotal,
                    'image' => $item->image,
                ]),
            ],
            'client_secret' => $paymentIntent->client_secret,
            'stripe_key' => config('cashier.key'),
        ]);
    }
}
