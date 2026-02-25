<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;

/**
 * @group User
 *
 * APIs for user profile management
 */
class UpdateUserController extends Controller
{
    /**
     * Update Current User
     *
     * Update the authenticated user's profile.
     *
     * @response 200 scenario="Success" {
     *   "data": {"id": 1, "name": "Juan Pérez", "email": "juan@example.com",
     *   "rfc": "ABCD123456XYZ", "phone": "+521234567890",
     *   "created_at": "2026-01-01T00:00:00.000000Z"}
     * }
     * @response 422 scenario="Validation Error" {
     *   "message": "The email has already been taken.",
     *   "errors": {"email": ["The email has already been taken."]}
     * }
     *
     * @authenticated
     */
    public function __invoke(UpdateUserRequest $request): UserResource
    {
        $user = $request->user();
        $user->update($request->validated());

        return new UserResource($user);
    }
}
