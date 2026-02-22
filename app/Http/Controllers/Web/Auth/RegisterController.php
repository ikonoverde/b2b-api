<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(RegisterRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->validated('name'),
            'rfc' => $request->validated('rfc'),
            'email' => $request->validated('email'),
            'phone' => $request->validated('phone'),
            'terms_accepted_at' => now(),
            'password' => $request->validated('password'),
        ]);

        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
