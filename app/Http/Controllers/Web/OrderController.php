<?php

namespace App\Http\Controllers\Web;

use App\Actions\ReorderAction;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::query()
            ->where('user_id', auth()->id())
            ->with('items')
            ->orderByDesc('created_at')
            ->paginate(15)
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total_amount' => (float) $order->total_amount,
                'shipping_cost' => (float) $order->shipping_cost,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'subtotal' => (float) $item->subtotal,
                    'image' => $item->image ? Storage::disk('public')->url($item->image) : null,
                ]),
                'created_at' => $order->created_at?->toISOString(),
            ]);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['items.product', 'statusHistories']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    public function reorder(Order $order, ReorderAction $reorderAction): RedirectResponse
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $result = $reorderAction->execute($order);

        $messages = [];

        if (count($result['added']) > 0) {
            $messages[] = count($result['added']).' producto(s) agregado(s) al carrito';
        }

        if (count($result['unavailable']) > 0) {
            $messages[] = count($result['unavailable']).' producto(s) no disponible(s)';
        }

        if (count($result['price_changes']) > 0) {
            $messages[] = 'Precio actualizado en '.count($result['price_changes']).' producto(s)';
        }

        $message = implode('. ', $messages) ?: 'No se pudieron agregar productos al carrito';

        if (count($result['added']) > 0) {
            return redirect()->route('cart')->with('success', $message);
        }

        return back()->with('error', $message);
    }

    public function invoice(Order $order): HttpResponse
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['items', 'user']);

        $html = view('orders.invoice', [
            'order' => $order,
            'company' => [
                'name' => config('app.name'),
                'address' => 'Dirección de la empresa',
                'phone' => 'Teléfono de contacto',
                'email' => 'contacto@empresa.com',
            ],
        ])->render();

        return response($html)
            ->header('Content-Type', 'text/html')
            ->header('Content-Disposition', 'inline; filename="invoice-'.$order->id.'.html"');
    }
}
