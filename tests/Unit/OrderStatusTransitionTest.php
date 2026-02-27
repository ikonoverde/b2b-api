<?php

use App\Models\Order;

test('pending order can transition to processing', function () {
    $order = new Order(['status' => 'pending']);

    expect($order->canTransitionTo('processing'))->toBeTrue();
});

test('pending order can transition to cancelled', function () {
    $order = new Order(['status' => 'pending']);

    expect($order->canTransitionTo('cancelled'))->toBeTrue();
});

test('pending order cannot transition to shipped', function () {
    $order = new Order(['status' => 'pending']);

    expect($order->canTransitionTo('shipped'))->toBeFalse();
});

test('processing order can transition to shipped', function () {
    $order = new Order(['status' => 'processing']);

    expect($order->canTransitionTo('shipped'))->toBeTrue();
});

test('processing order can transition to cancelled', function () {
    $order = new Order(['status' => 'processing']);

    expect($order->canTransitionTo('cancelled'))->toBeTrue();
});

test('shipped order can transition to delivered', function () {
    $order = new Order(['status' => 'shipped']);

    expect($order->canTransitionTo('delivered'))->toBeTrue();
});

test('delivered order cannot transition to any status', function () {
    $order = new Order(['status' => 'delivered']);

    expect($order->canTransitionTo('pending'))->toBeFalse();
    expect($order->canTransitionTo('processing'))->toBeFalse();
    expect($order->canTransitionTo('shipped'))->toBeFalse();
    expect($order->canTransitionTo('cancelled'))->toBeFalse();
});

test('cancelled order cannot transition to any status', function () {
    $order = new Order(['status' => 'cancelled']);

    expect($order->canTransitionTo('pending'))->toBeFalse();
    expect($order->canTransitionTo('processing'))->toBeFalse();
    expect($order->canTransitionTo('shipped'))->toBeFalse();
    expect($order->canTransitionTo('delivered'))->toBeFalse();
});
