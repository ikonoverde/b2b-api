<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\StoreMeridaSampleRequest;
use Inertia\Inertia;
use Inertia\Response;

class ShowMeridaSampleRequestController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('MeridaSamples', [
            'options' => [
                'businessTypes' => StoreMeridaSampleRequest::BUSINESS_TYPES,
                'clientVolumes' => StoreMeridaSampleRequest::CLIENT_VOLUMES,
                'products' => StoreMeridaSampleRequest::PRODUCTS,
                'improvementGoals' => StoreMeridaSampleRequest::IMPROVEMENT_GOALS,
            ],
        ]);
    }
}
