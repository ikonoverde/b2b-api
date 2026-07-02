<?php

use App\Models\User;

test('unauthenticated user is redirected to admin login', function () {
    $response = $this->get('/admin/chat');

    $response->assertRedirect('/admin/login');
});

test('customer cannot access admin chat page', function () {
    $customer = User::factory()->create();

    $response = $this->actingAs($customer)->get('/admin/chat');

    $response->assertForbidden();
});

test('admin can view chat page', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/admin/chat');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/chat/Index')
    );
});
