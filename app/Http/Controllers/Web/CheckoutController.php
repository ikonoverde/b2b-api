<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\CheckoutRequest;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        $cart = Cart::where('user_id', $request->user()->id)
            ->where('status', 'active')
            ->first();

        if (! $cart || $cart->items()->count() === 0) {
            return redirect()->route('cart')->with('error', 'Tu carrito está vacío.');
        }

        $cart->load(['items.product.images']);

        $items = $cart->items->map(fn ($item) => [
            'id' => $item->id,
            'product_id' => $item->product_id,
            'name' => $item->product->name,
            'image' => $item->product->images->first()?->image_url,
            'price' => (float) $item->unit_price,
            'quantity' => $item->quantity,
            'subtotal' => $item->subtotal,
        ]);

        $subtotal = $items->sum('subtotal');
        $shipping = 99.00;

        return Inertia::render('Checkout', [
            'cart' => [
                'items' => $items,
                'totals' => [
                    'subtotal' => round($subtotal, 2),
                    'shipping' => $shipping,
                    'total' => round($subtotal + $shipping, 2),
                ],
            ],
        ]);
    }

    public function store(CheckoutRequest $request): RedirectResponse
    {
        $cart = Cart::where('user_id', $request->user()->id)
            ->where('status', 'active')
            ->first();

        if (! $cart || $cart->items()->count() === 0) {
            return redirect()->route('cart')
                ->with('error', 'Tu carrito está vacío.');
        }

        $cart->load('items.product');

        $subtotal = $cart->items->sum(fn ($item) => $item->subtotal);
        $shipping = 99.00;

        $order = DB::transaction(function () use ($request, $cart, $subtotal, $shipping) {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'payment_status' => 'pending',
                'total_amount' => round($subtotal + $shipping, 2),
                'shipping_cost' => $shipping,
                'shipping_address' => [
                    'name' => $request->validated('name'),
                    'address_line_1' => $request->validated('address_line_1'),
                    'address_line_2' => $request->validated('address_line_2'),
                    'city' => $request->validated('city'),
                    'state' => $request->validated('state'),
                    'postal_code' => $request->validated('postal_code'),
                    'phone' => $request->validated('phone'),
                ],
            ]);

            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->subtotal,
                    'image' => $item->product->images->first()?->image_url,
                ]);
            }

            $cart->items()->delete();
            $cart->update(['status' => 'completed']);

            return $order;
        });

        return redirect()->route('orders')->with('success', 'Pedido #'.$order->id.' creado exitosamente.');
    }
}
