<?php

namespace App\Http\Controllers\Web\Legal;

use App\Http\Controllers\Controller;
use App\Models\AppSettings;
use Inertia\Inertia;
use Inertia\Response;

class ShowPrivacyController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Legal/Privacy', AppSettings::current()->documentContact());
    }
}
