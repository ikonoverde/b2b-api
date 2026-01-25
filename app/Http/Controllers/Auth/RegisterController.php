<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

/**
 * @group Authentication
 *
 * APIs for user authentication
 */
class RegisterController extends Controller
{
    /**
     * Register a new user
     *
     * Create a new user account and receive an API token.
     *
     * @unauthenticated
     * @response 201 scenario="Success" {"user": {"id": 1, "name": "John Doe", "email": "john@example.com", "rfc": "ABCD123456XYZ", "phone": "+521234567890"}, "token": "1|abc123def456..."}
     * @response 422 scenario="Validation error" {"message": "The email has already been taken.", "errors": {"email": ["The email has already been taken."]}}
     */
    public function __invoke(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->validated('name'),
            'rfc' => $request->validated('rfc'),
            'email' => $request->validated('email'),
            'phone' => $request->validated('phone'),
            'terms_accepted_at' => now(),
            'password' => $request->validated('password'),
        ]);

        $token = $user->createToken($request->validated('device_name'))->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }
}
