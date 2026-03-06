<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

describe('POST /forgot-password', function () {
    it('sends a reset link for a valid email', function () {
        Notification::fake();

        $user = User::factory()->create();

        $response = $this->post('/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('password_status', 'sent');

        Notification::assertSentTo($user, ResetPassword::class);
    });

    it('returns sent status even for non-existent email', function () {
        Notification::fake();

        $response = $this->post('/forgot-password', [
            'email' => 'nonexistent@example.com',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('password_status', 'sent');

        Notification::assertNothingSent();
    });

    it('validates email is required', function () {
        $response = $this->post('/forgot-password', [
            'email' => '',
        ]);

        $response->assertSessionHasErrors('email');
    });

    it('validates email format', function () {
        $response = $this->post('/forgot-password', [
            'email' => 'not-an-email',
        ]);

        $response->assertSessionHasErrors('email');
    });

    it('returns error when throttled', function () {
        $user = User::factory()->create();

        // First request succeeds
        $this->post('/forgot-password', ['email' => $user->email]);

        // Second request should be throttled
        $response = $this->post('/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertSessionHasErrors('email');
    });

    it('redirects authenticated users', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertRedirect('/dashboard');
    });
});
