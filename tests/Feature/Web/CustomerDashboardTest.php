<?php

use App\Models\Banner;
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

it('shows active banners', function () {
    $user = User::factory()->create();
    Banner::factory(2)->create(['is_active' => true]);
    Banner::factory()->create(['is_active' => false]);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertInertia(fn ($page) => $page
        ->missing('banners')
        ->loadDeferredProps(fn ($reload) => $reload
            ->has('banners', 2)
        )
    );
});

it('shows banners in display order', function () {
    $user = User::factory()->create();
    Banner::factory()->create(['is_active' => true, 'display_order' => 2, 'title' => 'Second']);
    Banner::factory()->create(['is_active' => true, 'display_order' => 1, 'title' => 'First']);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertInertia(fn ($page) => $page
        ->missing('banners')
        ->loadDeferredProps(fn ($reload) => $reload
            ->has('banners', 2)
            ->where('banners.0.title', 'First')
            ->where('banners.1.title', 'Second')
        )
    );
});
