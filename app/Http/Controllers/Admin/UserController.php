<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Users\UpdateUserRoleRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $perPage = min((int) $request->get('per_page', 15), 100);

        $allowedSortFields = ['name', 'email', 'role', 'created_at'];
        if (! in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'created_at';
        }

        if (! in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }

        $users = User::query()
            ->orderBy($sortBy, $sortOrder)
            ->paginate($perPage);

        return Inertia::render('admin/users/Index', [
            'users' => $users,
        ]);
    }

    public function show(Request $request, User $user): Response
    {
        $perPage = min((int) $request->get('per_page', 15), 100);

        $orders = $user->orders()
            ->with('items')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $totalOrders = $user->orders()->count();
        $totalSpent = $user->orders()->sum('total_amount');
        $lastOrder = $user->orders()->latest('created_at')->first();
        $accountAge = $user->created_at->diffInDays(now());

        return Inertia::render('admin/users/Show', [
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
                'total_orders' => $totalOrders,
                'total_spent' => (float) $totalSpent,
                'last_order_date' => $lastOrder?->created_at->toIso8601String(),
                'account_age_days' => $accountAge,
            ],
        ]);
    }

    public function updateRole(UpdateUserRoleRequest $request, User $user): Response
    {
        $validated = $request->validated();

        $user->update(['role' => $validated['role']]);

        return Inertia::render('admin/users/Show', [
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
            'orders' => $user->orders()
                ->with('items')
                ->orderBy('created_at', 'desc')
                ->paginate(15),
            'activity' => [
                'total_orders' => $user->orders()->count(),
                'total_spent' => (float) $user->orders()->sum('total_amount'),
                'last_order_date' => $user->orders()->latest('created_at')->first()?->created_at->toIso8601String(),
                'account_age_days' => $user->created_at->diffInDays(now()),
            ],
            'flash' => [
                'success' => 'Rol actualizado exitosamente. El cambio de permisos tomará efecto en el próximo inicio de sesión.',
            ],
        ]);
    }
}
