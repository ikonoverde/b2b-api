<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * @group Addresses
 *
 * Manage saved shipping addresses for authenticated users.
 */
class AddressesController extends Controller
{
    /**
     * Show the addresses management page
     *
     * Renders the Inertia page for managing saved shipping addresses.
     *
     * @authenticated
     */
    public function show(Request $request): Response
    {
        return Inertia::render('Addresses');
    }
}
