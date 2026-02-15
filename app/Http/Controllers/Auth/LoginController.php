<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * @group Authentication
 *
 * APIs for user authentication
 */
class LoginController extends Controller
{
    /**
     * Login
     *
     * Authenticate a user and receive an API token.
     *
     * @unauthenticated
     *
     * @response 200 scenario="Success" {"user": {"id": 1, "name": "John Doe", "email": "john@example.com", "rfc": "ABCD123456XYZ", "phone": "+521234567890"}, "token": "1|abc123def456..."}
     * @response 422 scenario="Invalid credentials" {"message": "The provided credentials are incorrect.", "errors": {"email": ["The provided credentials are incorrect."]}}
     */
    public function __invoke(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if user is active
        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated. Please contact the administrator.'],
            ]);
        }

        $token = $user->createToken($request->validated('device_name'))->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }
}
