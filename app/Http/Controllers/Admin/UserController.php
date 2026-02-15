<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
}
