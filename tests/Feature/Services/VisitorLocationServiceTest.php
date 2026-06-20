<?php

use App\Services\VisitorLocationService;

beforeEach(function () {
    config()->set('shop.visitor_location.database_path', storage_path('app/geoip/GeoLite2-City.mmdb'));
    config()->set('shop.visitor_location.merida_promotion.enabled', true);
    config()->set('shop.visitor_location.merida_promotion.local_override', false);
    config()->set('shop.visitor_location.merida_promotion.country', 'MX');
    config()->set('shop.visitor_location.merida_promotion.region', 'Yucatán');
    config()->set('shop.visitor_location.merida_promotion.city', 'Mérida');
});

it('matches merida yucatan with or without accents', function () {
    $service = new VisitorLocationService;

    expect($service->isPromotionLocation([
        'country' => 'mx',
        'region' => 'Yucatan',
        'city' => 'Merida',
    ]))->toBeTrue();
});

it('rejects other locations', function (array $location) {
    $service = new VisitorLocationService;

    expect($service->isPromotionLocation($location))->toBeFalse();
})->with([
    'wrong country' => [[
        'country' => 'ES',
        'region' => 'Yucatán',
        'city' => 'Mérida',
    ]],
    'wrong region' => [[
        'country' => 'MX',
        'region' => 'Nuevo León',
        'city' => 'Mérida',
    ]],
    'wrong city' => [[
        'country' => 'MX',
        'region' => 'Yucatán',
        'city' => 'Valladolid',
    ]],
]);

it('does not show the promotion for private ips by default', function () {
    $service = new VisitorLocationService;

    expect($service->shouldShowMeridaPromotion('192.168.0.193'))->toBeFalse();
});

it('can force the promotion on for local testing', function () {
    config()->set('shop.visitor_location.merida_promotion.local_override', true);

    $service = new VisitorLocationService;

    expect($service->shouldShowMeridaPromotion('192.168.0.193'))->toBeTrue();
});
