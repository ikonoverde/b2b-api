<?php

namespace App\Http\Controllers\Web\Products;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;

class DestroyProductController extends Controller
{
    public function __invoke(Product $product): RedirectResponse
    {
        $hasPendingOrders = $product->orderItems()
            ->whereHas('order', function ($query) {
                $query->whereIn('status', Order::PENDING_STATUSES);
            })
            ->exists();

        if ($hasPendingOrders) {
            return redirect()->route('admin.products')
                ->with('error', 'No se puede eliminar el producto porque tiene pedidos pendientes');
        }

        $product->delete();

        return redirect()->route('admin.products')->with('success', 'Producto archivado exitosamente');
    }
}
