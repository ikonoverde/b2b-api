<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

/**
 * @group Authentication
 *
 * APIs for user authentication
 */
class ResetPasswordController extends Controller
{
    /**
     * Reset password
     *
     * Reset the user's password using a valid reset token.
     * Invalidates all existing API tokens for the user upon success.
     *
     * @unauthenticated
     *
     * @response 200 scenario="Success" {"message": "Password has been reset successfully."}
     * @response 400 scenario="Invalid token" {
     *   "message": "The provided token is invalid."
     * }
     * @response 400 scenario="Expired token" {
     *   "message": "The password reset token has expired."
     * }
     * @response 422 scenario="Validation error" {
     *   "message": "The password field is required.",
     *   "errors": {"password": ["The password field is required."]}
     * }
     */
    public function __invoke(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                event(new PasswordReset($user));

                // Invalidate all existing tokens
                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Password has been reset successfully.',
            ]);
        }

        $message = match ($status) {
            Password::INVALID_TOKEN => 'The provided token is invalid.',
            Password::INVALID_USER => 'We could not find a user with that email address.',
        };

        return response()->json([
            'message' => $message,
        ], 400);
    }
}
