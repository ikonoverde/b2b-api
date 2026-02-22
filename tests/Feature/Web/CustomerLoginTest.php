<?php

use App\Models\User;

it('shows the customer login page to guests', function () {
    $response = $this->get('/login');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Auth/Login')
            ->where('postUrl', '/login')
            ->where('registerUrl', '/register')
        );
});

it('redirects authenticated users away from login page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/login');

    $response->assertRedirect();
});

it('logs in a customer and redirects to customer dashboard', function () {
    $user = User::factory()->create([
        'password' => 'password123',
        'role' => 'customer',
    ]);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($user);
});

it('fails login with wrong password', function () {
    $user = User::factory()->create(['password' => 'password123']);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrongpassword',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

it('prevents deactivated user from logging in', function () {
    $user = User::factory()->inactive()->create(['password' => 'password123']);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

it('customer logout redirects to home', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $response->assertRedirect(route('home'));
    $this->assertGuest();
});
