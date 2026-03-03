<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UpdateNotificationPreferencesRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class UpdateNotificationPreferencesController extends Controller
{
    public function __invoke(UpdateNotificationPreferencesRequest $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        $user->update($request->validated());

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Preferencias de notificación actualizadas exitosamente.']);
        }

        return redirect()->back()->with('success', 'Preferencias de notificación actualizadas exitosamente.');
    }
}
