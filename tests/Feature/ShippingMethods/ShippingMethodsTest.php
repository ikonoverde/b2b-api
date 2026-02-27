<?php

use App\Models\ShippingMethod;
use App\Models\User;

it('requires authentication', function () {
    $response = $this->getJson('/api/shipping-methods');

    $response->assertUnauthorized();
});

it('returns active shipping methods', function () {
    $user = User::factory()->create();
    ShippingMethod::factory()->create(['name' => 'Standard', 'cost' => 10.00, 'is_active' => true]);
    ShippingMethod::factory()->create(['name' => 'Express', 'cost' => 25.00, 'is_active' => true]);
    ShippingMethod::factory()->inactive()->create(['name' => 'Discontinued']);

    $response = $this->actingAs($user)->getJson('/api/shipping-methods');

    $response->assertSuccessful();
    $response->assertJsonCount(2, 'data');
});

it('sorts shipping methods by cost ascending', function () {
    $user = User::factory()->create();
    ShippingMethod::factory()->create(['name' => 'Express', 'cost' => 25.00]);
    ShippingMethod::factory()->create(['name' => 'Standard', 'cost' => 10.00]);
    ShippingMethod::factory()->create(['name' => 'Next Day', 'cost' => 50.00]);

    $response = $this->actingAs($user)->getJson('/api/shipping-methods');

    $response->assertSuccessful();
    $costs = collect($response->json('data'))->pluck('cost')->all();
    expect($costs)->toEqual([10.00, 25.00, 50.00]);
});

it('returns correct structure for each shipping method', function () {
    $user = User::factory()->create();
    ShippingMethod::factory()->create([
        'name' => 'Standard',
        'description' => 'Standard shipping',
        'cost' => 10.00,
        'estimated_delivery_days' => 7,
    ]);

    $response = $this->actingAs($user)->getJson('/api/shipping-methods');

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            ['id', 'name', 'description', 'cost', 'estimated_delivery_days'],
        ],
    ]);
    $response->assertJsonPath('data.0.name', 'Standard');
    $response->assertJsonPath('data.0.cost', 10);
    $response->assertJsonPath('data.0.estimated_delivery_days', 7);
});

it('returns empty data when no active shipping methods exist', function () {
    $user = User::factory()->create();
    ShippingMethod::factory()->inactive()->create();

    $response = $this->actingAs($user)->getJson('/api/shipping-methods');

    $response->assertSuccessful();
    $response->assertJsonCount(0, 'data');
});
