<?php

namespace App\Http\Controllers\NotificationPreferences;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationPreferencesResource;
use Illuminate\Http\Request;

/**
 * @group Notification Preferences
 *
 * APIs for managing notification preferences
 */
class GetNotificationPreferencesController extends Controller
{
    /**
     * Get Notification Preferences
     *
     * Retrieve the authenticated user's notification preferences.
     *
     * @response 200 scenario="Success" {
     *   "data": {
     *     "notify_order_updates": true,
     *     "notify_promotional_emails": false,
     *     "notify_newsletter": false
     *   }
     * }
     * @response 401 scenario="Unauthenticated" {"message": "Unauthenticated."}
     *
     * @authenticated
     */
    public function __invoke(Request $request): NotificationPreferencesResource
    {
        return new NotificationPreferencesResource($request->user());
    }
}
