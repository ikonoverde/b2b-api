<?php

use App\Jobs\CreateShippingLabel;
use App\Models\Order;
use App\Services\SkydropxService;

function skydropxOrder(array $overrides = []): Order
{
    return Order::factory()
        ->processing()
        ->withSkydropxShipping()
        ->create(array_merge([
            'shipping_address' => [
                'name' => 'Test User',
                'address_line_1' => 'Calle 123',
                'address_line_2' => 'Centro',
                'city' => 'Mérida',
                'state' => 'Yucatán',
                'postal_code' => '97000',
                'phone' => '9991234567',
            ],
        ], $overrides));
}

it('creates a label successfully', function () {
    $order = skydropxOrder(['shipping_carrier' => 'FedEx - Express']);

    $mock = Mockery::mock(SkydropxService::class);
    $mock->shouldReceive('createShipment')
        ->once()
        ->andReturn([
            'id' => 'shp_123',
            'tracking_number' => 'TRACK123',
            'tracking_url' => 'https://tracking.example.com/TRACK123',
            'label_url' => 'https://labels.example.com/label.pdf',
        ]);

    (new CreateShippingLabel($order))->handle($mock);

    $order->refresh();
    expect($order->label_url)->toBe('https://labels.example.com/label.pdf')
        ->and($order->skydropx_shipment_id)->toBe('shp_123')
        ->and($order->tracking_number)->toBe('TRACK123')
        ->and($order->tracking_url)->toBe('https://tracking.example.com/TRACK123')
        ->and($order->label_error)->toBeNull();
});

it('fetches label separately when not in shipment response', function () {
    $order = skydropxOrder(['shipping_carrier' => 'FedEx - Express']);

    $mock = Mockery::mock(SkydropxService::class);
    $mock->shouldReceive('createShipment')
        ->once()
        ->andReturn([
            'id' => 'shp_456',
            'tracking_number' => null,
            'tracking_url' => null,
            'label_url' => null,
        ]);
    $mock->shouldReceive('getLabel')
        ->once()
        ->with('shp_456')
        ->andReturn('https://labels.example.com/fetched.pdf');

    (new CreateShippingLabel($order))->handle($mock);

    $order->refresh();
    expect($order->label_url)->toBe('https://labels.example.com/fetched.pdf')
        ->and($order->skydropx_shipment_id)->toBe('shp_456');
});

it('skips non-skydropx orders', function () {
    $order = Order::factory()->processing()->create([
        'shipping_quote_source' => 'static',
    ]);

    $mock = Mockery::mock(SkydropxService::class);
    $mock->shouldNotReceive('createShipment');

    (new CreateShippingLabel($order))->handle($mock);

    expect($order->fresh()->label_url)->toBeNull();
});

it('skips orders that already have a label', function () {
    $order = skydropxOrder([
        'shipping_carrier' => 'FedEx - Express',
        'label_url' => 'https://existing-label.com/label.pdf',
    ]);

    $mock = Mockery::mock(SkydropxService::class);
    $mock->shouldNotReceive('createShipment');

    (new CreateShippingLabel($order))->handle($mock);
});

it('records label_error on failure', function () {
    $order = skydropxOrder(['shipping_carrier' => 'FedEx - Express']);

    $mock = Mockery::mock(SkydropxService::class);
    $mock->shouldReceive('createShipment')
        ->once()
        ->andReturn(null);

    try {
        (new CreateShippingLabel($order))->handle($mock);
    } catch (\RuntimeException) {
        // Expected — the job calls $this->fail()
    }

    expect($order->fresh()->label_error)->not->toBeNull();
});

it('records label_error when carrier cannot be parsed', function () {
    $order = skydropxOrder(['shipping_carrier' => 'FedEx Express']);

    $mock = Mockery::mock(SkydropxService::class);
    $mock->shouldNotReceive('createShipment');

    (new CreateShippingLabel($order))->handle($mock);

    expect($order->fresh()->label_error)->toBe('No se pudo determinar la paquetería del pedido.');
});

it('parses carrier and service from shipping_carrier string', function () {
    $order = skydropxOrder(['shipping_carrier' => 'Estafeta - Terrestre']);

    $capturedCarrier = null;
    $capturedService = null;

    $mock = Mockery::mock(SkydropxService::class);
    $mock->shouldReceive('createShipment')
        ->once()
        ->withArgs(function ($addr, $parcel, $carrier, $service) use (&$capturedCarrier, &$capturedService) {
            $capturedCarrier = $carrier;
            $capturedService = $service;

            return true;
        })
        ->andReturn([
            'id' => 'shp_789',
            'tracking_number' => null,
            'tracking_url' => null,
            'label_url' => 'https://labels.example.com/label.pdf',
        ]);

    (new CreateShippingLabel($order))->handle($mock);

    expect($capturedCarrier)->toBe('Estafeta')
        ->and($capturedService)->toBe('Terrestre');
});
