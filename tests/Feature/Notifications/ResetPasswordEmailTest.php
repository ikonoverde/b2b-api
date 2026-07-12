<?php

use App\Models\User;
use App\Notifications\Auth\ResetPassword;

it('renders the reset password email in spanish with the brand template', function () {
    $user = User::factory()->create([
        'name' => 'Cliente Prueba',
        'email' => 'cliente@example.com',
    ]);

    $notification = new ResetPassword('reset-token-123');

    $mailMessage = $notification->toMail($user);
    $rendered = (string) $mailMessage->render();

    expect($mailMessage->subject)->toBe('Restablece tu contraseña');

    expect($rendered)
        ->toContain('Restablece tu contraseña')
        ->toContain('Cliente Prueba')
        ->toContain('cliente@example.com')
        ->toContain('Recibimos una solicitud para restablecer la contraseña')
        ->toContain('Si no solicitaste este cambio')
        ->toContain('60 minutos')
        ->toContain('Seguridad de la cuenta')
        ->toContain('#006871');
});

it('links to the password reset page with the token', function () {
    $user = User::factory()->create(['email' => 'cliente@example.com']);

    $rendered = (string) (new ResetPassword('reset-token-123'))->toMail($user)->render();

    expect($rendered)
        ->toContain(route('password.reset', ['token' => 'reset-token-123', 'email' => 'cliente@example.com']));
});

it('leaves no english copy from the framework default', function () {
    $user = User::factory()->create();

    $rendered = (string) (new ResetPassword('reset-token-123'))->toMail($user)->render();

    expect($rendered)
        ->not->toContain('Reset Password')
        ->not->toContain('You are receiving this email')
        ->not->toContain('If you did not request a password reset')
        ->not->toContain('Regards')
        ->not->toContain('All rights reserved');
});
