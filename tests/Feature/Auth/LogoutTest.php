<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('logs out an authenticated user and invalidates the token', function () {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $response = $this->postJson('/api/logout');

    $response->assertSuccessful()
        ->assertJsonPath('message', 'Successfully logged out.');
});

it('returns unauthorized for unauthenticated request', function () {
    $response = $this->postJson('/api/logout');

    $response->assertUnauthorized();
});

it('invalidates the token so subsequent requests return unauthorized', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'password' => 'password123',
    ]);

    $loginResponse = $this->postJson('/api/login', [
        'email' => 'john@example.com',
        'password' => 'password123',
        'device_name' => 'iPhone 15',
    ]);

    $token = $loginResponse->json('token');

    expect($user->tokens()->count())->toBe(1);

    $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/logout')
        ->assertSuccessful();

    expect($user->tokens()->count())->toBe(0);
});
