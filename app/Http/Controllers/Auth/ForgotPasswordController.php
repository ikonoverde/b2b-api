<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;

/**
 * @group Authentication
 *
 * APIs for user authentication
 */
class ForgotPasswordController extends Controller
{
    /**
     * Forgot password
     *
     * Send a password reset link to the given email address.
     * Always returns 200 to prevent email enumeration attacks.
     *
     * @unauthenticated
     *
     * @response 200 scenario="Success" {"message": "If an account exists with that email, a reset link has been sent."}
     * @response 422 scenario="Validation error" {
     *   "message": "The email field is required.",
     *   "errors": {"email": ["The email field is required."]}
     * }
     */
    public function __invoke(ForgotPasswordRequest $request): JsonResponse
    {
        Password::sendResetLink(
            $request->only('email')
        );

        return response()->json([
            'message' => 'If an account exists with that email, a reset link has been sent.',
        ]);
    }
}
