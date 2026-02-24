<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

describe('Password Reset Pages', function () {
    it('renders the reset password form', function () {
        $response = $this->get('/reset-password/test-token?email=user@example.com');

        $response->assertOk();
        $response->assertSee('Restablecer contrasena');
        $response->assertSee('Ingresa tu nueva contrasena para continuar.');
    });

    it('resets the password with a valid token', function () {
        $user = User::factory()->create([
            'email' => 'john@example.com',
        ]);

        $token = Password::createToken($user);

        $response = $this->post('/reset-password', [
            'token' => $token,
            'email' => 'john@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertOk();
        $response->assertSee('Contrasena restablecida');
        $response->assertSee('Vuelve a la app para iniciar sesion.');

        $user->refresh();
        expect(Hash::check('newpassword123', $user->password))->toBeTrue();
    });

    it('shows error with an invalid token', function () {
        User::factory()->create([
            'email' => 'john@example.com',
        ]);

        $response = $this->post('/reset-password', [
            'token' => 'invalid-token',
            'email' => 'john@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertRedirect();
    });

    it('returns validation error when password is too short', function () {
        $response = $this->post('/reset-password', [
            'token' => 'test-token',
            'email' => 'john@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertSessionHasErrors(['password']);
    });

    it('returns validation error when passwords do not match', function () {
        $response = $this->post('/reset-password', [
            'token' => 'test-token',
            'email' => 'john@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'differentpassword',
        ]);

        $response->assertSessionHasErrors(['password']);
    });

    it('renders the success page after successful reset', function () {
        $user = User::factory()->create([
            'email' => 'john@example.com',
        ]);

        $token = Password::createToken($user);

        $response = $this->post('/reset-password', [
            'token' => $token,
            'email' => 'john@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertOk();
        $response->assertSee('Contrasena restablecida');
    });
});
