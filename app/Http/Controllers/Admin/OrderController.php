<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Orders\CreateOrderRefundRequest;
use App\Http\Requests\Admin\Orders\StoreOrderNoteRequest;
use App\Http\Requests\Admin\Orders\UpdateOrderStatusRequest;
use App\Http\Requests\Admin\Orders\UpdateOrderTrackingRequest;
use App\Models\Order;
use App\Notifications\Order\OrderStatusChanged;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Cashier;

class OrderController extends Controller
{
    private const SHOW_VIEW = 'admin/orders/Show';

    public function index(Request $request): Response
    {
        $sortBy = $this->resolveSortField($request->get('sort_by', 'created_at'));
        $sortOrder = in_array($request->get('sort_order'), ['asc', 'desc'])
            ? $request->get('sort_order')
            : 'desc';
        $perPage = min((int) $request->get('per_page', 15), 100);

        $orders = Order::query()
            ->with('user')
            ->when($request->filled('status'), fn ($q) => $q
                ->where('status', $request->get('status')))
            ->when($request->filled('payment_status'), fn ($q) => $q
                ->where('payment_status', $request->get('payment_status')))
            ->when($request->filled('date_from'), fn ($q) => $q
                ->whereDate('created_at', '>=', $request->get('date_from')))
            ->when($request->filled('date_to'), fn ($q) => $q
                ->whereDate('created_at', '<=', $request->get('date_to')))
            ->when($request->filled('customer'), function ($q) use ($request) {
                $search = $request->get('customer');
                $q->whereHas('user', fn ($uq) => $uq
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%"));
            })
            ->when($request->filled('amount_min'), fn ($q) => $q
                ->where('total_amount', '>=', $request->get('amount_min')))
            ->when($request->filled('amount_max'), fn ($q) => $q
                ->where('total_amount', '<=', $request->get('amount_max')))
            ->orderBy($sortBy, $sortOrder)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/orders/Index', [
            'orders' => $orders,
            'filters' => $this->buildFilterState($request, $sortBy, $sortOrder),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load([
            'user',
            'items',
            'shippingMethod',
            'statusHistories.admin',
            'notes.admin',
        ]);

        return $this->renderShow($order);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): Response
    {
        $validated = $request->validated();
        $newStatus = $validated['status'];

        if (! $order->canTransitionTo($newStatus)) {
            $msg = "No se puede cambiar el estado de '{$order->status}' a '{$newStatus}'.";

            return $this->renderShowWithFlash($order, 'error', $msg);
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

        // Send status change notification to customer
        $order->user->notify(new OrderStatusChanged($order, $fromStatus));

        return $this->renderShowWithFlash($order, 'success', 'Estado del pedido actualizado exitosamente.');
    }

    public function updateTracking(UpdateOrderTrackingRequest $request, Order $order): Response
    {
        if ($order->status !== 'processing') {
            return $this->renderShowWithFlash(
                $order, 'error', 'Solo se puede agregar rastreo a pedidos en procesamiento.'
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

        // Send status change notification with tracking info
        $order->user->notify(new OrderStatusChanged(
            $order,
            $fromStatus,
            $validated['tracking_number'],
            $validated['shipping_carrier'],
            $validated['tracking_url'] ?? null
        ));

        return $this->renderShowWithFlash(
            $order, 'success', 'Información de rastreo actualizada y pedido marcado como enviado.'
        );
    }

    public function createRefund(CreateOrderRefundRequest $request, Order $order): Response
    {
        $validated = $request->validated();
        $amount = (float) $validated['amount'];

        $error = $this->validateRefundEligibility($order, $amount);
        if ($error) {
            return $this->renderShowWithFlash($order, 'error', $error);
        }

        $result = $this->processStripeRefund($request, $order, $amount, $validated);

        return $this->renderShowWithFlash($order, $result['type'], $result['message']);
    }

    public function storeNote(StoreOrderNoteRequest $request, Order $order): Response
    {
        $validated = $request->validated();

        $order->notes()->create([
            'admin_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        return $this->renderShowWithFlash($order, 'success', 'Nota agregada exitosamente.');
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array{type: string, message: string}
     */
    private function processStripeRefund(
        CreateOrderRefundRequest $request,
        Order $order,
        float $amount,
        array $validated
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

    private function resolveSortField(string $field): string
    {
        $allowedSortFields = ['created_at', 'status', 'total_amount', 'payment_status'];

        return in_array($field, $allowedSortFields) ? $field : 'created_at';
    }

    /**
     * @return array<string, string>
     */
    private function buildFilterState(Request $request, string $sortBy, string $sortOrder): array
    {
        return [
            'status' => $request->get('status', ''),
            'payment_status' => $request->get('payment_status', ''),
            'date_from' => $request->get('date_from', ''),
            'date_to' => $request->get('date_to', ''),
            'customer' => $request->get('customer', ''),
            'amount_min' => $request->get('amount_min', ''),
            'amount_max' => $request->get('amount_max', ''),
            'sort_by' => $sortBy,
            'sort_order' => $sortOrder,
        ];
    }

    private function renderShow(Order $order, ?string $flashType = null, ?string $flashMessage = null): Response
    {
        $data = ['order' => $this->formatOrder($order)];

        if ($flashType && $flashMessage) {
            $data['flash'] = [$flashType => $flashMessage];
        }

        return Inertia::render(self::SHOW_VIEW, $data);
    }

    private function renderShowWithFlash(Order $order, string $flashType, string $flashMessage): Response
    {
        $order->load(['user', 'items', 'shippingMethod', 'statusHistories.admin', 'notes.admin']);

        return $this->renderShow($order, $flashType, $flashMessage);
    }

    /**
     * @return array<string, mixed>
     */
    private function formatOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'payment_intent_id' => $order->payment_intent_id,
            'total_amount' => (float) $order->total_amount,
            'shipping_cost' => (float) $order->shipping_cost,
            'refunded_amount' => (float) $order->refunded_amount,
            'tracking_number' => $order->tracking_number,
            'shipping_carrier' => $order->shipping_carrier,
            'tracking_url' => $order->tracking_url,
            'shipping_address' => $order->shipping_address,
            'created_at' => $order->created_at->toIso8601String(),
            'updated_at' => $order->updated_at->toIso8601String(),
            'customer' => $order->user ? [
                'id' => $order->user->id,
                'name' => $order->user->name,
                'email' => $order->user->email,
            ] : null,
            'shipping_method' => $order->shippingMethod ? [
                'id' => $order->shippingMethod->id,
                'name' => $order->shippingMethod->name,
            ] : null,
            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'subtotal' => (float) $item->subtotal,
                'image' => $item->image,
            ])->toArray(),
            'status_histories' => $order->statusHistories
                ->sortByDesc('created_at')
                ->values()
                ->map(fn ($history) => [
                    'id' => $history->id,
                    'from_status' => $history->from_status,
                    'to_status' => $history->to_status,
                    'note' => $history->note,
                    'admin_name' => $history->admin?->name,
                    'created_at' => $history->created_at->toIso8601String(),
                ])->toArray(),
            'notes' => $order->notes
                ->sortByDesc('created_at')
                ->values()
                ->map(fn ($note) => [
                    'id' => $note->id,
                    'content' => $note->content,
                    'admin_name' => $note->admin?->name,
                    'created_at' => $note->created_at->toIso8601String(),
                ])->toArray(),
        ];
    }
}
