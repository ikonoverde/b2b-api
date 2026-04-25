<?php

namespace App\Http\Controllers\Admin\Businesses;

use App\Http\Controllers\Controller;
use App\Jobs\StartBusinessScrape;
use App\Models\BusinessScrapeRun;
use Illuminate\Http\RedirectResponse;

class StartBusinessScrapeController extends Controller
{
    public function __invoke(): RedirectResponse
    {
        if (BusinessScrapeRun::query()->active()->exists()) {
            return back()->with('error', 'Ya hay un scrape en proceso. Espera a que termine.');
        }

        $scrapeRun = BusinessScrapeRun::create([
            'status' => 'pending',
            'search_terms' => 'spa, massage, masajes',
            'location' => 'Merida, Yucatan, Mexico',
            'started_at' => now(),
        ]);

        StartBusinessScrape::dispatch($scrapeRun);

        return back()->with('success', 'Se ha iniciado el scrape de negocios. Esto puede tomar varios minutos.');
    }
}
