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

test('admin can view user details page', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->get("/admin/users/{$user->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/users/Show')
        ->where('user.id', $user->id)
        ->where('user.name', $user->name)
        ->where('user.email', $user->email)
    );
});

test('super_admin can view user details page', function () {
    $superAdmin = User::factory()->superAdmin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($superAdmin)->get("/admin/users/{$user->id}");

    $response->assertSuccessful();
});

test('customer cannot access user details page', function () {
    $customer = User::factory()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($customer)->get("/admin/users/{$user->id}");

    $response->assertForbidden();
});

test('unauthenticated user is redirected to login when accessing user details', function () {
    $user = User::factory()->create();

    $response = $this->get("/admin/users/{$user->id}");

    $response->assertRedirect('/admin/login');
});

test('user details returns 404 for non-existent user', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/admin/users/99999');

    $response->assertNotFound();
});

test('user details includes activity summary', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->get("/admin/users/{$user->id}");

    $response->assertInertia(fn ($page) => $page
        ->has('activity')
        ->where('activity.total_orders', 0)
        ->where('activity.total_spent', 0)
    );
});

test('user details includes orders', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->get("/admin/users/{$user->id}");

    $response->assertInertia(fn ($page) => $page
        ->has('orders')
    );
});

test('super_admin can update user role to admin', function () {
    $superAdmin = User::factory()->superAdmin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($superAdmin)->patch("/admin/users/{$user->id}/role", [
        'role' => 'admin',
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('user.role', 'admin')
        ->where('flash.success', 'Rol actualizado exitosamente. El cambio de permisos tomará efecto en el próximo inicio de sesión.')
    );

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'role' => 'admin',
    ]);
});

test('super_admin can update user role to super_admin', function () {
    $superAdmin = User::factory()->superAdmin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($superAdmin)->patch("/admin/users/{$user->id}/role", [
        'role' => 'super_admin',
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('user.role', 'super_admin')
    );

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'role' => 'super_admin',
    ]);
});

test('admin can update user role to customer', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->patch("/admin/users/{$user->id}/role", [
        'role' => 'customer',
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('user.role', 'customer')
    );

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'role' => 'customer',
    ]);
});

test('admin cannot promote user to admin role', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->patch("/admin/users/{$user->id}/role", [
        'role' => 'admin',
    ]);

    $response->assertForbidden();

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'role' => 'customer',
    ]);
});

test('admin cannot promote user to super_admin role', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->patch("/admin/users/{$user->id}/role", [
        'role' => 'super_admin',
    ]);

    $response->assertForbidden();
});

test('user cannot update their own role', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->patch("/admin/users/{$admin->id}/role", [
        'role' => 'super_admin',
    ]);

    $response->assertForbidden();
});

test('customer cannot access role update endpoint', function () {
    $customer = User::factory()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($customer)->patch("/admin/users/{$user->id}/role", [
        'role' => 'admin',
    ]);

    $response->assertForbidden();
});

test('role update requires valid role value', function () {
    $superAdmin = User::factory()->superAdmin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($superAdmin)->patch("/admin/users/{$user->id}/role", [
        'role' => 'invalid_role',
    ]);

    $response->assertSessionHasErrors(['role']);
});

test('role update requires role field', function () {
    $superAdmin = User::factory()->superAdmin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($superAdmin)->patch("/admin/users/{$user->id}/role", []);

    $response->assertSessionHasErrors(['role']);
});

test('admin can deactivate user account', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create(['is_active' => true]);

    $response = $this->actingAs($admin)->patch("/admin/users/{$user->id}/toggle-active", [
        'is_active' => false,
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('user.is_active', false)
        ->where('flash.success', 'Usuario desactivado exitosamente. El usuario ya no podrá iniciar sesión.')
    );

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'is_active' => false,
    ]);
});

test('admin can activate user account', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->inactive()->create(['is_active' => false]);

    $response = $this->actingAs($admin)->patch("/admin/users/{$user->id}/toggle-active", [
        'is_active' => true,
    ]);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('user.is_active', true)
        ->where('flash.success', 'Usuario activado exitosamente. El usuario podrá iniciar sesión nuevamente.')
    );

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'is_active' => true,
    ]);
});

test('super_admin can deactivate user account', function () {
    $superAdmin = User::factory()->superAdmin()->create();
    $user = User::factory()->create(['is_active' => true]);

    $response = $this->actingAs($superAdmin)->patch("/admin/users/{$user->id}/toggle-active", [
        'is_active' => false,
    ]);

    $response->assertSuccessful();
});

test('user cannot deactivate their own account', function () {
    $admin = User::factory()->admin()->create(['is_active' => true]);

    $response = $this->actingAs($admin)->patch("/admin/users/{$admin->id}/toggle-active", [
        'is_active' => false,
    ]);

    $response->assertForbidden();

    $this->assertDatabaseHas('users', [
        'id' => $admin->id,
        'is_active' => true,
    ]);
});

test('customer cannot access toggle active endpoint', function () {
    $customer = User::factory()->create();
    $user = User::factory()->create(['is_active' => true]);

    $response = $this->actingAs($customer)->patch("/admin/users/{$user->id}/toggle-active", [
        'is_active' => false,
    ]);

    $response->assertForbidden();
});

test('toggle active requires is_active field', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->patch("/admin/users/{$user->id}/toggle-active", []);

    $response->assertSessionHasErrors(['is_active']);
});

test('toggle active requires boolean is_active value', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->patch("/admin/users/{$user->id}/toggle-active", [
        'is_active' => 'invalid',
    ]);

    $response->assertSessionHasErrors(['is_active']);
});
