<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

/**
 * @group User
 *
 * APIs for user profile management
 */
class UserController extends Controller
{
    /**
     * Get Current User
     *
     * Retrieve the authenticated user's profile.
     *
     * @response 200 scenario="Success" {"id": 1, "name": "John Doe", "email": "john@example.com", "rfc": "ABCD123456XYZ", "phone": "+521234567890"}
     * @response 401 scenario="Unauthenticated" {"message": "Unauthenticated."}
     */
    public function __invoke(Request $request)
    {
        return new UserResource($request->user());
    }
}
