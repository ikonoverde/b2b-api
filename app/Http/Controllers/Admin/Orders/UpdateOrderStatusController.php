<?php

namespace App\Http\Controllers\Admin\Orders;

use App\Http\Controllers\Admin\Orders\Concerns\BuildsOrderShowResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Orders\UpdateOrderStatusRequest;
use App\Models\Order;
use App\Notifications\Order\OrderStatusChanged;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class UpdateOrderStatusController extends Controller
{
    use BuildsOrderShowResponse;

    public function __invoke(UpdateOrderStatusRequest $request, Order $order): Response
    {
        $validated = $request->validated();
        $newStatus = $validated['status'];

        if (! $order->canTransitionTo($newStatus)) {
            $msg = "No se puede cambiar el estado de '{$order->status}' a '{$newStatus}'.";

            return $this->renderOrderShow($order, 'error', $msg);
        }

        $fromStatus = $order->status;

        DB::transaction(function () use ($order, $newStatus, $fromStatus, $request) {
            $order->update(['status' => $newStatus]);

            $order->statusHistories()->create([
                'admin_id' => $request->user()->id,
                'from_status' => $fromStatus,
                'to_status' => $newStatus,
            ]);
        });

        $order->user->notify(new OrderStatusChanged($order, $fromStatus));

        return $this->renderOrderShow($order, 'success', 'Estado del pedido actualizado exitosamente.');
    }
}
