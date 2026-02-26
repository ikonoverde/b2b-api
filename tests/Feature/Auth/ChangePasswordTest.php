<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

describe('PUT /api/password', function () {
    it('changes the password successfully', function () {
        $user = User::factory()->create([
            'password' => 'oldPassword1',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/password', [
            'current_password' => 'oldPassword1',
            'password' => 'newPassword1',
            'password_confirmation' => 'newPassword1',
        ]);

        $response->assertOk()
            ->assertJsonPath('message', 'Password changed successfully.');

        expect(Hash::check('newPassword1', $user->fresh()->password))->toBeTrue();
    });

    it('invalidates other tokens after password change', function () {
        $user = User::factory()->create([
            'password' => 'oldPassword1',
        ]);

        $user->createToken('old-device');
        $currentToken = $user->createToken('current-device');

        $this->withHeader('Authorization', 'Bearer '.$currentToken->plainTextToken)
            ->putJson('/api/password', [
                'current_password' => 'oldPassword1',
                'password' => 'newPassword1',
                'password_confirmation' => 'newPassword1',
            ])->assertOk();

        expect($user->tokens()->count())->toBe(1)
            ->and($user->tokens()->first()->id)->toBe($currentToken->accessToken->id);
    });

    it('returns 422 when current password is wrong', function () {
        $user = User::factory()->create([
            'password' => 'oldPassword1',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/password', [
            'current_password' => 'wrongPassword',
            'password' => 'newPassword1',
            'password_confirmation' => 'newPassword1',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['current_password']);
    });

    it('returns 422 when required fields are missing', function () {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->putJson('/api/password', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['current_password', 'password']);
    });

    it('returns 422 when password is too short', function () {
        $user = User::factory()->create([
            'password' => 'oldPassword1',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/password', [
            'current_password' => 'oldPassword1',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    });

    it('returns 422 when password confirmation does not match', function () {
        $user = User::factory()->create([
            'password' => 'oldPassword1',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/password', [
            'current_password' => 'oldPassword1',
            'password' => 'newPassword1',
            'password_confirmation' => 'differentPassword',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    });

    it('returns 401 when unauthenticated', function () {
        $response = $this->putJson('/api/password', [
            'current_password' => 'oldPassword1',
            'password' => 'newPassword1',
            'password_confirmation' => 'newPassword1',
        ]);

        $response->assertUnauthorized();
    });
});
