<?php

use App\Models\Order;
use App\Models\User;

it('shares admin navigation access for admin users', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get('/');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('auth.canAccessAdmin', true)
        );
});

it('shares admin navigation access for super admin users', function () {
    $user = User::factory()->superAdmin()->create();

    $response = $this->actingAs($user)->get('/');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('auth.canAccessAdmin', true)
        );
});

it('shares the admin orders count from order records on admin pages', function () {
    $admin = User::factory()->admin()->create();
    Order::factory(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('adminNavigation.ordersCount', 3)
        );
});

it('does not share admin navigation access for customers', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('auth.canAccessAdmin', false)
        );
});

it('does not share admin navigation access for guests', function () {
    $response = $this->get('/');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('auth.user', null)
            ->where('auth.canAccessAdmin', false)
        );
});
