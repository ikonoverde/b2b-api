<?php

use App\Models\User;

describe('GET /forgot-password', function () {
    it('renders the forgot password page for guests', function () {
        $response = $this->get('/forgot-password');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Auth/ForgotPassword')
            );
    });

    it('redirects authenticated users to dashboard', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/forgot-password');

        $response->assertRedirect('/dashboard');
    });
});
