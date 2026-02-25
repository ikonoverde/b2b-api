<?php

namespace App\Http\Controllers\Addresses;

use App\Http\Controllers\Controller;
use App\Http\Requests\Addresses\StoreAddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * @group Addresses
 */
class StoreAddressController extends Controller
{
    /**
     * Create Address
     *
     * Store a new saved address for the authenticated user.
     *
     * @response 201 scenario="Success" {
     *   "data": {
     *     "id": 1,
     *     "label": "Oficina Principal",
     *     "name": "Juan Pérez",
     *     "address_line_1": "Av. Reforma 222",
     *     "address_line_2": "Piso 3, Oficina 301",
     *     "city": "Ciudad de México",
     *     "state": "CDMX",
     *     "postal_code": "06600",
     *     "phone": "5551234567",
     *     "is_default": true,
     *     "country": "MX",
     *     "created_at": "2026-02-24T00:00:00.000000Z",
     *     "updated_at": "2026-02-24T00:00:00.000000Z"
     *   }
     * }
     * @response 422 scenario="Validation error" {
     *   "message": "The label field is required.",
     *   "errors": {"label": ["The label field is required."]}
     * }
     *
     * @authenticated
     */
    public function __invoke(StoreAddressRequest $request): JsonResponse
    {
        $address = Address::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
            'country' => 'MX',
        ]);

        if ($address->is_default) {
            $address->setAsDefault();
        }

        return response()->json(
            ['data' => (new AddressResource($address))->resolve()],
            Response::HTTP_CREATED
        );
    }
}
