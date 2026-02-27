<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

describe('POST /api/password/reset/confirm', function () {
    it('resets the password with a valid token', function () {
        $user = User::factory()->create([
            'email' => 'john@example.com',
        ]);

        $token = Password::createToken($user);

        $response = $this->postJson('/api/password/reset/confirm', [
            'token' => $token,
            'email' => 'john@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertOk()
            ->assertJsonPath('message', 'Password has been reset successfully.');

        $user->refresh();
        expect(Hash::check('newpassword123', $user->password))->toBeTrue();
    });

    it('invalidates all existing tokens after password reset', function () {
        $user = User::factory()->create([
            'email' => 'john@example.com',
        ]);

        $user->createToken('device-1');
        $user->createToken('device-2');
        $user->createToken('device-3');

        expect($user->tokens()->count())->toBe(3);

        $token = Password::createToken($user);

        $this->postJson('/api/password/reset/confirm', [
            'token' => $token,
            'email' => 'john@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ])->assertOk();

        $user->refresh();
        expect($user->tokens()->count())->toBe(0);
    });

    it('returns 400 with an invalid token', function () {
        User::factory()->create([
            'email' => 'john@example.com',
        ]);

        $response = $this->postJson('/api/password/reset/confirm', [
            'token' => 'invalid-token',
            'email' => 'john@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertBadRequest()
            ->assertJsonPath('message', 'The provided token is invalid.');
    });

    it('returns 400 with an expired token', function () {
        $user = User::factory()->create([
            'email' => 'john@example.com',
        ]);

        $token = Password::createToken($user);

        // Simulate token expiration by manipulating the created_at timestamp
        \DB::table('password_reset_tokens')
            ->where('email', 'john@example.com')
            ->update(['created_at' => now()->subMinutes(61)]);

        $response = $this->postJson('/api/password/reset/confirm', [
            'token' => $token,
            'email' => 'john@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        // Laravel returns INVALID_TOKEN for both invalid and expired tokens
        $response->assertBadRequest()
            ->assertJsonPath('message', 'The provided token is invalid.');
    });

    it('returns 400 when email does not exist', function () {
        $response = $this->postJson('/api/password/reset/confirm', [
            'token' => 'some-token',
            'email' => 'nonexistent@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertBadRequest()
            ->assertJsonPath('message', 'We could not find a user with that email address.');
    });

    it('returns 422 when required fields are missing', function () {
        $response = $this->postJson('/api/password/reset/confirm', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['token', 'email', 'password']);
    });

    it('returns 422 when email is invalid', function () {
        $response = $this->postJson('/api/password/reset/confirm', [
            'token' => 'some-token',
            'email' => 'not-an-email',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    });

    it('returns 422 when password is too short', function () {
        $response = $this->postJson('/api/password/reset/confirm', [
            'token' => 'some-token',
            'email' => 'john@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    });

    it('returns 422 when password has no letters', function () {
        $response = $this->postJson('/api/password/reset/confirm', [
            'token' => 'some-token',
            'email' => 'john@example.com',
            'password' => '12345678',
            'password_confirmation' => '12345678',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    });

    it('returns 422 when password has no numbers', function () {
        $response = $this->postJson('/api/password/reset/confirm', [
            'token' => 'some-token',
            'email' => 'john@example.com',
            'password' => 'passwordonly',
            'password_confirmation' => 'passwordonly',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    });

    it('returns 422 when password confirmation does not match', function () {
        $response = $this->postJson('/api/password/reset/confirm', [
            'token' => 'some-token',
            'email' => 'john@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'differentpassword',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    });
});
