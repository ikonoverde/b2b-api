<?php

/**
 * The 2026-06-25 leak was a page load, not a checkout: resources/views/app.blade.php initialised
 * fbq with the production pixel ID in every environment, so a developer browsing localhost fired
 * PageView, ViewContent, AddToCart, InitiateCheckout and Purchase into the production dataset.
 * Meta counted them as a customer. These tests are the guard against that returning.
 */
beforeEach(function () {
    config()->set('services.meta_pixel.pixel_id', '2222947471863923');
    config()->set('services.google_analytics.measurement_id', 'G-H2MKDFDS00');
});

it('does not load the meta pixel outside production, even though the production pixel id is configured', function () {
    config()->set('services.meta_pixel.enabled', false);

    $response = $this->get('/');

    $response->assertOk()
        ->assertDontSee('fbq(', escape: false)
        ->assertDontSee('connect.facebook.net', escape: false)
        ->assertDontSee('2222947471863923', escape: false);
});

it('does not load the google analytics tag outside production', function () {
    config()->set('services.google_analytics.enabled', false);

    $response = $this->get('/');

    $response->assertOk()
        ->assertDontSee('googletagmanager.com', escape: false)
        ->assertDontSee('G-H2MKDFDS00', escape: false)
        // Lucky Orange records sessions and rides along inside the same block.
        ->assertDontSee('luckyorange', escape: false);
});

it('loads the meta pixel when tracking is enabled', function () {
    config()->set('services.meta_pixel.enabled', true);

    $this->get('/')
        ->assertOk()
        ->assertSee("fbq('init', window.metaPixelId)", escape: false)
        ->assertSee('2222947471863923', escape: false);
});

it('loads the google analytics tag when tracking is enabled', function () {
    config()->set('services.google_analytics.enabled', true);

    $this->get('/')
        ->assertOk()
        ->assertSee('googletagmanager.com/gtag/js?id=G-H2MKDFDS00', escape: false);
});

it('still loads nothing when enabled but the id is unset', function () {
    config()->set('services.meta_pixel.enabled', true);
    config()->set('services.meta_pixel.pixel_id', null);
    config()->set('services.google_analytics.enabled', true);
    config()->set('services.google_analytics.measurement_id', null);

    $this->get('/')
        ->assertOk()
        ->assertDontSee('fbq(', escape: false)
        ->assertDontSee('googletagmanager.com', escape: false);
});
