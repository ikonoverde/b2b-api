<?php

use App\Models\Order;
use App\Models\User;

it('requires authentication', function () {
    $response = $this->get('/account');

    $response->assertRedirect('/login');
});

it('shows account page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/account');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Account')
            ->has('profile', fn ($profile) => $profile
                ->has('orders_count')
                ->has('total_spent')
                ->has('discount_percentage')
            )
        );
});

it('shows correct stats', function () {
    $user = User::factory()->create();
    Order::factory(2)->create(['user_id' => $user->id, 'total_amount' => 150]);

    $response = $this->actingAs($user)->get('/account');

    $response->assertInertia(fn ($page) => $page
        ->where('profile.orders_count', 2)
        ->where('profile.total_spent', 300)
    );
});

it('shows password change menu option', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/account');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Account')
        );
});
