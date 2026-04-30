<?php

namespace App\Http\Controllers\Admin\Orders;

use App\Http\Controllers\Admin\Orders\Concerns\BuildsOrderShowResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Orders\UpdateOrderTrackingRequest;
use App\Models\Order;
use App\Notifications\Order\OrderStatusChanged;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class UpdateOrderTrackingController extends Controller
{
    use BuildsOrderShowResponse;

    public function __invoke(UpdateOrderTrackingRequest $request, Order $order): Response
    {
        if ($order->status !== 'processing') {
            return $this->renderOrderShow(
                $order,
                'error',
                'Solo se puede agregar rastreo a pedidos en procesamiento.'
            );
        }

        $validated = $request->validated();
        $fromStatus = $order->status;

        DB::transaction(function () use ($order, $validated, $fromStatus, $request) {
            $order->update([
                'tracking_number' => $validated['tracking_number'],
                'shipping_carrier' => $validated['shipping_carrier'],
                'tracking_url' => $validated['tracking_url'] ?? null,
                'status' => 'shipped',
            ]);

            $order->statusHistories()->create([
                'admin_id' => $request->user()->id,
                'from_status' => $fromStatus,
                'to_status' => 'shipped',
                'note' => "Rastreo: {$validated['shipping_carrier']} - {$validated['tracking_number']}",
            ]);
        });

        $order->user->notify(new OrderStatusChanged(
            $order,
            $fromStatus,
            $validated['tracking_number'],
            $validated['shipping_carrier'],
            $validated['tracking_url'] ?? null
        ));

        return $this->renderOrderShow(
            $order,
            'success',
            'Información de rastreo actualizada y pedido marcado como enviado.'
        );
    }
}
