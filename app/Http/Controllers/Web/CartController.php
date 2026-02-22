<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $cart = $this->getOrCreateCart($request);
        $cart->load(['items.product.images']);

        $items = $cart->items->map(fn (CartItem $item) => [
            'id' => $item->id,
            'product_id' => $item->product_id,
            'name' => $item->product->name,
            'image' => $item->product->images->first()?->image_url,
            'price' => (float) $item->unit_price,
            'quantity' => $item->quantity,
            'subtotal' => $item->subtotal,
        ]);

        $subtotal = $items->sum('subtotal');
        $shipping = $subtotal > 0 ? 99.00 : 0;

        return Inertia::render('Cart', [
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

    public function addItem(Request $request): RedirectResponse
    {
        $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($request->input('product_id'));
        $cart = $this->getOrCreateCart($request);

        $existingItem = $cart->items()->where('product_id', $product->id)->first();

        if ($existingItem) {
            $existingItem->update([
                'quantity' => $existingItem->quantity + $request->input('quantity'),
            ]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->input('quantity'),
                'unit_price' => $product->price,
            ]);
        }

        return back()->with('success', 'Producto agregado al carrito.');
    }

    public function updateItem(Request $request, CartItem $cartItem): RedirectResponse
    {
        $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = $this->getOrCreateCart($request);

        if ($cartItem->cart_id !== $cart->id) {
            abort(403);
        }

        $cartItem->update([
            'quantity' => $request->input('quantity'),
        ]);

        return back()->with('success', 'Cantidad actualizada.');
    }

    public function removeItem(Request $request, CartItem $cartItem): RedirectResponse
    {
        $cart = $this->getOrCreateCart($request);

        if ($cartItem->cart_id !== $cart->id) {
            abort(403);
        }

        $cartItem->delete();

        return back()->with('success', 'Producto eliminado del carrito.');
    }

    public function clear(Request $request): RedirectResponse
    {
        $cart = $this->getOrCreateCart($request);
        $cart->items()->delete();

        return back()->with('success', 'Carrito vaciado.');
    }

    private function getOrCreateCart(Request $request): Cart
    {
        return Cart::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['status' => 'active'],
        );
    }
}
