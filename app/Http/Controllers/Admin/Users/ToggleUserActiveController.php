<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Admin\Users\Concerns\BuildsUserShowResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Users\ToggleUserActiveRequest;
use App\Models\User;
use Inertia\Response;

class ToggleUserActiveController extends Controller
{
    use BuildsUserShowResponse;

    public function __invoke(ToggleUserActiveRequest $request, User $user): Response
    {
        $validated = $request->validated();

        $user->update(['is_active' => $validated['is_active']]);

        $statusMessage = $validated['is_active']
            ? 'Usuario activado exitosamente. El usuario podrá iniciar sesión nuevamente.'
            : 'Usuario desactivado exitosamente. El usuario ya no podrá iniciar sesión.';

        return $this->renderUserShow($user, flash: [
            'success' => $statusMessage,
        ]);
    }
}
