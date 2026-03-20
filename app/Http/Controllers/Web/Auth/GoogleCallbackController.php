<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;

class GoogleCallbackController extends Controller
{
    public function __invoke(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception) {
            return redirect()->route('login')->withErrors([
                'google' => 'No se pudo autenticar con Google. Intenta de nuevo.',
            ]);
        }

        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if ($user) {
            return $this->loginExistingUser($user, $googleUser);
        }

        session([
            'google_user' => [
                'id' => $googleUser->getId(),
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
            ],
        ]);

        return redirect()->route('google.complete-registration');
    }

    private function loginExistingUser(User $user, SocialiteUser $googleUser): RedirectResponse
    {
        if (! $user->is_active) {
            return redirect()->route('login')->withErrors([
                'google' => 'Tu cuenta ha sido desactivada. Por favor, contacta al administrador.',
            ]);
        }

        if (! $user->google_id) {
            $user->update(['google_id' => $googleUser->getId()]);
        }

        Auth::login($user, remember: true);

        return redirect()->intended(route('dashboard'));
    }
}
