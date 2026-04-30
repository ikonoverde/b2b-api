<?php

namespace App\Http\Controllers\Admin\Orders;

use App\Http\Controllers\Admin\Orders\Concerns\BuildsOrderShowResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Orders\CreateOrderRefundRequest;
use App\Models\Order;
use Inertia\Response;
use Laravel\Cashier\Cashier;

class CreateOrderRefundController extends Controller
{
    use BuildsOrderShowResponse;

    public function __invoke(CreateOrderRefundRequest $request, Order $order): Response
    {
        $validated = $request->validated();
        $amount = (float) $validated['amount'];

        $error = $this->validateRefundEligibility($order, $amount);
        if ($error) {
            return $this->renderOrderShow($order, 'error', $error);
        }

        $result = $this->processStripeRefund($request, $order, $amount, $validated);

        return $this->renderOrderShow($order, $result['type'], $result['message']);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array{type: string, message: string}
     */
    private function processStripeRefund(
        CreateOrderRefundRequest $request,
        Order $order,
        float $amount,
        array $validated,
    ): array {
        try {
            Cashier::stripe()->refunds->create([
                'payment_intent' => $order->payment_intent_id,
                'amount' => (int) round($amount * 100),
                'reason' => 'requested_by_customer',
            ]);
        } catch (\Exception $e) {
            $msg = 'Error al procesar el reembolso con Stripe: '.$e->getMessage();

            return ['type' => 'error', 'message' => $msg];
        }

        $newRefundedAmount = (float) $order->refunded_amount + $amount;
        $isFullyRefunded = $newRefundedAmount >= (float) $order->total_amount;

        $order->update([
            'refunded_amount' => $newRefundedAmount,
            'payment_status' => $isFullyRefunded ? 'refunded' : $order->payment_status,
        ]);

        $reason = $validated['reason'] ?? null;
        $note = $reason
            ? "Reembolso de \${$amount}: {$reason}"
            : "Reembolso de \${$amount}";

        $order->statusHistories()->create([
            'admin_id' => $request->user()->id,
            'from_status' => $order->status,
            'to_status' => $order->status,
            'note' => $note,
        ]);

        $message = $isFullyRefunded
            ? 'Reembolso total procesado exitosamente.'
            : "Reembolso parcial de \${$amount} procesado exitosamente.";

        return ['type' => 'success', 'message' => $message];
    }

    private function validateRefundEligibility(Order $order, float $amount): ?string
    {
        $remaining = (float) $order->total_amount - (float) $order->refunded_amount;

        return match (true) {
            ! $order->payment_intent_id => 'Este pedido no tiene un pago asociado para reembolsar.',
            $order->payment_status !== 'completed' => 'Solo se pueden reembolsar pedidos con pago completado.',
            $amount > $remaining => "El monto excede el saldo disponible para reembolso (\${$remaining}).",
            default => null,
        };
    }
}
