<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreMeridaSampleRequest;
use App\Models\MeridaSampleRequest;
use App\Models\User;
use App\Notifications\SampleRequest\NewMeridaSampleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Notification;

class StoreMeridaSampleRequestController extends Controller
{
    /**
     * @var list<string>
     */
    private const STAFF_ROLES = ['admin', 'super_admin'];

    public function __invoke(StoreMeridaSampleRequest $request): RedirectResponse
    {
        $sampleRequest = MeridaSampleRequest::create([
            ...$request->validated(),
            'user_id' => $request->user()?->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        $staff = User::query()
            ->whereIn('role', self::STAFF_ROLES)
            ->where('is_active', true)
            ->get();

        if ($staff->isNotEmpty()) {
            Notification::send($staff, new NewMeridaSampleRequest($sampleRequest));
        }

        return redirect()
            ->route('merida-samples.show')
            ->with('success', 'Solicitud recibida. Revisaremos el perfil del negocio y daremos seguimiento por correo.');
    }
}
