<?php

use App\Models\User;

it('registers a new user and returns a token', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Mi Spa & Bienestar',
        'rfc' => 'XAXX010101000',
        'email' => 'john@example.com',
        'phone' => '+52 55 1234 5678',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'terms_accepted' => true,
        'device_name' => 'iPhone 15',
    ]);

    $response->assertCreated()
        ->assertJsonStructure([
            'user' => ['id', 'name', 'rfc', 'email', 'phone', 'created_at'],
            'token',
        ])
        ->assertJsonPath('user.name', 'Mi Spa & Bienestar')
        ->assertJsonPath('user.rfc', 'XAXX010101000')
        ->assertJsonPath('user.email', 'john@example.com')
        ->assertJsonPath('user.phone', '+52 55 1234 5678');

    $this->assertDatabaseHas('users', [
        'name' => 'Mi Spa & Bienestar',
        'rfc' => 'XAXX010101000',
        'email' => 'john@example.com',
        'phone' => '+52 55 1234 5678',
    ]);
});

it('returns validation error for invalid email', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Mi Spa & Bienestar',
        'rfc' => 'XAXX010101000',
        'email' => 'not-an-email',
        'phone' => '+52 55 1234 5678',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'terms_accepted' => true,
        'device_name' => 'iPhone 15',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

it('returns validation error for duplicate email', function () {
    User::factory()->create(['email' => 'john@example.com']);

    $response = $this->postJson('/api/register', [
        'name' => 'Mi Spa & Bienestar',
        'rfc' => 'XAXX010101000',
        'email' => 'john@example.com',
        'phone' => '+52 55 1234 5678',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'terms_accepted' => true,
        'device_name' => 'iPhone 15',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

it('returns validation error for password mismatch', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Mi Spa & Bienestar',
        'rfc' => 'XAXX010101000',
        'email' => 'john@example.com',
        'phone' => '+52 55 1234 5678',
        'password' => 'password123',
        'password_confirmation' => 'different123',
        'terms_accepted' => true,
        'device_name' => 'iPhone 15',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['password']);
});

it('returns validation error for short password', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Mi Spa & Bienestar',
        'rfc' => 'XAXX010101000',
        'email' => 'john@example.com',
        'phone' => '+52 55 1234 5678',
        'password' => 'short',
        'password_confirmation' => 'short',
        'terms_accepted' => true,
        'device_name' => 'iPhone 15',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['password']);
});

it('returns validation errors for missing fields', function () {
    $response = $this->postJson('/api/register', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'rfc', 'email', 'phone', 'password', 'terms_accepted', 'device_name']);
});

it('returns a token that can authenticate to /api/user', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Mi Spa & Bienestar',
        'rfc' => 'XAXX010101000',
        'email' => 'john@example.com',
        'phone' => '+52 55 1234 5678',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'terms_accepted' => true,
        'device_name' => 'iPhone 15',
    ]);

    $response->assertCreated();

    $token = $response->json('token');

    $userResponse = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/user');

    $userResponse->assertSuccessful()
        ->assertJsonPath('data.email', 'john@example.com');
});

it('returns validation error for invalid RFC format', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Mi Spa & Bienestar',
        'rfc' => 'invalid-rfc',
        'email' => 'john@example.com',
        'phone' => '+52 55 1234 5678',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'terms_accepted' => true,
        'device_name' => 'iPhone 15',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['rfc']);
});

it('returns validation error when terms not accepted', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Mi Spa & Bienestar',
        'rfc' => 'XAXX010101000',
        'email' => 'john@example.com',
        'phone' => '+52 55 1234 5678',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'terms_accepted' => false,
        'device_name' => 'iPhone 15',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['terms_accepted']);
});
