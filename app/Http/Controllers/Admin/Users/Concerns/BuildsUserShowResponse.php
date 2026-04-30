<?php

namespace App\Http\Controllers\Admin\Users\Concerns;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

trait BuildsUserShowResponse
{
    /**
     * @param  array<string, mixed>  $flash
     */
    protected function renderUserShow(User $user, int $perPage = 15, array $flash = []): Response
    {
        $orders = $user->orders()
            ->with('items')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $lastOrder = $user->orders()->latest('created_at')->first();

        $payload = [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'rfc' => $user->rfc,
                'phone' => $user->phone,
                'role' => $user->role,
                'is_active' => $user->is_active,
                'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                'created_at' => $user->created_at->toIso8601String(),
                'updated_at' => $user->updated_at->toIso8601String(),
                'pm_type' => $user->pm_type,
                'pm_last_four' => $user->pm_last_four,
            ],
            'orders' => $orders,
            'activity' => [
                'total_orders' => $user->orders()->count(),
                'total_spent' => (float) $user->orders()->sum('total_amount'),
                'last_order_date' => $lastOrder?->created_at->toIso8601String(),
                'account_age_days' => $user->created_at->diffInDays(now()),
            ],
        ];

        if ($flash !== []) {
            $payload['flash'] = $flash;
        }

        return Inertia::render('admin/users/Show', $payload);
    }
}
