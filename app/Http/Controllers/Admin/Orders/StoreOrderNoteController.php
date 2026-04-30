<?php

namespace App\Http\Controllers\Admin\Orders;

use App\Http\Controllers\Admin\Orders\Concerns\BuildsOrderShowResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Orders\StoreOrderNoteRequest;
use App\Models\Order;
use Inertia\Response;

class StoreOrderNoteController extends Controller
{
    use BuildsOrderShowResponse;

    public function __invoke(StoreOrderNoteRequest $request, Order $order): Response
    {
        $validated = $request->validated();

        $order->notes()->create([
            'admin_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        return $this->renderOrderShow($order, 'success', 'Nota agregada exitosamente.');
    }
}
