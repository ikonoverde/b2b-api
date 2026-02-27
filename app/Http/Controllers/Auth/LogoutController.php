<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Authentication
 *
 * APIs for user authentication
 */
class LogoutController extends Controller
{
    /**
     * Logout
     *
     * Invalidate the current user's API token.
     *
     * @authenticated
     *
     * @response 200 scenario="Success" {"message": "Successfully logged out."}
     */
    public function __invoke(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out.',
        ]);
    }
}
