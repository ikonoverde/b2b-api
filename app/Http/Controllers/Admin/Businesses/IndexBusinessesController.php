<?php

namespace App\Http\Controllers\Admin\Businesses;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\BusinessScrapeRun;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexBusinessesController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $businesses = Business::query()
            ->when($request->query('search'), fn ($q, $search) => $q->search($search))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        $latestRun = BusinessScrapeRun::query()->latest()->first();
        $activeRun = BusinessScrapeRun::query()->active()->first();

        return Inertia::render('admin/businesses/Index', [
            'businesses' => $businesses,
            'latestRun' => $latestRun,
            'activeRun' => $activeRun,
            'filters' => $request->only('search'),
        ]);
    }
}
