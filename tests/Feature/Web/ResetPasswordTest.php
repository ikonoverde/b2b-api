<?php

describe('Password Reset Pages', function () {
    it('renders the reset password Inertia page with token and email props', function () {
        $response = $this->get('/reset-password/test-token?email=user@example.com');

        $response->assertOk();
        $response->assertInertia(function ($page) {
            $page->component('Auth/ResetPassword')
                ->has('token')
                ->has('email')
                ->where('token', 'test-token')
                ->where('email', 'user@example.com');
        });
    });

    it('renders the reset password Inertia page with empty email when not provided', function () {
        $response = $this->get('/reset-password/test-token');

        $response->assertOk();
        $response->assertInertia(function ($page) {
            $page->component('Auth/ResetPassword')
                ->where('token', 'test-token')
                ->where('email', '');
        });
    });

    it('returns 200 for the reset password route', function () {
        $response = $this->get('/reset-password/some-token?email=test@example.com');

        $response->assertOk();
    });
});
