<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('requires authentication to view profile page', function () {
    $response = $this->get('/account/profile');

    $response->assertRedirect('/login');
});

it('displays profile page for authenticated user', function () {
    $user = User::factory()->create([
        'name' => 'Juan Pérez',
        'email' => 'juan@example.com',
        'phone' => '+521234567890',
    ]);

    $response = $this->actingAs($user)->get('/account/profile');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Account/Profile')
        ->has('user')
        ->where('user.name', 'Juan Pérez')
        ->where('user.email', 'juan@example.com')
        ->where('user.phone', '+521234567890')
    );
});

it('includes link to profile page from account page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/account');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Account')
    );
});
