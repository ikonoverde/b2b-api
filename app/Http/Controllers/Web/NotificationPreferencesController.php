<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationPreferencesController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Account/Notifications', [
            'preferences' => $user->only([
                'notify_order_updates',
                'notify_promotional_emails',
                'notify_newsletter',
            ]),
        ]);
    }
}
