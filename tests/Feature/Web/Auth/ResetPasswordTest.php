<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

describe('POST /reset-password', function () {
    it('resets password with valid token', function () {
        $user = User::factory()->create();
        $token = Password::createToken($user);

        $response = $this->post('/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'NewPass123',
            'password_confirmation' => 'NewPass123',
        ]);

        $response->assertRedirect('/login');
        $response->assertSessionHas('success');

        $user->refresh();
        expect(Hash::check('NewPass123', $user->password))->toBeTrue();
    });

    it('invalidates api tokens on password reset', function () {
        $user = User::factory()->create();
        $user->createToken('test-token');
        $token = Password::createToken($user);

        $this->post('/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'NewPass123',
            'password_confirmation' => 'NewPass123',
        ]);

        expect($user->tokens()->count())->toBe(0);
    });

    it('fails with invalid token', function () {
        $user = User::factory()->create();

        $response = $this->post('/reset-password', [
            'token' => 'invalid-token',
            'email' => $user->email,
            'password' => 'NewPass123',
            'password_confirmation' => 'NewPass123',
        ]);

        $response->assertSessionHasErrors('email');
    });

    it('fails with non-existent email', function () {
        $response = $this->post('/reset-password', [
            'token' => 'some-token',
            'email' => 'nonexistent@example.com',
            'password' => 'NewPass123',
            'password_confirmation' => 'NewPass123',
        ]);

        $response->assertSessionHasErrors('email');
    });

    it('validates password confirmation matches', function () {
        $user = User::factory()->create();
        $token = Password::createToken($user);

        $response = $this->post('/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'NewPass123',
            'password_confirmation' => 'DifferentPass123',
        ]);

        $response->assertSessionHasErrors('password');
    });

    it('validates password minimum requirements', function () {
        $user = User::factory()->create();
        $token = Password::createToken($user);

        $response = $this->post('/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertSessionHasErrors('password');
    });

    it('validates required fields', function () {
        $response = $this->post('/reset-password', []);

        $response->assertSessionHasErrors(['token', 'email', 'password']);
    });

    it('redirects authenticated users', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/reset-password', [
            'token' => 'token',
            'email' => $user->email,
            'password' => 'NewPass123',
            'password_confirmation' => 'NewPass123',
        ]);

        $response->assertRedirect('/dashboard');
    });
});
