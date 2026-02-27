<?php

use App\Models\Order;
use App\Models\User;

test('admin can view orders page', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/admin/orders');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/orders/Index')
        ->has('orders')
        ->has('filters')
    );
});

test('super_admin can view orders page', function () {
    $superAdmin = User::factory()->superAdmin()->create();

    $response = $this->actingAs($superAdmin)->get('/admin/orders');

    $response->assertSuccessful();
});

test('customer cannot access orders page', function () {
    $customer = User::factory()->create();

    $response = $this->actingAs($customer)->get('/admin/orders');

    $response->assertForbidden();
});

test('unauthenticated user is redirected to login', function () {
    $response = $this->get('/admin/orders');

    $response->assertRedirect('/admin/login');
});

test('orders page returns paginated orders', function () {
    $admin = User::factory()->admin()->create();
    Order::factory(20)->create();

    $response = $this->actingAs($admin)->get('/admin/orders?per_page=10');

    $response->assertInertia(fn ($page) => $page
        ->where('orders.per_page', 10)
        ->where('orders.total', 20)
        ->where('orders.data', fn ($data) => count($data) === 10)
    );
});

test('orders page defaults to created_at desc sorting', function () {
    $admin = User::factory()->admin()->create();
    Order::factory()->create(['total_amount' => 100, 'created_at' => now()->subDays(5)]);
    $newOrder = Order::factory()->create(['total_amount' => 200, 'created_at' => now()->addDay()]);

    $response = $this->actingAs($admin)->get('/admin/orders');

    $response->assertInertia(fn ($page) => $page
        ->where('orders.data.0.id', $newOrder->id)
    );
});

test('orders page can sort by total_amount', function () {
    $admin = User::factory()->admin()->create();
    Order::factory()->create(['total_amount' => 500]);
    $cheapOrder = Order::factory()->create(['total_amount' => 10]);

    $response = $this->actingAs($admin)->get('/admin/orders?sort_by=total_amount&sort_order=asc');

    $response->assertInertia(fn ($page) => $page
        ->where('orders.data.0.id', $cheapOrder->id)
    );
});

test('orders page can filter by status', function () {
    $admin = User::factory()->admin()->create();
    Order::factory()->create(['status' => 'pending']);
    Order::factory()->processing()->create();

    $response = $this->actingAs($admin)->get('/admin/orders?status=processing');

    $response->assertInertia(fn ($page) => $page
        ->where('orders.total', 1)
        ->where('orders.data.0.status', 'processing')
    );
});

test('orders page can filter by payment_status', function () {
    $admin = User::factory()->admin()->create();
    Order::factory()->create(['payment_status' => 'pending']);
    Order::factory()->create(['payment_status' => 'completed']);

    $response = $this->actingAs($admin)->get('/admin/orders?payment_status=completed');

    $response->assertInertia(fn ($page) => $page
        ->where('orders.total', 1)
        ->where('orders.data.0.payment_status', 'completed')
    );
});

test('orders page can filter by date range', function () {
    $admin = User::factory()->admin()->create();
    Order::factory()->create(['created_at' => now()->subDays(10)]);
    Order::factory()->create(['created_at' => now()]);

    $response = $this->actingAs($admin)->get('/admin/orders?date_from='.now()->subDay()->toDateString());

    $response->assertInertia(fn ($page) => $page
        ->where('orders.total', 1)
    );
});

test('orders page can filter by customer name', function () {
    $admin = User::factory()->admin()->create();
    $userAlice = User::factory()->create(['name' => 'Alice Wonderland']);
    $userBob = User::factory()->create(['name' => 'Bob Builder']);
    Order::factory()->create(['user_id' => $userAlice->id]);
    Order::factory()->create(['user_id' => $userBob->id]);

    $response = $this->actingAs($admin)->get('/admin/orders?customer=Alice');

    $response->assertInertia(fn ($page) => $page
        ->where('orders.total', 1)
    );
});

test('orders page can filter by amount range', function () {
    $admin = User::factory()->admin()->create();
    Order::factory()->create(['total_amount' => 50]);
    Order::factory()->create(['total_amount' => 200]);
    Order::factory()->create(['total_amount' => 500]);

    $response = $this->actingAs($admin)->get('/admin/orders?amount_min=100&amount_max=300');

    $response->assertInertia(fn ($page) => $page
        ->where('orders.total', 1)
    );
});

test('orders page includes user relationship', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->create(['name' => 'Test Customer']);
    Order::factory()->create(['user_id' => $customer->id]);

    $response = $this->actingAs($admin)->get('/admin/orders');

    $response->assertInertia(fn ($page) => $page
        ->where('orders.data.0.user.name', 'Test Customer')
    );
});

test('orders page returns correct filter state', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/admin/orders?status=processing&customer=test');

    $response->assertInertia(fn ($page) => $page
        ->where('filters.status', 'processing')
        ->where('filters.customer', 'test')
    );
});

test('orders page handles invalid sort field gracefully', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/admin/orders?sort_by=invalid_field');

    $response->assertSuccessful();
});
