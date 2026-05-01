<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

it('requires authentication to change password', function () {
    $response = $this->put('/account/password', [
        'current_password' => 'password123!',
        'password' => 'newPassword1',
        'password_confirmation' => 'newPassword1',
    ]);

    $response->assertRedirect('/login');
});

it('allows an authenticated user to change their password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('currentPassword1'),
    ]);

    $response = $this->actingAs($user)->put('/account/password', [
        'current_password' => 'currentPassword1',
        'password' => 'newPassword1',
        'password_confirmation' => 'newPassword1',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    expect(Hash::check('newPassword1', $user->fresh()->password))->toBeTrue();
});

it('rejects an incorrect current password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('currentPassword1'),
    ]);

    $response = $this->actingAs($user)->put('/account/password', [
        'current_password' => 'wrongPassword1',
        'password' => 'newPassword1',
        'password_confirmation' => 'newPassword1',
    ]);

    $response->assertSessionHasErrors('current_password');
    expect(Hash::check('currentPassword1', $user->fresh()->password))->toBeTrue();
});

it('requires the new password to be confirmed', function () {
    $user = User::factory()->create([
        'password' => Hash::make('currentPassword1'),
    ]);

    $response = $this->actingAs($user)->put('/account/password', [
        'current_password' => 'currentPassword1',
        'password' => 'newPassword1',
        'password_confirmation' => 'differentPassword1',
    ]);

    $response->assertSessionHasErrors('password');
});
