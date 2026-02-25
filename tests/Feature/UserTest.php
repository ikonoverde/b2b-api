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

test('unauthenticated user cannot update profile', function () {
    $response = $this->putJson('/api/user', [
        'name' => 'New Name',
        'email' => 'new@example.com',
        'phone' => '+521234567890',
    ]);

    $response->assertStatus(401);
});

test('authenticated user can update their profile', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson('/api/user', [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'phone' => '+529876543210',
    ]);

    $response->assertStatus(200)
        ->assertJsonPath('data.name', 'Updated Name')
        ->assertJsonPath('data.email', 'updated@example.com')
        ->assertJsonPath('data.phone', '+529876543210');

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'phone' => '+529876543210',
    ]);
});

test('update profile response matches user resource structure', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson('/api/user', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '1234567890',
    ]);

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
        ]);
});

test('user can keep their own email when updating', function () {
    $user = User::factory()->create(['email' => 'same@example.com']);

    $response = $this->actingAs($user)->putJson('/api/user', [
        'name' => 'Updated Name',
        'email' => 'same@example.com',
        'phone' => '1234567890',
    ]);

    $response->assertStatus(200)
        ->assertJsonPath('data.email', 'same@example.com');
});

test('user cannot use another users email', function () {
    User::factory()->create(['email' => 'taken@example.com']);
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson('/api/user', [
        'name' => 'Test',
        'email' => 'taken@example.com',
        'phone' => '1234567890',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('email');
});

test('required fields are validated', function (string $field) {
    $user = User::factory()->create();

    $data = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '1234567890',
    ];
    unset($data[$field]);

    $response = $this->actingAs($user)->putJson('/api/user', $data);

    $response->assertStatus(422)
        ->assertJsonValidationErrors($field);
})->with(['name', 'email', 'phone']);

test('email must be valid format', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson('/api/user', [
        'name' => 'Test',
        'email' => 'not-an-email',
        'phone' => '1234567890',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('email');
});

test('name cannot exceed max length', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson('/api/user', [
        'name' => str_repeat('a', 256),
        'email' => 'test@example.com',
        'phone' => '1234567890',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('name');
});

test('phone cannot exceed max length', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson('/api/user', [
        'name' => 'Test',
        'email' => 'test@example.com',
        'phone' => str_repeat('1', 21),
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('phone');
});

test('protected fields are not updatable', function (string $field, mixed $value) {
    $user = User::factory()->create();
    $original = $user->fresh()->$field;

    $this->actingAs($user)->putJson('/api/user', [
        'name' => 'Test',
        'email' => 'test@example.com',
        'phone' => '1234567890',
        $field => $value,
    ]);

    expect($user->fresh()->$field)->toBe($original);
})->with([
    'role' => ['role', 'admin'],
    'is_active' => ['is_active', false],
    'rfc' => ['rfc', 'CHANGED123456'],
    'password' => ['password', 'newpassword123'],
]);
