<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Admin\Users\Concerns\BuildsUserShowResponse;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Response;

class SendUserPasswordResetController extends Controller
{
    use BuildsUserShowResponse;

    public function __invoke(Request $request, User $user): Response
    {
        Password::sendResetLink(['email' => $user->email]);

        return $this->renderUserShow($user, flash: [
            'success' => 'Se ha enviado un correo de restablecimiento de contraseña al usuario.',
        ]);
    }
}
