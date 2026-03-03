<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('requires authentication to view notification preferences page', function () {
    $response = $this->get('/account/notifications');

    $response->assertRedirect('/login');
});

it('displays notification preferences for authenticated user', function () {
    $user = User::factory()->create([
        'notify_order_updates' => true,
        'notify_promotional_emails' => false,
        'notify_newsletter' => true,
    ]);

    $response = $this->actingAs($user)->get('/account/notifications');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Account/Notifications')
        ->has('preferences')
        ->where('preferences.notify_order_updates', true)
        ->where('preferences.notify_promotional_emails', false)
        ->where('preferences.notify_newsletter', true)
    );
});

it('updates notification preferences via PUT', function () {
    $user = User::factory()->create([
        'notify_order_updates' => true,
        'notify_promotional_emails' => false,
        'notify_newsletter' => false,
    ]);

    $response = $this->actingAs($user)->putJson('/account/notifications', [
        'notify_order_updates' => false,
        'notify_promotional_emails' => true,
        'notify_newsletter' => true,
    ]);

    $response->assertSuccessful();
    $user->refresh();
    expect($user->notify_order_updates)->toBeFalse();
    expect($user->notify_promotional_emails)->toBeTrue();
    expect($user->notify_newsletter)->toBeTrue();
});

it('validates boolean fields when updating preferences', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson('/account/notifications', [
        'notify_order_updates' => 'not-a-boolean',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['notify_order_updates']);
});

it('allows partial updates of notification preferences', function () {
    $user = User::factory()->create([
        'notify_order_updates' => true,
        'notify_promotional_emails' => false,
        'notify_newsletter' => false,
    ]);

    $response = $this->actingAs($user)->putJson('/account/notifications', [
        'notify_newsletter' => true,
    ]);

    $response->assertSuccessful();
    $user->refresh();
    expect($user->notify_order_updates)->toBeTrue();
    expect($user->notify_promotional_emails)->toBeFalse();
    expect($user->notify_newsletter)->toBeTrue();
});

it('requires authentication to update notification preferences', function () {
    $response = $this->putJson('/account/notifications', [
        'notify_order_updates' => false,
    ]);

    $response->assertUnauthorized();
});
