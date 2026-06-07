<?php

use Illuminate\Support\Facades\Config;

it('does not render google analytics when it is not configured', function () {
    Config::set('services.google_analytics.measurement_id', null);

    $response = $this->get('/');

    $response->assertSuccessful();
    $response->assertDontSee('googletagmanager.com/gtag/js');
    $response->assertDontSee('tools.luckyorange.com/core/lo.js');
    $response->assertDontSee('window.googleAnalyticsMeasurementId', false);
});

it('renders google analytics when a measurement id is configured', function () {
    Config::set('services.google_analytics.measurement_id', 'G-TEST123');

    $response = $this->get('/');

    $response->assertSuccessful();
    $response->assertSee('https://www.googletagmanager.com/gtag/js?id=G-TEST123', false);
    $response->assertSee('https://tools.luckyorange.com/core/lo.js?site-id=1b9d2b4c', false);
    $response->assertSee('window.googleAnalyticsMeasurementId', false);
    $response->assertSee('send_page_view', false);
});
