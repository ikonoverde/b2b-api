<?php

namespace App\Http\Controllers\Web\Checkout;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowCheckoutShippingController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
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

        return Inertia::render('Checkout/Shipping', [
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
}
