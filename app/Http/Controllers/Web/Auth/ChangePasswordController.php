<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use Illuminate\Http\RedirectResponse;

class ChangePasswordController extends Controller
{
    public function __invoke(ChangePasswordRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->update([
            'password' => $request->validated('password'),
        ]);

        $user->tokens()->delete();

        return redirect()->back()->with('success', 'Contraseña cambiada exitosamente.');
    }
}
