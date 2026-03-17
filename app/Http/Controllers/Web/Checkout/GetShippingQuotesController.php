<?php

namespace App\Http\Controllers\Web\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\ShippingQuotesRequest;
use App\Models\Cart;
use App\Services\ShippingQuoteService;
use Illuminate\Http\JsonResponse;

class GetShippingQuotesController extends Controller
{
    public function __invoke(ShippingQuotesRequest $request, ShippingQuoteService $quoteService): JsonResponse
    {
        $cart = Cart::with(['items.product'])
            ->where('user_id', $request->user()->id)
            ->where('status', 'active')
            ->first();

        if (! $cart || $cart->items->isEmpty()) {
            return response()->json(['error' => 'Tu carrito está vacío.'], 422);
        }

        $result = $quoteService->getQuotes(
            $request->safe()->only(['postal_code', 'city', 'state', 'neighborhood']),
            $cart->items,
        );

        return response()->json($result);
    }
}
