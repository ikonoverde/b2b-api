<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreMeridaSampleRequest;
use App\Models\MeridaSampleRequest;
use Illuminate\Http\RedirectResponse;

class StoreMeridaSampleRequestController extends Controller
{
    public function __invoke(StoreMeridaSampleRequest $request): RedirectResponse
    {
        MeridaSampleRequest::create([
            ...$request->validated(),
            'user_id' => $request->user()?->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()
            ->route('merida-samples.show')
            ->with('success', 'Solicitud recibida. Revisaremos el perfil del negocio y daremos seguimiento por correo.');
    }
}
