<?php

use App\Models\User;

test('authenticated user can get their profile', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/user');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'email',
                'rfc',
                'phone',
                'created_at',
            ],
        ])
        ->assertJsonPath('data.id', $user->id)
        ->assertJsonPath('data.email', $user->email);
});

test('unauthenticated user cannot get profile', function () {
    $response = $this->getJson('/api/user');

    $response->assertStatus(401);
});
