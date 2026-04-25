<?php

use App\Jobs\ImportBusinessResults;
use App\Models\Business;
use App\Models\BusinessScrapeRun;
use App\Services\OutscraperService;

use function Pest\Laravel\mock;

test('import creates new businesses from outscraper items', function () {
    $scrapeRun = BusinessScrapeRun::factory()->create([
        'outscraper_request_id' => 'req-123',
        'status' => 'collecting',
    ]);

    mock(OutscraperService::class)
        ->shouldReceive('getRequestStatus')
        ->with('req-123')
        ->andReturn([
            'status' => 'Success',
            'items' => [
                [
                    'place_id' => 'ChIJ_place_1',
                    'name' => 'Spa Zen Merida',
                    'category' => 'Spa',
                    'full_address' => 'Calle 60 #500',
                    'city' => 'Merida',
                    'state' => 'Yucatan',
                    'country_code' => 'MX',
                    'phone' => '+529991234567',
                    'site' => 'https://spazen.com',
                    'rating' => 4.5,
                    'reviews' => 120,
                    'latitude' => 20.97,
                    'longitude' => -89.62,
                    'verified' => true,
                ],
                [
                    'place_id' => 'ChIJ_place_2',
                    'name' => 'Massage Center',
                    'category' => 'Massage therapist',
                    'full_address' => 'Calle 50 #300',
                    'city' => 'Merida',
                    'state' => 'Yucatan',
                    'country_code' => 'MX',
                    'rating' => 4.0,
                    'reviews' => 50,
                    'latitude' => 20.98,
                    'longitude' => -89.63,
                ],
            ],
        ]);

    $job = new ImportBusinessResults($scrapeRun);
    $job->handle(app(OutscraperService::class));

    expect(Business::count())->toBe(2);

    $first = Business::where('place_id', 'ChIJ_place_1')->first();
    expect($first->name)->toBe('Spa Zen Merida');
    expect($first->category_name)->toBe('Spa');
    expect($first->website)->toBe('https://spazen.com');
    expect((float) $first->rating)->toBe(4.50);
    expect($first->is_claimed)->toBeTrue();

    $scrapeRun->refresh();
    expect($scrapeRun->status)->toBe('completed');
    expect($scrapeRun->total_found)->toBe(2);
    expect($scrapeRun->total_imported)->toBe(2);
    expect($scrapeRun->total_updated)->toBe(0);
});

test('import deduplicates using place_id', function () {
    $run1 = BusinessScrapeRun::factory()->completed()->create();

    Business::factory()->create([
        'place_id' => 'ChIJ_existing',
        'name' => 'Old Name Spa',
        'rating' => 3.5,
        'business_scrape_run_id' => $run1->id,
    ]);

    $scrapeRun = BusinessScrapeRun::factory()->create([
        'outscraper_request_id' => 'req-456',
        'status' => 'collecting',
    ]);

    mock(OutscraperService::class)
        ->shouldReceive('getRequestStatus')
        ->with('req-456')
        ->andReturn([
            'status' => 'Success',
            'items' => [
                [
                    'place_id' => 'ChIJ_existing',
                    'name' => 'Updated Spa Name',
                    'rating' => 4.8,
                    'reviews' => 200,
                    'latitude' => 20.97,
                    'longitude' => -89.62,
                ],
                [
                    'place_id' => 'ChIJ_new_place',
                    'name' => 'Brand New Spa',
                    'rating' => 4.2,
                    'reviews' => 10,
                    'latitude' => 20.99,
                    'longitude' => -89.64,
                ],
            ],
        ]);

    $job = new ImportBusinessResults($scrapeRun);
    $job->handle(app(OutscraperService::class));

    expect(Business::count())->toBe(2);

    $existing = Business::where('place_id', 'ChIJ_existing')->first();
    expect($existing->name)->toBe('Updated Spa Name');
    expect((float) $existing->rating)->toBe(4.80);

    $scrapeRun->refresh();
    expect($scrapeRun->total_found)->toBe(2);
    expect($scrapeRun->total_imported)->toBe(1);
    expect($scrapeRun->total_updated)->toBe(1);
});

test('import skips items without place_id', function () {
    $scrapeRun = BusinessScrapeRun::factory()->create([
        'outscraper_request_id' => 'req-789',
        'status' => 'collecting',
    ]);

    mock(OutscraperService::class)
        ->shouldReceive('getRequestStatus')
        ->with('req-789')
        ->andReturn([
            'status' => 'Success',
            'items' => [
                [
                    'name' => 'No Place ID Spa',
                    'rating' => 4.0,
                    'reviews' => 10,
                ],
                [
                    'place_id' => 'ChIJ_valid',
                    'name' => 'Valid Spa',
                    'rating' => 4.5,
                    'reviews' => 100,
                    'latitude' => 20.97,
                    'longitude' => -89.62,
                ],
            ],
        ]);

    $job = new ImportBusinessResults($scrapeRun);
    $job->handle(app(OutscraperService::class));

    expect(Business::count())->toBe(1);
    expect(Business::first()->name)->toBe('Valid Spa');
});

test('import fails loudly when archive is not Success', function () {
    $scrapeRun = BusinessScrapeRun::factory()->create([
        'outscraper_request_id' => 'req-999',
        'status' => 'collecting',
    ]);

    mock(OutscraperService::class)
        ->shouldReceive('getRequestStatus')
        ->with('req-999')
        ->andReturn([
            'status' => 'Pending',
            'items' => null,
        ]);

    $job = new ImportBusinessResults($scrapeRun);

    expect(fn () => $job->handle(app(OutscraperService::class)))
        ->toThrow(RuntimeException::class);
});
