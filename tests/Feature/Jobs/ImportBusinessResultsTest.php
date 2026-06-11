<?php

use App\Jobs\ImportBusinessResults;
use App\Models\Business;
use App\Models\BusinessScrapeRun;
use App\Services\OutscraperService;
use Illuminate\Support\Facades\Http;

function outscraperWithArchive(string $requestId, array $response): OutscraperService
{
    Http::fake([
        "api.outscraper.cloud/requests/{$requestId}" => Http::response($response),
    ]);

    return new OutscraperService(
        apiKey: 'test-api-key',
        baseUrl: 'https://api.outscraper.cloud',
    );
}

test('import creates new businesses from outscraper items', function () {
    $googleMapsUrl = 'https://www.google.com/maps/place/Casa+Spa+Masajes+Relajantes+y+Terap%C3%A9uticos+M%C3%A9rida/@21.0357251,-89.65155,14z/data=!4m8!1m2!2m1!1sCasa+Spa+Masajes+Relajantes+y+Terap%C3%A9uticos+M%C3%A9rida!3m4!1s0x8f56755d22a44a3b:0x3635b6f6f8a20ed7!8m2!3d21.0357251!4d-89.65155';

    $scrapeRun = BusinessScrapeRun::factory()->create([
        'outscraper_request_id' => 'req-123',
        'status' => 'collecting',
    ]);

    $outscraper = outscraperWithArchive('req-123', [
        'status' => 'Success',
        'data' => [
            [
                [
                    'place_id' => 'ChIJ_place_1',
                    'name' => 'Spa Zen Merida',
                    'category' => 'Spa',
                    'full_address' => 'Calle 60 #500',
                    'city' => 'Merida',
                    'state' => 'Yucatan',
                    'country_code' => 'MX',
                    'phone' => '+529991234567',
                    'emails' => [
                        ['value' => 'INFO@SPAZEN.COM'],
                        ['value' => 'bad-email'],
                    ],
                    'contacts' => [
                        [
                            'full_name' => 'Ana Perez',
                            'emails' => [
                                ['value' => 'ana@spazen.com'],
                                ['value' => 'info@spazen.com'],
                            ],
                        ],
                        ['email' => 'ventas@spazen.com'],
                    ],
                    'site' => 'https://spazen.com',
                    'location_link' => $googleMapsUrl,
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
        ],
    ]);

    $job = new ImportBusinessResults($scrapeRun);
    $job->handle($outscraper);

    expect(Business::count())->toBe(2);

    $first = Business::where('place_id', 'ChIJ_place_1')->first();
    expect($first->name)->toBe('Spa Zen Merida');
    expect($first->category_name)->toBe('Spa');
    expect($first->emails)->toBe([
        'info@spazen.com',
        'ana@spazen.com',
        'ventas@spazen.com',
    ]);
    expect($first->website)->toBe('https://spazen.com');
    expect(strlen($googleMapsUrl))->toBeGreaterThan(255);
    expect($first->google_maps_url)->toBe($googleMapsUrl);
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

    $outscraper = outscraperWithArchive('req-456', [
        'status' => 'Success',
        'data' => [
            [
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
        ],
    ]);

    $job = new ImportBusinessResults($scrapeRun);
    $job->handle($outscraper);

    expect(Business::count())->toBe(2);

    $existing = Business::where('place_id', 'ChIJ_existing')->first();
    expect($existing->name)->toBe('Updated Spa Name');
    expect((float) $existing->rating)->toBe(4.80);

    $scrapeRun->refresh();
    expect($scrapeRun->total_found)->toBe(2);
    expect($scrapeRun->total_imported)->toBe(1);
    expect($scrapeRun->total_updated)->toBe(1);
});

test('import discards image URLs that exceed the businesses column length', function () {
    $scrapeRun = BusinessScrapeRun::factory()->create([
        'outscraper_request_id' => 'req-long-image',
        'status' => 'collecting',
    ]);

    $outscraper = outscraperWithArchive('req-long-image', [
        'status' => 'Success',
        'data' => [
            [
                [
                    'place_id' => 'ChIJ_long_image',
                    'name' => 'Long Image Spa',
                    'photo' => 'https://lh3.googleusercontent.com/gps-proxy/'.str_repeat('a', 260),
                ],
            ],
        ],
    ]);

    $job = new ImportBusinessResults($scrapeRun);
    $job->handle($outscraper);

    $business = Business::where('place_id', 'ChIJ_long_image')->first();

    expect($business->image_url)->toBeNull();
    expect($scrapeRun->refresh()->status)->toBe('completed');
});

test('import applies defaults when outscraper returns explicit nulls', function () {
    $scrapeRun = BusinessScrapeRun::factory()->create([
        'outscraper_request_id' => 'req-nulls',
        'status' => 'collecting',
    ]);

    $outscraper = outscraperWithArchive('req-nulls', [
        'status' => 'Success',
        'data' => [
            [
                [
                    'place_id' => 'ChIJ_null_fields',
                    'name' => null,
                    'rating' => null,
                    'reviews' => null,
                    'emails' => null,
                    'contacts' => null,
                    'verified' => null,
                    'latitude' => 21.0089037,
                    'longitude' => -89.6187164,
                ],
            ],
        ],
    ]);

    $job = new ImportBusinessResults($scrapeRun);
    $job->handle($outscraper);

    $business = Business::where('place_id', 'ChIJ_null_fields')->first();

    expect($business)->not->toBeNull();
    expect($business->name)->toBe('Unknown');
    expect($business->reviews_count)->toBe(0);
    expect($business->rating)->toBeNull();
    expect($business->emails)->toBe([]);
    expect($business->is_claimed)->toBeFalse();

    $scrapeRun->refresh();
    expect($scrapeRun->status)->toBe('completed');
    expect($scrapeRun->total_imported)->toBe(1);
});

test('import skips items without place_id', function () {
    $scrapeRun = BusinessScrapeRun::factory()->create([
        'outscraper_request_id' => 'req-789',
        'status' => 'collecting',
    ]);

    $outscraper = outscraperWithArchive('req-789', [
        'status' => 'Success',
        'data' => [
            [
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
        ],
    ]);

    $job = new ImportBusinessResults($scrapeRun);
    $job->handle($outscraper);

    expect(Business::count())->toBe(1);
    expect(Business::first()->name)->toBe('Valid Spa');
});

test('import fails loudly when archive is not Success', function () {
    $scrapeRun = BusinessScrapeRun::factory()->create([
        'outscraper_request_id' => 'req-999',
        'status' => 'collecting',
    ]);

    $outscraper = outscraperWithArchive('req-999', [
        'status' => 'Pending',
    ]);

    $job = new ImportBusinessResults($scrapeRun);

    expect(fn () => $job->handle($outscraper))
        ->toThrow(RuntimeException::class);
});
