<?php

namespace App\Notifications\Auth;

use Illuminate\Auth\Notifications\ResetPassword as BaseResetPassword;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Queues Laravel's password reset notification.
 *
 * The framework's notification sends inline, so a slow or failing mail provider
 * stalls the web request that triggered it.
 */
class ResetPassword extends BaseResetPassword implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [30, 120, 600];
}
