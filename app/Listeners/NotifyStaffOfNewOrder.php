<?php

namespace App\Listeners;

use App\Events\PaymentCompleted;
use App\Models\User;
use App\Notifications\Order\NewOrderReceived;
use Illuminate\Support\Facades\Notification;

class NotifyStaffOfNewOrder
{
    /**
     * Roles that should be notified when a new order is paid.
     *
     * @var list<string>
     */
    private const STAFF_ROLES = ['admin', 'super_admin'];

    /**
     * Handle the event.
     */
    public function handle(PaymentCompleted $event): void
    {
        $staff = User::query()
            ->whereIn('role', self::STAFF_ROLES)
            ->where('is_active', true)
            ->get();

        if ($staff->isEmpty()) {
            return;
        }

        Notification::send($staff, new NewOrderReceived($event->order));
    }
}
