<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UpdateUserRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class UpdateProfileController extends Controller
{
    public function __invoke(UpdateUserRequest $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        $user->update($request->validated());

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Perfil actualizado exitosamente.']);
        }

        return redirect()->back()->with('success', 'Perfil actualizado exitosamente.');
    }
}
