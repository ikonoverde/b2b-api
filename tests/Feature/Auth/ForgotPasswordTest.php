<?php

use App\Models\User;
use Illuminate\Support\Facades\Notification;

describe('POST /api/forgot-password', function () {
    it('returns 200 for a valid email that exists', function () {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'john@example.com',
        ]);

        $response = $this->postJson('/api/forgot-password', [
            'email' => 'john@example.com',
        ]);

        $response->assertOk()
            ->assertJsonPath('message', 'If an account exists with that email, a reset link has been sent.');

        Notification::assertSentTo($user, \Illuminate\Auth\Notifications\ResetPassword::class);
    });

    it('returns 200 even when email does not exist to prevent enumeration', function () {
        Notification::fake();

        $response = $this->postJson('/api/forgot-password', [
            'email' => 'nonexistent@example.com',
        ]);

        $response->assertOk()
            ->assertJsonPath('message', 'If an account exists with that email, a reset link has been sent.');

        Notification::assertNothingSent();
    });

    it('returns validation error when email is missing', function () {
        $response = $this->postJson('/api/forgot-password', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    });

    it('returns validation error when email is invalid', function () {
        $response = $this->postJson('/api/forgot-password', [
            'email' => 'not-an-email',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    });
});
