<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Addresses\StoreAddressRequest;
use App\Http\Requests\Addresses\UpdateAddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AddressesController extends Controller
{
    public function show(Request $request): Response
    {
        $addresses = $request->user()
            ->addresses()
            ->orderByDesc('is_default')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Addresses', [
            'addresses' => AddressResource::collection($addresses)->resolve(),
        ]);
    }

    public function store(StoreAddressRequest $request): RedirectResponse
    {
        $address = Address::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
            'country' => 'MX',
        ]);

        if ($address->is_default) {
            $address->setAsDefault();
        }

        return back()->with('success', 'Dirección agregada exitosamente.');
    }

    public function update(UpdateAddressRequest $request, Address $address): RedirectResponse
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }

        $address->update($request->validated());

        if ($address->is_default) {
            $address->setAsDefault();
        }

        return back()->with('success', 'Dirección actualizada exitosamente.');
    }

    public function destroy(Request $request, Address $address): RedirectResponse
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }

        $wasDefault = $address->is_default;
        $address->delete();

        if ($wasDefault) {
            $address->promoteNextDefault();
        }

        return back()->with('success', 'Dirección eliminada exitosamente.');
    }
}
