<?php

use App\Jobs\PollBusinessScrapeStatus;
use App\Jobs\StartBusinessScrape;
use App\Models\Business;
use App\Models\BusinessScrapeRun;
use App\Models\User;
use App\Services\OutscraperService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;

test('admin can view businesses index page', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/admin/businesses');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/businesses/Index')
        ->has('businesses')
        ->has('filters')
    );
});

test('admin can trigger a business scrape', function () {
    Queue::fake();

    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post('/admin/businesses/scrape');

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('business_scrape_runs', [
        'status' => 'pending',
        'search_terms' => 'spa, massage, masajes',
        'location' => 'Merida, Yucatan, Mexico',
    ]);

    Queue::assertPushed(StartBusinessScrape::class);
});

test('start business scrape schedules status polling after request starts', function () {
    Queue::fake();

    $scrapeRun = BusinessScrapeRun::factory()->create();

    Http::fake([
        'api.outscraper.cloud/google-maps-search' => Http::response(['id' => 'request-123', 'status' => 'Pending'], 202),
    ]);

    $outscraper = new OutscraperService(
        apiKey: 'test-api-key',
        baseUrl: 'https://api.outscraper.cloud',
    );

    (new StartBusinessScrape($scrapeRun))->handle($outscraper);

    expect($scrapeRun->fresh())
        ->status->toBe('running')
        ->outscraper_request_id->toBe('request-123');

    Queue::assertPushed(
        PollBusinessScrapeStatus::class,
        fn (PollBusinessScrapeStatus $job): bool => $job->delay === 30
            && $job->scrapeRun->is($scrapeRun),
    );
});

test('cannot trigger scrape while one is active', function () {
    Queue::fake();

    $admin = User::factory()->admin()->create();

    BusinessScrapeRun::factory()->running()->create();

    $response = $this->actingAs($admin)->post('/admin/businesses/scrape');

    $response->assertRedirect();
    $response->assertSessionHas('error');

    Queue::assertNothingPushed();
});

test('non-admin cannot access businesses page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/admin/businesses');

    $response->assertForbidden();
});

test('non-admin cannot trigger scrape', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/admin/businesses/scrape');

    $response->assertForbidden();
});

test('businesses index shows search results', function () {
    $admin = User::factory()->admin()->create();
    $run = BusinessScrapeRun::factory()->completed()->create();

    Business::factory()->create([
        'name' => 'Spa Zen Merida',
        'business_scrape_run_id' => $run->id,
    ]);
    Business::factory()->create([
        'name' => 'Taller Mecanico',
        'business_scrape_run_id' => $run->id,
    ]);

    $response = $this->actingAs($admin)->get('/admin/businesses?search=Zen');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('businesses.total', 1)
    );
});

test('admin can export businesses for meta ads', function () {
    $admin = User::factory()->admin()->create();
    $run = BusinessScrapeRun::factory()->completed()->create();

    Business::factory()->create([
        'place_id' => 'place-spa-zen',
        'name' => 'Spa Zen Merida',
        'emails' => ['contacto@spazen.test', 'ventas@spazen.test'],
        'phone' => '+52 999 123 4567',
        'postal_code' => '97000',
        'city' => 'Mérida',
        'state' => 'Yucatán',
        'country_code' => 'mx',
        'business_scrape_run_id' => $run->id,
    ]);

    Business::factory()->create([
        'place_id' => 'place-taller',
        'name' => 'Taller Mecanico',
        'emails' => ['hola@taller.test'],
        'business_scrape_run_id' => $run->id,
    ]);

    $response = $this->actingAs($admin)->get('/admin/businesses/export?search=Zen');

    $response->assertDownload('meta-businesses.csv');
    $response->assertStreamedContent(implode("\n", [
        'email,phone,zip,ct,st,country,extern_id',
        'contacto@spazen.test,"+52 999 123 4567",97000,Mérida,Yucatán,MX,place-spa-zen',
        '',
    ]));
});

test('non-admin cannot export businesses for meta ads', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/admin/businesses/export');

    $response->assertForbidden();
});
