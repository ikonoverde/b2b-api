<?php

use App\Models\MetaConversionEvent;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\MetaConversionsApiService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;

beforeEach(function () {
    config()->set('services.meta_pixel.pixel_id', '1234567890');
    config()->set('services.meta_pixel.conversions_api_access_token', 'test-token');
    config()->set('services.meta_pixel.api_version', 'v22.0');
    config()->set('services.meta_pixel.currency', 'MXN');
    config()->set('services.meta_pixel.test_event_code', null);
});

function completedOrder(): Order
{
    $order = Order::factory()->create([
        'payment_status' => 'completed',
        'total_amount' => 1250.00,
    ]);

    OrderItem::factory()->for($order)->create(['quantity' => 3]);

    return $order->refresh();
}

it('records a sent event when meta accepts the purchase', function () {
    Http::fake([
        'graph.facebook.com/*' => Http::response(['events_received' => 1], 200),
    ]);

    $order = completedOrder();

    app(MetaConversionsApiService::class)->sendPurchase($order);

    $event = MetaConversionEvent::query()->sole();

    expect($event->status)->toBe(MetaConversionEvent::STATUS_SENT)
        ->and($event->order_id)->toBe($order->id)
        ->and($event->event_id)->toBe("order_{$order->id}")
        ->and($event->http_status)->toBe(200)
        ->and($event->error_message)->toBeNull()
        ->and((float) $event->value)->toBe(1250.00)
        ->and($event->currency)->toBe('MXN')
        ->and($event->num_items)->toBe(3)
        ->and($event->test_event_code)->toBeNull();
});

it('records skipped_missing_credentials without calling meta when the pixel id is unset', function () {
    Http::fake();
    config()->set('services.meta_pixel.pixel_id', null);

    app(MetaConversionsApiService::class)->sendPurchase(completedOrder());

    Http::assertNothingSent();

    $event = MetaConversionEvent::query()->sole();

    expect($event->status)->toBe(MetaConversionEvent::STATUS_SKIPPED_MISSING_CREDENTIALS)
        ->and($event->http_status)->toBeNull();
});

it('records skipped_missing_credentials when the access token is unset', function () {
    Http::fake();
    config()->set('services.meta_pixel.conversions_api_access_token', null);

    app(MetaConversionsApiService::class)->sendPurchase(completedOrder());

    Http::assertNothingSent();

    expect(MetaConversionEvent::query()->sole()->status)
        ->toBe(MetaConversionEvent::STATUS_SKIPPED_MISSING_CREDENTIALS);
});

it('records a rejected event with meta error message when meta refuses the payload', function () {
    Http::fake([
        'graph.facebook.com/*' => Http::response([
            'error' => ['message' => 'Invalid parameter: custom_data[value]'],
        ], 400),
    ]);

    app(MetaConversionsApiService::class)->sendPurchase(completedOrder());

    $event = MetaConversionEvent::query()->sole();

    expect($event->status)->toBe(MetaConversionEvent::STATUS_REJECTED)
        ->and($event->http_status)->toBe(400)
        ->and($event->error_message)->toBe('Invalid parameter: custom_data[value]');
});

it('records a failed event when the request throws', function () {
    Http::fake(fn () => throw new ConnectionException('Operation timed out'));

    app(MetaConversionsApiService::class)->sendPurchase(completedOrder());

    $event = MetaConversionEvent::query()->sole();

    expect($event->status)->toBe(MetaConversionEvent::STATUS_FAILED)
        ->and($event->http_status)->toBeNull()
        ->and($event->error_message)->toContain('Operation timed out');
});

it('stores the test event code so a verification run is never mistaken for a sale', function () {
    Http::fake([
        'graph.facebook.com/*' => Http::response(['events_received' => 1], 200),
    ]);
    config()->set('services.meta_pixel.test_event_code', 'TEST12345');

    app(MetaConversionsApiService::class)->sendPurchase(completedOrder());

    $event = MetaConversionEvent::query()->sole();

    expect($event->test_event_code)->toBe('TEST12345')
        ->and($event->isTestEvent())->toBeTrue();

    Http::assertSent(fn (Request $request) => $request['test_event_code'] === 'TEST12345');
});

it('sends the same event id the browser pixel uses so meta deduplicates', function () {
    Http::fake([
        'graph.facebook.com/*' => Http::response([], 200),
    ]);

    $order = completedOrder();

    app(MetaConversionsApiService::class)->sendPurchase($order);

    Http::assertSent(fn (Request $request) => $request['data'][0]['event_id'] === $order->metaPurchaseEventId());
});

it('does not break checkout when the event cannot be recorded', function () {
    Http::fake([
        'graph.facebook.com/*' => Http::response([], 200),
    ]);

    $order = completedOrder();

    Schema::drop('meta_conversion_events');

    app(MetaConversionsApiService::class)->sendPurchase($order);
})->throwsNoExceptions();
