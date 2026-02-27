<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('refreshes token and returns new token with user data', function () {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $response = $this->postJson('/api/token/refresh');

    $response->assertSuccessful()
        ->assertJsonStructure([
            'user' => ['id', 'name', 'email', 'rfc', 'phone', 'created_at'],
            'token',
        ])
        ->assertJsonPath('user.email', $user->email);
});

it('invalidates the old token after refresh', function () {
    $user = User::factory()->create();

    // Create initial token
    $initialToken = $user->createToken('mobile-app')->plainTextToken;

    expect($user->tokens()->count())->toBe(1);

    // Use the initial token to refresh
    $response = $this->withHeader('Authorization', 'Bearer '.$initialToken)
        ->postJson('/api/token/refresh');

    $response->assertSuccessful();

    // Old token should be deleted, new one created
    expect($user->tokens()->count())->toBe(1);

    $newToken = $response->json('token');
    expect($newToken)->not->toBe($initialToken);
});

it('returns unauthorized for unauthenticated request', function () {
    $response = $this->postJson('/api/token/refresh');

    $response->assertUnauthorized();
});

it('returns a valid token that can authenticate subsequent requests', function () {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $refreshResponse = $this->postJson('/api/token/refresh');

    $refreshResponse->assertSuccessful();

    $newToken = $refreshResponse->json('token');

    // Use the new token to make an authenticated request
    $userResponse = $this->withHeader('Authorization', 'Bearer '.$newToken)
        ->getJson('/api/user');

    $userResponse->assertSuccessful()
        ->assertJsonPath('data.email', $user->email);
});

it('deletes the old token and creates exactly one new token', function () {
    $user = User::factory()->create();

    // Create initial token
    $initialToken = $user->createToken('mobile-app')->plainTextToken;

    expect($user->tokens()->count())->toBe(1);

    // Use the initial token to refresh
    $response = $this->withHeader('Authorization', 'Bearer '.$initialToken)
        ->postJson('/api/token/refresh');

    $response->assertSuccessful();

    // Should still have exactly 1 token (old deleted, new created)
    expect($user->tokens()->count())->toBe(1);

    $newToken = $response->json('token');
    expect($newToken)->not->toBe($initialToken);
});
