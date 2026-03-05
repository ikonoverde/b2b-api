<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $profile = [
            'orders_count' => $user->orders()->count(),
            'total_spent' => (float) $user->orders()->sum('total_amount'),
            'discount_percentage' => (float) $user->discount_percentage,
        ];

        return Inertia::render('Account', [
            'profile' => $profile,
        ]);
    }
}
