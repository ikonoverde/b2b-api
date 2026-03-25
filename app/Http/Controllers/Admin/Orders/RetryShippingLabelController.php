<?php

namespace App\Http\Controllers\Admin\Orders;

use App\Http\Controllers\Controller;
use App\Jobs\CreateShippingLabel;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;

class RetryShippingLabelController extends Controller
{
    public function __invoke(Order $order): RedirectResponse
    {
        if ($order->status !== 'processing') {
            return back()->with('error', 'Solo se puede reintentar para pedidos en procesamiento.');
        }

        if (! $order->isSkydropxShipment()) {
            return back()->with('error', 'Este pedido no usa envío de Skydropx.');
        }

        if ($order->hasShippingLabel()) {
            return back()->with('error', 'Este pedido ya tiene una guía generada.');
        }

        CreateShippingLabel::dispatch($order);

        return back()->with('success', 'Se ha programado la generación de la guía de envío.');
    }
}
