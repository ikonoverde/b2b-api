<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    private const ADMIN_PATH_PATTERN = 'admin/*';

    public function create(): Response
    {
        $isAdmin = request()->is(self::ADMIN_PATH_PATTERN);

        return Inertia::render('Auth/Login', [
            'postUrl' => $isAdmin ? '/admin/login' : '/login',
            'registerUrl' => $isAdmin ? null : '/register',
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember');

        if (! Auth::attempt($credentials, $remember)) {
            return back()
                ->withInput($request->only('email', 'remember'))
                ->withErrors(['email' => 'The provided credentials are incorrect.']);
        }

        // Check if user is active
        $user = Auth::user();
        if (! $user->is_active) {
            Auth::logout();

            return back()
                ->withInput($request->only('email', 'remember'))
                ->withErrors(['email' => 'Tu cuenta ha sido desactivada. Por favor, contacta al administrador.']);
        }

        $request->session()->regenerate();

        $isAdmin = $request->is(self::ADMIN_PATH_PATTERN);

        if ($isAdmin) {
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->intended(route('dashboard'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        $isAdmin = $request->is(self::ADMIN_PATH_PATTERN);

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($isAdmin) {
            return redirect()->route('admin.login');
        }

        return redirect()->route('login');
    }
}
