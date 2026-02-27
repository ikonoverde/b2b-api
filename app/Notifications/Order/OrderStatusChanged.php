<?php

namespace App\Notifications\Order;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Order $order,
        public string $previousStatus,
        public ?string $trackingNumber = null,
        public ?string $shippingCarrier = null,
        public ?string $trackingUrl = null
    ) {
        $this->order->load(['items', 'shippingMethod', 'user']);
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $statusLabels = [
            'payment_pending' => 'Pago Pendiente',
            'pending' => 'Pendiente',
            'processing' => 'En Procesamiento',
            'shipped' => 'Enviado',
            'delivered' => 'Entregado',
            'cancelled' => 'Cancelado',
        ];

        $newStatus = $statusLabels[$this->order->status] ?? $this->order->status;
        $oldStatus = $statusLabels[$this->previousStatus] ?? $this->previousStatus;

        return (new MailMessage)
            ->subject('Actualización de Estado - Pedido #'.$this->order->id)
            ->markdown('emails.orders.status-changed', [
                'order' => $this->order,
                'user' => $notifiable,
                'newStatus' => $newStatus,
                'oldStatus' => $oldStatus,
                'trackingNumber' => $this->trackingNumber,
                'shippingCarrier' => $this->shippingCarrier,
                'trackingUrl' => $this->trackingUrl,
            ]);
    }
}
