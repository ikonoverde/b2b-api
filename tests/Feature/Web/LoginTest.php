<?php

use App\Models\User;

it('shows the login page to guests', function () {
    $response = $this->get('/admin/login');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('Auth/Login'));
});

it('redirects authenticated users away from login page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/admin/login');

    $response->assertRedirect();
});

it('logs in a user with valid credentials', function () {
    $user = User::factory()->create([
        'password' => 'password123',
    ]);

    $response = $this->post('/admin/login', [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertRedirect(route('admin.dashboard'));
    $this->assertAuthenticatedAs($user);
});

it('fails login with wrong password', function () {
    $user = User::factory()->create([
        'password' => 'password123',
    ]);

    $response = $this->post('/admin/login', [
        'email' => $user->email,
        'password' => 'wrongpassword',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

it('prevents deactivated user from logging in', function () {
    $user = User::factory()->inactive()->create([
        'password' => 'password123',
    ]);

    $response = $this->post('/admin/login', [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});
