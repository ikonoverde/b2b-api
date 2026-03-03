<?php

namespace App\Http\Controllers\NotificationPreferences;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UpdateNotificationPreferencesRequest;
use App\Http\Resources\NotificationPreferencesResource;

/**
 * @group Notification Preferences
 *
 * APIs for managing notification preferences
 */
class UpdateNotificationPreferencesController extends Controller
{
    /**
     * Update Notification Preferences
     *
     * Update the authenticated user's notification preferences. All fields are optional.
     *
     * @response 200 scenario="Success" {
     *   "data": {
     *     "notify_order_updates": true,
     *     "notify_promotional_emails": false,
     *     "notify_newsletter": true
     *   }
     * }
     * @response 422 scenario="Validation error" {
     *   "message": "The notify order updates field must be true or false.",
     *   "errors": {
     *     "notify_order_updates": [
     *       "The notify order updates field must be true or false."
     *     ]
     *   }
     * }
     *
     * @authenticated
     */
    public function __invoke(UpdateNotificationPreferencesRequest $request): NotificationPreferencesResource
    {
        $user = $request->user();
        $user->update($request->validated());

        return new NotificationPreferencesResource($user);
    }
}
