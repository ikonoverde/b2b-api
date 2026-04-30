<?php

namespace App\Http\Controllers\Admin\Orders;

use App\Http\Controllers\Admin\Orders\Concerns\BuildsOrderShowResponse;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Response;

class ShowOrderController extends Controller
{
    use BuildsOrderShowResponse;

    public function __invoke(Order $order): Response
    {
        return $this->renderOrderShow($order);
    }
}
