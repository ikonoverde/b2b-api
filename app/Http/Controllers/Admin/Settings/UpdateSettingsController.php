<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Settings\UpdateSettingsRequest;
use App\Models\AppSettings;
use Illuminate\Http\RedirectResponse;

class UpdateSettingsController extends Controller
{
    public function __invoke(UpdateSettingsRequest $request): RedirectResponse
    {
        AppSettings::current()->update($request->validated());

        return back()->with('success', 'Configuración actualizada exitosamente.');
    }
}
