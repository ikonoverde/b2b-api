<?php

namespace App\Listeners;

use App\Events\PaymentCompleted;
use App\Notifications\Order\OrderConfirmation;

class SendOrderConfirmationNotification
{
    /**
     * Handle the event.
     */
    public function handle(PaymentCompleted $event): void
    {
        $event->order->user->notify(new OrderConfirmation($event->order));
    }
}
