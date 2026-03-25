<?php

namespace App\Http\Controllers\Web\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\CheckoutRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Services\ShippingQuoteService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Laravel\Cashier\Cashier;

class StoreCheckoutShippingController extends Controller
{
    public function __invoke(CheckoutRequest $request, ShippingQuoteService $quoteService): RedirectResponse
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

        $shippingData = $this->resolveShipping($request, $quoteService, $cart);
        $subtotal = $cart->items->sum(fn ($item) => $item->subtotal);
        $totalAmount = round($subtotal + $shippingData['cost'], 2);

        $order = DB::transaction(function () use ($request, $cart, $totalAmount, $shippingData) {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'payment_pending',
                'payment_status' => 'pending',
                'total_amount' => $totalAmount,
                'shipping_cost' => $shippingData['cost'],
                'shipping_carrier' => $shippingData['carrier'],
                'shipping_method_id' => $shippingData['shipping_method_id'],
                'shipping_quote_source' => $shippingData['source'],
                'parcel_dimensions' => $shippingData['parcel'],
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
     * Re-validate the selected shipping quote server-side.
     *
     * @return array{cost: float, carrier: string, shipping_method_id: int|null, source: string, parcel: array{weight: float, height: float, width: float, length: float}}
     */
    private function resolveShipping(CheckoutRequest $request, ShippingQuoteService $quoteService, Cart $cart): array
    {
        $result = $quoteService->getQuotes(
            [
                'postal_code' => $request->validated('postal_code'),
                'city' => $request->validated('city'),
                'state' => $request->validated('state'),
                'neighborhood' => $request->validated('address_line_2'),
            ],
            $cart->items,
        );

        $submittedQuoteId = $request->validated('shipping_quote_id');

        $matchedQuote = collect($result['quotes'])
            ->firstWhere('quote_id', $submittedQuoteId);

        if (! $matchedQuote) {
            $matchedQuote = collect($result['quotes'])->first();
        }

        if (! $matchedQuote) {
            return [
                'cost' => (float) config('shop.shipping_cost'),
                'carrier' => 'Envío estándar',
                'shipping_method_id' => null,
                'source' => 'static',
                'parcel' => $result['parcel'],
            ];
        }

        return [
            'cost' => (float) $matchedQuote['price'],
            'carrier' => $matchedQuote['carrier'].' - '.$matchedQuote['service'],
            'shipping_method_id' => $matchedQuote['shipping_method_id'] ?? null,
            'source' => $result['source'],
            'parcel' => $result['parcel'],
        ];
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
