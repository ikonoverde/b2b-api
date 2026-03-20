<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Auth\GoogleCompleteRegistrationRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class StoreGoogleCompleteRegistrationController extends Controller
{
    public function __invoke(GoogleCompleteRegistrationRequest $request): RedirectResponse
    {
        $googleUser = session('google_user');

        if (! $googleUser) {
            return redirect()->route('login');
        }

        $user = User::create([
            'name' => $request->validated('name'),
            'rfc' => $request->validated('rfc'),
            'email' => $googleUser['email'],
            'google_id' => $googleUser['id'],
            'phone' => $request->validated('phone'),
            'terms_accepted_at' => now(),
        ]);

        session()->forget('google_user');

        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
