<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Auth\ResetPasswordRequest;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class ResetPasswordController extends Controller
{
    public function __invoke(ResetPasswordRequest $request): RedirectResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                event(new PasswordReset($user));

                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return redirect()->route('login')
                ->with('success', 'Tu contraseña ha sido restablecida. Ya puedes iniciar sesión.');
        }

        $message = match ($status) {
            Password::INVALID_TOKEN => 'El token es inválido o ha expirado.',
            Password::INVALID_USER => 'No pudimos encontrar un usuario con ese email.',
            default => 'No se pudo restablecer la contraseña.',
        };

        return back()->withErrors(['email' => $message]);
    }
}
