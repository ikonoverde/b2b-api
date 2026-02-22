<?php

use App\Models\User;

it('requires authentication', function () {
    $response = $this->get('/orders');

    $response->assertRedirect('/login');
});

it('shows orders page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/orders');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('Orders/Index'));
});
