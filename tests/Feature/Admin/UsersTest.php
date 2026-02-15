<?php

use App\Models\User;

test('admin can view users page', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/admin/users');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/users/Index')
        ->has('users')
    );
});

test('super_admin can view users page', function () {
    $superAdmin = User::factory()->superAdmin()->create();

    $response = $this->actingAs($superAdmin)->get('/admin/users');

    $response->assertSuccessful();
});

test('customer cannot access users page', function () {
    $customer = User::factory()->create();

    $response = $this->actingAs($customer)->get('/admin/users');

    $response->assertForbidden();
});

test('unauthenticated user is redirected to login', function () {
    $response = $this->get('/admin/users');

    $response->assertRedirect('/admin/login');
});

test('users page returns paginated users', function () {
    $admin = User::factory()->admin()->create();
    User::factory(20)->create();

    $response = $this->actingAs($admin)->get('/admin/users?per_page=10');

    $response->assertInertia(fn ($page) => $page
        ->where('users.per_page', 10)
        ->where('users.total', 21)
        ->where('users.data', fn ($data) => count($data) === 10)
    );
});

test('users page respects sort_by parameter', function () {
    $admin = User::factory()->admin()->create();
    $userA = User::factory()->create(['name' => 'Alice', 'created_at' => now()->subDay()]);
    $userB = User::factory()->create(['name' => 'Bob', 'created_at' => now()]);

    $response = $this->actingAs($admin)->get('/admin/users?sort_by=name&sort_order=asc');

    $response->assertInertia(fn ($page) => $page
        ->where('users.data.0.name', 'Alice')
    );
});

test('users page defaults to created_at desc sorting', function () {
    $admin = User::factory()->admin()->create();
    $userOld = User::factory()->create(['name' => 'Old User', 'created_at' => now()->subDays(5)]);
    $userNew = User::factory()->create(['name' => 'New User', 'created_at' => now()->addDay()]);

    $response = $this->actingAs($admin)->get('/admin/users');

    $response->assertInertia(fn ($page) => $page
        ->where('users.data.0.name', 'New User')
    );
});

test('inactive users are visible in list', function () {
    $admin = User::factory()->admin()->create();
    $inactiveUser = User::factory()->inactive()->create();

    $response = $this->actingAs($admin)->get('/admin/users');

    $response->assertInertia(fn ($page) => $page
        ->where('users.data', fn ($data) => collect($data)->contains('id', $inactiveUser->id))
    );
});
