<?php

use App\Models\User;

it('shows the registration page to guests', function () {
    $response = $this->get('/register');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('Auth/Register'));
});

it('redirects authenticated users away from register page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/register');

    $response->assertRedirect();
});

it('registers a new user successfully', function () {
    $response = $this->post('/register', [
        'name' => 'Mi Spa & Bienestar',
        'rfc' => 'XAXX010101000',
        'email' => 'nuevo@example.com',
        'phone' => '+52 55 1234 5678',
        'password' => 'password123',
        'terms_accepted' => true,
    ]);

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticated();

    $this->assertDatabaseHas('users', [
        'name' => 'Mi Spa & Bienestar',
        'rfc' => 'XAXX010101000',
        'email' => 'nuevo@example.com',
    ]);
});

it('fails registration with missing required fields', function () {
    $response = $this->post('/register', []);

    $response->assertSessionHasErrors(['name', 'rfc', 'email', 'phone', 'password', 'terms_accepted']);
    $this->assertGuest();
});

it('fails registration with invalid RFC', function () {
    $response = $this->post('/register', [
        'name' => 'Test Business',
        'rfc' => 'invalid',
        'email' => 'test@example.com',
        'phone' => '1234567890',
        'password' => 'password123',
        'terms_accepted' => true,
    ]);

    $response->assertSessionHasErrors(['rfc']);
});

it('fails registration with duplicate email', function () {
    User::factory()->create(['email' => 'taken@example.com']);

    $response = $this->post('/register', [
        'name' => 'Test Business',
        'rfc' => 'XAXX010101000',
        'email' => 'taken@example.com',
        'phone' => '1234567890',
        'password' => 'password123',
        'terms_accepted' => true,
    ]);

    $response->assertSessionHasErrors(['email']);
});

it('fails registration without accepting terms', function () {
    $response = $this->post('/register', [
        'name' => 'Test Business',
        'rfc' => 'XAXX010101000',
        'email' => 'test@example.com',
        'phone' => '1234567890',
        'password' => 'password123',
        'terms_accepted' => false,
    ]);

    $response->assertSessionHasErrors(['terms_accepted']);
});
