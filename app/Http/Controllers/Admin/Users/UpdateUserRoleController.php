<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Admin\Users\Concerns\BuildsUserShowResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Users\UpdateUserRoleRequest;
use App\Models\User;
use Inertia\Response;

class UpdateUserRoleController extends Controller
{
    use BuildsUserShowResponse;

    public function __invoke(UpdateUserRoleRequest $request, User $user): Response
    {
        $validated = $request->validated();

        $user->update(['role' => $validated['role']]);

        $message = 'Rol actualizado exitosamente. El cambio de permisos tomará efecto en el próximo inicio de sesión.';

        return $this->renderUserShow($user, flash: [
            'success' => $message,
        ]);
    }
}
