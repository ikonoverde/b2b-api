<?php

use App\Models\Order;
use App\Models\User;
use App\Notifications\Auth\ResetPassword;
use App\Notifications\Order\OrderStatusChanged;
use Illuminate\Notifications\SendQueuedNotifications;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Queue;

it('queues the password reset notification rather than sending it inline', function () {
    Queue::fake();

    $user = User::factory()->create();

    Password::sendResetLink(['email' => $user->email]);

    Queue::assertPushed(
        SendQueuedNotifications::class,
        fn (SendQueuedNotifications $job): bool => $job->notification instanceof ResetPassword,
    );
});

it('retries a queued password reset with backoff', function () {
    Queue::fake();

    $user = User::factory()->create();

    Password::sendResetLink(['email' => $user->email]);

    Queue::assertPushed(SendQueuedNotifications::class, function (SendQueuedNotifications $job): bool {
        expect($job->tries)->toBe(3)
            ->and($job->backoff())->toBe([30, 120, 600]);

        return true;
    });
});

it('retries a queued order status change with backoff', function () {
    Queue::fake();

    $order = Order::factory()->create();

    $order->user->notify(new OrderStatusChanged($order, 'processing'));

    Queue::assertPushed(SendQueuedNotifications::class, function (SendQueuedNotifications $job): bool {
        expect($job->notification)->toBeInstanceOf(OrderStatusChanged::class)
            ->and($job->tries)->toBe(3)
            ->and($job->backoff())->toBe([30, 120, 600]);

        return true;
    });
});
