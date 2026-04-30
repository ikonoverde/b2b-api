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
        $items = $this->fetchItems($outscraper);

        $imported = 0;
        $updated = 0;

        foreach ($items as $item) {
            $this->importItem($item, $imported, $updated);
        }

        $this->scrapeRun->markCompleted(count($items), $imported, $updated);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function fetchItems(OutscraperService $outscraper): array
    {
        $result = $outscraper->getRequestStatus($this->scrapeRun->outscraper_request_id);

        if ($result === null || $result['status'] !== 'Success' || $result['items'] === null) {
            throw new \RuntimeException('Failed to fetch items from Outscraper archive');
        }

        return $result['items'];
    }

    /**
     * @param  array<string, mixed>  $item
     */
    private function importItem(array $item, int &$imported, int &$updated): void
    {
        $placeId = $item['place_id'] ?? null;

        if (! $placeId) {
            return;
        }

        $business = Business::updateOrCreate(
            ['place_id' => $placeId],
            $this->mapItemAttributes($item),
        );

        if ($business->wasRecentlyCreated) {
            $imported++;
        } else {
            $updated++;
        }
    }

    /**
     * @param  array<string, mixed>  $item
     * @return array<string, mixed>
     */
    private function mapItemAttributes(array $item): array
    {
        $item += [
            'name' => 'Unknown',
            'category' => null,
            'full_address' => null,
            'borough' => null,
            'street' => null,
            'city' => null,
            'state' => null,
            'postal_code' => null,
            'country_code' => null,
            'phone' => null,
            'site' => null,
            'location_link' => null,
            'rating' => null,
            'reviews' => 0,
            'latitude' => null,
            'longitude' => null,
            'photo' => null,
            'working_hours' => null,
            'about' => null,
            'verified' => false,
        ];

        return [
            'name' => $item['name'],
            'category_name' => $item['category'],
            'address' => $item['full_address'],
            'neighborhood' => $item['borough'],
            'street' => $item['street'],
            'city' => $item['city'],
            'state' => $item['state'],
            'postal_code' => $item['postal_code'],
            'country_code' => $item['country_code'],
            'phone' => $item['phone'],
            'website' => $item['site'],
            'google_maps_url' => $item['location_link'],
            'rating' => $item['rating'],
            'reviews_count' => $item['reviews'],
            'latitude' => $item['latitude'],
            'longitude' => $item['longitude'],
            'image_url' => $item['photo'],
            'opening_hours' => $item['working_hours'],
            'additional_info' => $item['about'],
            'is_claimed' => (bool) $item['verified'],
            'is_advertisement' => false,
            'business_scrape_run_id' => $this->scrapeRun->id,
        ];
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
