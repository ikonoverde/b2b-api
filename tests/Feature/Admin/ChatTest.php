<?php

use App\Ai\Agents\AdminChatAgent;
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

test('admin can send chat message', function () {
    $admin = User::factory()->admin()->create();

    AdminChatAgent::fake(['Claro, puedo ayudarte con eso.']);

    $response = $this->actingAs($admin)->postJson('/admin/chat/messages', [
        'message' => 'Ayúdame a redactar una respuesta para un cliente.',
        'messages' => [
            [
                'role' => 'assistant',
                'content' => 'Puedo ayudarte con tareas administrativas.',
            ],
        ],
    ]);

    $response
        ->assertSuccessful()
        ->assertJsonPath('message.role', 'assistant')
        ->assertJsonPath('message.content', 'Claro, puedo ayudarte con eso.');

    AdminChatAgent::assertPrompted('Ayúdame a redactar una respuesta para un cliente.');
});

test('chat message requires content', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->postJson('/admin/chat/messages', [
        'message' => '',
    ]);

    $response->assertJsonValidationErrors('message');
});

test('customer cannot send chat message', function () {
    $customer = User::factory()->create();

    $response = $this->actingAs($customer)->postJson('/admin/chat/messages', [
        'message' => 'Hello',
    ]);

    $response->assertForbidden();
});
