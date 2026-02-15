<?php

use App\Models\User;

it('logs in a user and returns a token', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'password' => 'password123',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'john@example.com',
        'password' => 'password123',
        'device_name' => 'iPhone 15',
    ]);

    $response->assertSuccessful()
        ->assertJsonStructure([
            'user' => ['id', 'name', 'email', 'created_at'],
            'token',
        ])
        ->assertJsonPath('user.email', 'john@example.com');
});

it('returns validation error for wrong password', function () {
    User::factory()->create([
        'email' => 'john@example.com',
        'password' => 'password123',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'john@example.com',
        'password' => 'wrongpassword',
        'device_name' => 'iPhone 15',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email'])
        ->assertJsonPath('errors.email.0', 'The provided credentials are incorrect.');
});

it('returns validation error for non-existent email', function () {
    $response = $this->postJson('/api/login', [
        'email' => 'nonexistent@example.com',
        'password' => 'password123',
        'device_name' => 'iPhone 15',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email'])
        ->assertJsonPath('errors.email.0', 'The provided credentials are incorrect.');
});

it('returns validation errors for missing fields', function () {
    $response = $this->postJson('/api/login', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'password', 'device_name']);
});

it('returns a token that can authenticate to /api/user', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'password' => 'password123',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'john@example.com',
        'password' => 'password123',
        'device_name' => 'iPhone 15',
    ]);

    $response->assertSuccessful();

    $token = $response->json('token');

    $userResponse = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/user');

    $userResponse->assertSuccessful()
        ->assertJsonPath('data.email', 'john@example.com');
});

it('prevents deactivated user from logging in via api', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'password' => 'password123',
        'is_active' => false,
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'john@example.com',
        'password' => 'password123',
        'device_name' => 'iPhone 15',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email'])
        ->assertJsonPath('errors.email.0', 'Your account has been deactivated. Please contact the administrator.');
});
