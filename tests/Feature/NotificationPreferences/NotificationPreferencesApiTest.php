<?php

use App\Models\User;

// ============================================================================
// GET NOTIFICATION PREFERENCES
// ============================================================================

test('unauthenticated user cannot get notification preferences', function () {
    $response = $this->getJson('/api/notification-preferences');

    $response->assertUnauthorized();
});

test('authenticated user can get notification preferences', function () {
    $user = User::factory()->create([
        'notify_order_updates' => true,
        'notify_promotional_emails' => false,
        'notify_newsletter' => true,
    ]);

    $response = $this->actingAs($user)->getJson('/api/notification-preferences');

    $response->assertSuccessful();
    $response->assertJsonPath('data.notify_order_updates', true);
    $response->assertJsonPath('data.notify_promotional_emails', false);
    $response->assertJsonPath('data.notify_newsletter', true);
});

test('get notification preferences returns default values', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/notification-preferences');

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'data' => [
            'notify_order_updates',
            'notify_promotional_emails',
            'notify_newsletter',
        ],
    ]);
});

// ============================================================================
// UPDATE NOTIFICATION PREFERENCES
// ============================================================================

test('unauthenticated user cannot update notification preferences', function () {
    $response = $this->putJson('/api/notification-preferences', [
        'notify_order_updates' => false,
    ]);

    $response->assertUnauthorized();
});

test('authenticated user can update all notification preferences', function () {
    $user = User::factory()->create([
        'notify_order_updates' => true,
        'notify_promotional_emails' => true,
        'notify_newsletter' => true,
    ]);

    $response = $this->actingAs($user)->putJson('/api/notification-preferences', [
        'notify_order_updates' => false,
        'notify_promotional_emails' => false,
        'notify_newsletter' => false,
    ]);

    $response->assertSuccessful();
    $response->assertJsonPath('data.notify_order_updates', false);
    $response->assertJsonPath('data.notify_promotional_emails', false);
    $response->assertJsonPath('data.notify_newsletter', false);

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'notify_order_updates' => false,
        'notify_promotional_emails' => false,
        'notify_newsletter' => false,
    ]);
});

test('authenticated user can partially update notification preferences', function () {
    $user = User::factory()->create([
        'notify_order_updates' => true,
        'notify_promotional_emails' => true,
        'notify_newsletter' => true,
    ]);

    $response = $this->actingAs($user)->putJson('/api/notification-preferences', [
        'notify_newsletter' => false,
    ]);

    $response->assertSuccessful();
    $response->assertJsonPath('data.notify_order_updates', true);
    $response->assertJsonPath('data.notify_promotional_emails', true);
    $response->assertJsonPath('data.notify_newsletter', false);

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'notify_order_updates' => true,
        'notify_promotional_emails' => true,
        'notify_newsletter' => false,
    ]);
});

test('update notification preferences validates boolean fields', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson('/api/notification-preferences', [
        'notify_order_updates' => 'not-a-boolean',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['notify_order_updates']);
});

test('update notification preferences with empty body keeps existing values', function () {
    $user = User::factory()->create([
        'notify_order_updates' => true,
        'notify_promotional_emails' => false,
        'notify_newsletter' => true,
    ]);

    $response = $this->actingAs($user)->putJson('/api/notification-preferences', []);

    $response->assertSuccessful();
    $response->assertJsonPath('data.notify_order_updates', true);
    $response->assertJsonPath('data.notify_promotional_emails', false);
    $response->assertJsonPath('data.notify_newsletter', true);
});
