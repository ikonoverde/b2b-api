<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Orders/Index');
    }

    public function show(Order $order): Response
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['items', 'statusHistories']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}
