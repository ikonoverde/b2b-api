<?php

namespace App\Http\Controllers\Orders;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

/**
 * @group Orders
 *
 * APIs for order management
 */
class DownloadInvoiceController extends Controller
{
    /**
     * Download Invoice
     *
     * Download the invoice for a specific order as an HTML document that can be
     * printed or saved as PDF.
     *
     * @urlParam order required The ID of the order. Example: 1
     *
     * @response 200 scenario="Success" HTML invoice document
     * @response 404 scenario="Order not found" {"message": "Order not found"}
     * @response 403 scenario="Order belongs to different user" {"message": "Forbidden"}
     *
     * @authenticated
     */
    public function __invoke(Order $order): JsonResponse|Response
    {
        if ($order->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Forbidden',
            ], HttpResponse::HTTP_FORBIDDEN);
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
