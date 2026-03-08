<?php

namespace App\Http\Controllers\Web\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\CheckoutRequest;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Laravel\Cashier\Cashier;

class StoreCheckoutShippingController extends Controller
{
    public function __invoke(CheckoutRequest $request): RedirectResponse
    {
        $cart = Cart::with(['items.product.images' => fn ($query) => $query->orderBy('position')->limit(1)])
            ->where('user_id', $request->user()->id)
            ->where('status', 'active')
            ->first();

        if (! $cart || $cart->items->isEmpty()) {
            return redirect()->route('cart')->with('error', 'Tu carrito está vacío.');
        }

        $stockErrors = $this->validateStock($cart);

        if (! empty($stockErrors)) {
            return back()->withErrors(['stock' => $stockErrors]);
        }

        $subtotal = $cart->items->sum(fn ($item) => $item->subtotal);
        $shipping = 99.00;
        $totalAmount = round($subtotal + $shipping, 2);

        $order = DB::transaction(function () use ($request, $cart, $totalAmount, $shipping) {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'payment_pending',
                'payment_status' => 'pending',
                'total_amount' => $totalAmount,
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

            return $order;
        });

        $paymentIntent = Cashier::stripe()->paymentIntents->create([
            'amount' => (int) ($totalAmount * 100),
            'currency' => 'mxn',
            'metadata' => [
                'order_id' => $order->id,
                'user_id' => $request->user()->id,
            ],
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        $order->update(['payment_intent_id' => $paymentIntent->id]);

        return redirect()->route('checkout.payment', ['order' => $order->id]);
    }

    /**
     * @return array<int, string>
     */
    private function validateStock(Cart $cart): array
    {
        $errors = [];

        foreach ($cart->items as $item) {
            if ($item->product->stock < $item->quantity) {
                $stock = $item->product->stock;
                $qty = $item->quantity;
                $errors[] = "{$item->product->name}: solo {$stock} unidades disponibles (solicitaste {$qty}).";
            }
        }

        return $errors;
    }
}
