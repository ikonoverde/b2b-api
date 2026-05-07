<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\AppSettings;
use Inertia\Inertia;
use Inertia\Response;

class ShowSettingsController extends Controller
{
    public function __invoke(): Response
    {
        $settings = AppSettings::current();

        return Inertia::render('admin/settings/Index', [
            'settings' => $settings->only(['contact_email', 'contact_phone', 'contact_address']),
        ]);
    }
}
