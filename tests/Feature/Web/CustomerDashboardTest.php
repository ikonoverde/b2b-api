<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;

it('requires authentication', function () {
    $response = $this->get('/dashboard');

    $response->assertRedirect('/login');
});

it('shows customer dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('CustomerDashboard')
            ->has('featuredProducts')
            ->has('profile')
        );
});

it('shows profile stats', function () {
    $user = User::factory()->create();
    Order::factory(3)->create(['user_id' => $user->id, 'total_amount' => 100]);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertInertia(fn ($page) => $page
        ->where('profile.orders_count', 3)
        ->where('profile.total_spent', 300)
    );
});

it('shows featured products', function () {
    $user = User::factory()->create();
    Product::factory(3)->create(['is_active' => true, 'is_featured' => true]);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertInertia(fn ($page) => $page
        ->has('featuredProducts', 3)
    );
});
