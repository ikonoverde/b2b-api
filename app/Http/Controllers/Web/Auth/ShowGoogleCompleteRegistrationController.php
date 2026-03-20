<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ShowGoogleCompleteRegistrationController extends Controller
{
    public function __invoke(): Response|RedirectResponse
    {
        $googleUser = session('google_user');

        if (! $googleUser) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/GoogleCompleteRegistration', [
            'googleName' => $googleUser['name'],
            'googleEmail' => $googleUser['email'],
        ]);
    }
}
