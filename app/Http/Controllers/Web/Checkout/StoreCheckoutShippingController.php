<?php

namespace App\Http\Controllers\Web\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\CheckoutRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Services\ShippingQuoteService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Laravel\Cashier\Cashier;
use Stripe\Exception\ApiErrorException;

class StoreCheckoutShippingController extends Controller
{
    /**
     * @throws \Throwable
     * @throws ApiErrorException
     * @throws ConnectionException
     */
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
                'shipping_quote_id' => $shippingData['quote_id'],
                'shipping_rate_id' => $shippingData['rate_id'],
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
     * @return array{cost: float, carrier: string, quote_id: string|null,
     *               rate_id: string|null, source: string, parcel: array}
     *
     * @throws ConnectionException
     */
    private function resolveShipping(CheckoutRequest $request, ShippingQuoteService $quoteService, Cart $cart): array
    {
        $submittedQuoteId = $request->validated('quote_id');
        $rateId = $request->validated('rate_id');

        $quote = $quoteService->getQuote($submittedQuoteId);

        if (! $quote) {
            return [
                'cost' => (float) config('shop.shipping_cost'),
                'carrier' => 'Envío estándar',
                'quote_id' => null,
                'rate_id' => null,
                'source' => 'static',
                'parcel' => [],
            ];
        }

        $rate = collect($quote['rates'])->firstWhere('id', $rateId);

        if (! $rate || empty($quote['packages'])) {
            return [
                'cost' => (float) config('shop.shipping_cost'),
                'carrier' => 'Envío estándar',
                'quote_id' => null,
                'rate_id' => null,
                'source' => 'static',
                'parcel' => [],
            ];
        }

        $package = $quote['packages'][0];

        return [
            'cost' => (float) $rate['total'],
            'carrier' => $rate['provider_display_name'].' - '.$rate['provider_service_name'],
            'quote_id' => $submittedQuoteId,
            'rate_id' => $rate['id'],
            'source' => 'skydropx',
            'parcel' => [
                'width' => $package['width'],
                'height' => $package['height'],
                'length' => $package['length'],
                'weight' => $package['weight'],
            ],
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
