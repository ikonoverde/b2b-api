<?php

namespace App\Http\Controllers\Web\Legal;

use App\Http\Controllers\Controller;
use App\Models\AppSettings;
use Inertia\Inertia;
use Inertia\Response;

class ShowTermsController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Legal/Terms', AppSettings::current()->documentContact());
    }
}
