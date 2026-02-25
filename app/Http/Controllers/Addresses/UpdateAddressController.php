<?php

namespace App\Http\Controllers\Addresses;

use App\Http\Controllers\Controller;
use App\Http\Requests\Addresses\UpdateAddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * @group Addresses
 */
class UpdateAddressController extends Controller
{
    /**
     * Update Address
     *
     * Update an existing saved address for the authenticated user.
     *
     * @urlParam address integer required The ID of the address. Example: 1
     *
     * @response 200 scenario="Success" {
     *   "data": {
     *     "id": 1,
     *     "label": "Bodega",
     *     "name": "María López",
     *     "address_line_1": "Calle Industrial 45",
     *     "address_line_2": null,
     *     "city": "Monterrey",
     *     "state": "Nuevo León",
     *     "postal_code": "64000",
     *     "phone": "8187654321",
     *     "is_default": false,
     *     "country": "MX",
     *     "created_at": "2026-02-24T00:00:00.000000Z",
     *     "updated_at": "2026-02-24T00:00:00.000000Z"
     *   }
     * }
     * @response 403 scenario="Belongs to another user" {"message": "Forbidden"}
     * @response 404 scenario="Not found" {"message": "Not Found"}
     *
     * @authenticated
     */
    public function __invoke(UpdateAddressRequest $request, Address $address): JsonResponse
    {
        if ($address->user_id !== auth()->id()) {
            return response()->json(
                ['message' => 'Forbidden'],
                Response::HTTP_FORBIDDEN
            );
        }

        $address->update($request->validated());

        if ($address->is_default) {
            $address->setAsDefault();
        }

        return response()->json(
            ['data' => (new AddressResource($address->fresh()))->resolve()]
        );
    }
}
