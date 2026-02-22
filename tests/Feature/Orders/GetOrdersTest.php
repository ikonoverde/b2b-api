<?php

use App\Models\Order;
use App\Models\User;

it('requires authentication', function () {
    $this->getJson('/api/orders')->assertUnauthorized();
});

it('returns paginated orders for the authenticated user', function () {
    $user = User::factory()->create();
    Order::factory(20)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user, 'sanctum')->getJson('/api/orders');

    $response->assertSuccessful()
        ->assertJsonCount(15, 'data')
        ->assertJsonStructure([
            'data' => [['id', 'user_id', 'status', 'total_amount', 'items', 'created_at']],
            'links' => ['first', 'last', 'prev', 'next'],
            'meta' => ['current_page', 'last_page', 'per_page', 'total'],
        ])
        ->assertJsonPath('meta.current_page', 1)
        ->assertJsonPath('meta.last_page', 2)
        ->assertJsonPath('meta.per_page', 15)
        ->assertJsonPath('meta.total', 20);
});

it('supports custom per_page parameter', function () {
    $user = User::factory()->create();
    Order::factory(10)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user, 'sanctum')->getJson('/api/orders?per_page=5');

    $response->assertSuccessful()
        ->assertJsonCount(5, 'data')
        ->assertJsonPath('meta.per_page', 5)
        ->assertJsonPath('meta.last_page', 2)
        ->assertJsonPath('meta.total', 10);
});

it('caps per_page at 100', function () {
    $user = User::factory()->create();
    Order::factory(3)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user, 'sanctum')->getJson('/api/orders?per_page=999');

    $response->assertSuccessful()
        ->assertJsonPath('meta.per_page', 100);
});

it('supports page parameter', function () {
    $user = User::factory()->create();
    Order::factory(20)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user, 'sanctum')->getJson('/api/orders?page=2');

    $response->assertSuccessful()
        ->assertJsonCount(5, 'data')
        ->assertJsonPath('meta.current_page', 2);
});

it('returns orders in descending date order', function () {
    $user = User::factory()->create();
    $older = Order::factory()->create(['user_id' => $user->id, 'created_at' => now()->subDays(5)]);
    $newer = Order::factory()->create(['user_id' => $user->id, 'created_at' => now()]);

    $response = $this->actingAs($user, 'sanctum')->getJson('/api/orders');

    $response->assertSuccessful();
    $data = $response->json('data');
    expect($data[0]['id'])->toBe($newer->id)
        ->and($data[1]['id'])->toBe($older->id);
});

it('does not return orders belonging to other users', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Order::factory(3)->create(['user_id' => $user->id]);
    Order::factory(2)->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user, 'sanctum')->getJson('/api/orders');

    $response->assertSuccessful()
        ->assertJsonPath('meta.total', 3);
});

it('returns empty paginated response when user has no orders', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'sanctum')->getJson('/api/orders');

    $response->assertSuccessful()
        ->assertJsonCount(0, 'data')
        ->assertJsonPath('meta.total', 0);
});
