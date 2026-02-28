<?php

use App\Models\User;

describe('GET /account/addresses', function () {
    it('requires authentication to access addresses page', function () {
        $response = $this->get('/account/addresses');

        $response->assertRedirect('/login');
    });

    it('renders the addresses page for authenticated users', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/account/addresses');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Addresses')
            );
    });

    it('includes user data in the page props', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/account/addresses');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('auth.user')
                ->where('auth.user.id', $user->id)
                ->where('auth.user.name', $user->name)
                ->where('auth.user.email', $user->email)
            );
    });
});
