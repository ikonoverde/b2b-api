<?php

namespace App\Jobs;

use App\Models\Business;
use App\Models\BusinessScrapeRun;
use App\Services\OutscraperService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ImportBusinessResults implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [60, 300, 900];

    public function __construct(public BusinessScrapeRun $scrapeRun)
    {
        $this->afterCommit();
    }

    public function handle(OutscraperService $outscraper): void
    {
        $result = $outscraper->getRequestStatus($this->scrapeRun->outscraper_request_id);

        if ($result === null || $result['status'] !== 'Success' || $result['items'] === null) {
            throw new \RuntimeException('Failed to fetch items from Outscraper archive');
        }

        $items = $result['items'];
        $totalFound = count($items);
        $imported = 0;
        $updated = 0;

        foreach ($items as $item) {
            $placeId = $item['place_id'] ?? null;

            if (! $placeId) {
                continue;
            }

            $business = Business::updateOrCreate(
                ['place_id' => $placeId],
                [
                    'name' => $item['name'] ?? 'Unknown',
                    'category_name' => $item['category'] ?? null,
                    'address' => $item['full_address'] ?? null,
                    'neighborhood' => $item['borough'] ?? null,
                    'street' => $item['street'] ?? null,
                    'city' => $item['city'] ?? null,
                    'state' => $item['state'] ?? null,
                    'postal_code' => $item['postal_code'] ?? null,
                    'country_code' => $item['country_code'] ?? null,
                    'phone' => $item['phone'] ?? null,
                    'website' => $item['site'] ?? null,
                    'google_maps_url' => $item['location_link'] ?? null,
                    'rating' => $item['rating'] ?? null,
                    'reviews_count' => $item['reviews'] ?? 0,
                    'latitude' => $item['latitude'] ?? null,
                    'longitude' => $item['longitude'] ?? null,
                    'image_url' => $item['photo'] ?? null,
                    'opening_hours' => $item['working_hours'] ?? null,
                    'additional_info' => $item['about'] ?? null,
                    'is_claimed' => (bool) ($item['verified'] ?? false),
                    'is_advertisement' => false,
                    'business_scrape_run_id' => $this->scrapeRun->id,
                ]
            );

            if ($business->wasRecentlyCreated) {
                $imported++;
            } else {
                $updated++;
            }
        }

        $this->scrapeRun->markCompleted($totalFound, $imported, $updated);
    }

    public function failed(\Throwable $e): void
    {
        Log::error('ImportBusinessResults job failed', [
            'scrape_run_id' => $this->scrapeRun->id,
            'message' => $e->getMessage(),
        ]);

        $this->scrapeRun->markFailed($e->getMessage());
    }
}
