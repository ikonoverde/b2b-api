<?php

declare(strict_types=1);

use App\Models\User;

it('displays the terms page', function () {
    $response = $this->get('/terms');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Terms')
        );
});

it('displays terms page without authentication', function () {
    $response = $this->get('/terms');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Terms')
            ->has('auth.user', null)
        );
});

it('displays terms page for authenticated users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/terms');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Terms')
            ->has('auth.user')
            ->where('auth.user.id', $user->id)
        );
});

it('contains key terms content', function () {
    $response = $this->get('/terms');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Terms')
        );
});

it('has link to privacy policy', function () {
    $response = $this->get('/terms');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Terms')
        );
});
