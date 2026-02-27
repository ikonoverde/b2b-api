<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Authentication
 *
 * APIs for user authentication
 */
class RefreshTokenController extends Controller
{
    /**
     * Refresh Token
     *
     * Issue a new API token and invalidate the current one.
     *
     * @authenticated
     *
     * @response 200 scenario="Success" {"user": {"id": 1, "name": "John Doe", "email": "john@example.com", "rfc": "ABCD123456XYZ", "phone": "+521234567890", "created_at": "2024-01-01T00:00:00.000000Z"}, "token": "2|xyz789abc012..."}
     * @response 401 scenario="Unauthenticated" {"message": "Unauthenticated."}
     */
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        // Delete the current token
        $request->user()->currentAccessToken()->delete();

        // Create a new token
        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }
}
