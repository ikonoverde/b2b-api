<?php

use App\Models\AppSettings;
use App\Models\StaticPage;

/**
 * The storefront's written documents live in code, not the database. These routes must render
 * regardless of what the static_pages table holds — including when it is empty.
 */
test('document routes render their hardcoded components', function (string $uri, string $component) {
    $response = $this->get($uri);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component($component));
})->with([
    ['/terms', 'Legal/Terms'],
    ['/privacy', 'Legal/Privacy'],
    ['/about', 'Legal/About'],
    ['/faq', 'Legal/Faq'],
]);

/**
 * Contact details are the one part of these documents an admin maintains outside the codebase,
 * so every document reads them from settings rather than hardcoding values that can drift.
 */
test('document routes publish contact details from settings', function (string $uri) {
    AppSettings::current()->update([
        'contact_email' => 'hola@ikonoverde.com',
        'contact_phone' => '999 111 2233',
        'contact_address' => 'Chicxulub Puerto, Yucatán',
    ]);

    $response = $this->get($uri);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('contactEmail', 'hola@ikonoverde.com')
        ->where('contactPhone', '999 111 2233')
        ->where('contactAddress', 'Chicxulub Puerto, Yucatán')
    );
})->with(['/terms', '/privacy', '/about', '/faq']);

/**
 * A blank setting must drop the line rather than render an empty label.
 */
test('document routes pass through missing contact details', function () {
    AppSettings::current()->update([
        'contact_email' => null,
        'contact_phone' => null,
        'contact_address' => null,
    ]);

    $response = $this->get('/terms');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('contactEmail', null)
        ->where('contactPhone', null)
        ->where('contactAddress', null)
    );
});

test('an unpublished database page of the same slug does not hide the route', function () {
    StaticPage::factory()->unpublished()->create(['slug' => 'terms']);

    $response = $this->get('/terms');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('Legal/Terms'));
});
