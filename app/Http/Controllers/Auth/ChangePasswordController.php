<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use Illuminate\Http\JsonResponse;

/**
 * @group Authentication
 *
 * APIs for user authentication
 */
class ChangePasswordController extends Controller
{
    /**
     * Change password
     *
     * Change the authenticated user's password. Invalidates all other API tokens.
     *
     * @authenticated
     *
     * @response 200 scenario="Success" {"message": "Password changed successfully."}
     * @response 422 scenario="Wrong current password" {
     *   "message": "The current password is incorrect.",
     *   "errors": {"current_password": ["The current password is incorrect."]}
     * }
     * @response 422 scenario="Validation error" {
     *   "message": "The password field is required.",
     *   "errors": {"password": ["The password field is required."]}
     * }
     */
    public function __invoke(ChangePasswordRequest $request): JsonResponse
    {
        $request->user()->update([
            'password' => $request->validated('password'),
        ]);

        $request->user()->tokens()
            ->where('id', '!=', $request->user()->currentAccessToken()->id)
            ->delete();

        return response()->json([
            'message' => 'Password changed successfully.',
        ]);
    }
}
