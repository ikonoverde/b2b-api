<?php

use App\Models\Order;
use App\Models\User;

it('returns tracking info for a shipped order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->shipped()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user, 'sanctum')->getJson("/api/orders/{$order->id}");

    $response->assertSuccessful()
        ->assertJsonPath('data.tracking_number', $order->tracking_number)
        ->assertJsonPath('data.shipping_carrier', $order->shipping_carrier)
        ->assertJsonPath('data.tracking_url', $order->tracking_url);
});

it('returns null tracking fields for a pending order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user, 'sanctum')->getJson("/api/orders/{$order->id}");

    $response->assertSuccessful()
        ->assertJsonPath('data.tracking_number', null)
        ->assertJsonPath('data.shipping_carrier', null)
        ->assertJsonPath('data.tracking_url', null);
});

it('returns tracking_url when set on a shipped order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->shipped()->create([
        'user_id' => $user->id,
        'tracking_url' => 'https://www.dhl.com/track?id=1234567890',
    ]);

    $response = $this->actingAs($user, 'sanctum')->getJson("/api/orders/{$order->id}");

    $response->assertSuccessful()
        ->assertJsonPath('data.tracking_url', 'https://www.dhl.com/track?id=1234567890');
});

it('includes tracking fields in order list response', function () {
    $user = User::factory()->create();
    Order::factory()->shipped()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user, 'sanctum')->getJson('/api/orders');

    $response->assertSuccessful()
        ->assertJsonStructure([
            'data' => [['tracking_number', 'shipping_carrier', 'tracking_url']],
        ]);
});
