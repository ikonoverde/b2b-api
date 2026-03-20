<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse;

class GoogleRedirectController extends Controller
{
    public function __invoke(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }
}
