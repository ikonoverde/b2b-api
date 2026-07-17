<?php

use App\Models\MetaConversionEvent;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Services\MetaConversionsApiService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;

beforeEach(function () {
    // Off by default outside production; these tests exercise the dispatch itself.
    config()->set('services.meta_pixel.enabled', true);
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

it('sends hashed advanced-matching fields from the shipping address', function () {
    Http::fake([
        'graph.facebook.com/*' => Http::response(['events_received' => 1], 200),
    ]);

    $user = User::factory()->create([
        'email' => 'Cliente@Example.com',
        'phone' => '+52 (999) 123-4567',
    ]);

    $order = Order::factory()->for($user)->create([
        'payment_status' => 'completed',
        'shipping_address' => [
            'name' => 'Juan Pérez García',
            'address_line_1' => 'Calle 60 123',
            'address_line_2' => 'Centro',
            'city' => 'Mérida',
            'state' => 'Yucatán',
            'postal_code' => '97000',
            'phone' => '+52 (999) 123-4567',
        ],
    ]);
    OrderItem::factory()->for($order)->create(['quantity' => 1]);

    app(MetaConversionsApiService::class)->sendPurchase($order->refresh());

    $hash = fn (string $value): string => hash('sha256', $value);

    Http::assertSent(function (Request $request) use ($hash, $user) {
        $userData = $request['data'][0]['user_data'];

        return $userData['em'] === $hash('cliente@example.com')
            && $userData['ph'] === $hash('529991234567')
            && $userData['fn'] === $hash('juan')
            && $userData['ln'] === $hash('pérezgarcía')
            && $userData['ct'] === $hash('mérida')
            && $userData['st'] === $hash('yucatán')
            && $userData['zp'] === $hash('97000')
            && $userData['country'] === $hash('mx')
            && $userData['external_id'] === $hash((string) $user->id);
    });
});

it('omits advanced-matching fields that are absent rather than sending empty hashes', function () {
    Http::fake([
        'graph.facebook.com/*' => Http::response(['events_received' => 1], 200),
    ]);

    $order = Order::factory()->create([
        'payment_status' => 'completed',
        'shipping_address' => null,
    ]);
    OrderItem::factory()->for($order)->create(['quantity' => 1]);

    app(MetaConversionsApiService::class)->sendPurchase($order->refresh());

    Http::assertSent(function (Request $request) {
        $userData = $request['data'][0]['user_data'];

        // No name/city/state/zip on the order, so those keys must be absent...
        return ! array_key_exists('fn', $userData)
            && ! array_key_exists('ln', $userData)
            && ! array_key_exists('ct', $userData)
            && ! array_key_exists('st', $userData)
            && ! array_key_exists('zp', $userData)
            // ...but country is always known for this Mexico-only storefront.
            && $userData['country'] === hash('sha256', 'mx');
    });
});

it('does not break checkout when the event cannot be recorded', function () {
    Http::fake([
        'graph.facebook.com/*' => Http::response([], 200),
    ]);

    $order = completedOrder();

    Schema::drop('meta_conversion_events');

    app(MetaConversionsApiService::class)->sendPurchase($order);
})->throwsNoExceptions();

it('sends nothing to meta when tracking is disabled, even with working production credentials', function () {
    // The exact shape of the 2026-06-25 leak: real credentials, non-production environment.
    config()->set('services.meta_pixel.enabled', false);

    Http::fake();

    new MetaConversionsApiService()->sendPurchase(completedOrder());

    Http::assertNothingSent();

    expect(MetaConversionEvent::sole()->status)
        ->toBe(MetaConversionEvent::STATUS_SKIPPED_NOT_ENABLED);
});

it('distinguishes a disabled environment from missing credentials', function () {
    config()->set('services.meta_pixel.enabled', false);
    config()->set('services.meta_pixel.pixel_id', null);

    Http::fake();

    new MetaConversionsApiService()->sendPurchase(completedOrder());

    // Credentials are also absent, but the guard is why nothing was sent. Reporting this as a
    // config gap would send someone hunting a bug that is not there.
    expect(MetaConversionEvent::sole()->status)
        ->toBe(MetaConversionEvent::STATUS_SKIPPED_NOT_ENABLED);

    Http::assertNothingSent();
});
