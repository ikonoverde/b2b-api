<?php

namespace App\Http\Controllers\Addresses;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * @group Addresses
 */
class DestroyAddressController extends Controller
{
    /**
     * Delete Address
     *
     * Delete a saved address. If the deleted address was the default,
     * the most recently created remaining address becomes the new default.
     *
     * @urlParam address integer required The ID of the address. Example: 1
     *
     * @response 204 scenario="Deleted"
     * @response 403 scenario="Belongs to another user" {"message": "Forbidden"}
     * @response 404 scenario="Not found" {"message": "Not Found"}
     *
     * @authenticated
     */
    public function __invoke(Address $address): JsonResponse
    {
        if ($address->user_id !== auth()->id()) {
            return response()->json(
                ['message' => 'Forbidden'],
                Response::HTTP_FORBIDDEN
            );
        }

        $wasDefault = $address->is_default;

        $address->delete();

        if ($wasDefault) {
            $address->promoteNextDefault();
        }

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
