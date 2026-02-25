<?php

namespace App\Http\Controllers\Addresses;

use App\Http\Controllers\Controller;
use App\Http\Resources\AddressResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * @group Addresses
 *
 * APIs for managing saved addresses
 */
class GetAddressesController extends Controller
{
    /**
     * List Addresses
     *
     * Retrieve all saved addresses for the authenticated user.
     *
     * @response 200 scenario="Success" {
     *   "data": [
     *     {
     *       "id": 1,
     *       "label": "Oficina Principal",
     *       "name": "Juan Pérez",
     *       "address_line_1": "Av. Reforma 222",
     *       "address_line_2": "Piso 3, Oficina 301",
     *       "city": "Ciudad de México",
     *       "state": "CDMX",
     *       "postal_code": "06600",
     *       "phone": "5551234567",
     *       "is_default": true,
     *       "country": "MX",
     *       "created_at": "2026-02-24T00:00:00.000000Z",
     *       "updated_at": "2026-02-24T00:00:00.000000Z"
     *     }
     *   ]
     * }
     * @response 200 scenario="No addresses" {"data": []}
     *
     * @authenticated
     */
    public function __invoke(): AnonymousResourceCollection
    {
        $addresses = auth()->user()
            ->addresses()
            ->orderByDesc('is_default')
            ->orderByDesc('created_at')
            ->get();

        return AddressResource::collection($addresses);
    }
}
