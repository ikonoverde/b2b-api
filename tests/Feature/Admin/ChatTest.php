<?php

use App\Ai\Agents\AdminChatAgent;
use App\Ai\Agents\AdsAgent;
use App\Ai\Agents\MarketingIdeasAgent;
use App\Models\AgentConversation;
use App\Models\AgentConversationMessage;
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

test('admin can view chat page with agents and conversations', function () {
    $admin = User::factory()->admin()->create();
    AgentConversation::factory()->for($admin)->create([
        'title' => 'Diagnostico GA4',
    ]);

    $response = $this->actingAs($admin)->get('/admin/chat');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/chat/Index')
        ->has('agents.ads')
        ->has('agents.marketing_ideas')
        ->has('agents.admin')
        ->has('conversations', 1)
        ->where('selectedConversation', null)
        ->has('messages', 0)
    );
});

test('admin can load a persisted conversation', function () {
    $admin = User::factory()->admin()->create();
    $conversation = AgentConversation::factory()->for($admin)->create([
        'title' => 'Meta Ads',
    ]);
    AgentConversationMessage::factory()->for($conversation, 'conversation')->for($admin)->create([
        'agent' => 'ads',
        'role' => 'user',
        'content' => 'Revisa Meta.',
    ]);

    $response = $this->actingAs($admin)->get("/admin/chat?conversation={$conversation->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/chat/Index')
        ->where('selectedConversation.id', $conversation->id)
        ->where('messages.0.content', 'Revisa Meta.')
        ->where('messages.0.agent', 'ads')
    );
});

test('admin can send first message and create a persisted ads conversation', function () {
    $admin = User::factory()->admin()->create();

    AdsAgent::fake(['GA4 esta listo para revisar reportes.']);

    $response = $this->actingAs($admin)->postJson('/admin/chat/messages', [
        'agent' => 'ads',
        'message' => 'Revisa si GA4 esta conectado.',
    ]);

    $response
        ->assertSuccessful()
        ->assertJsonPath('message.agent', 'ads')
        ->assertJsonPath('message.role', 'assistant')
        ->assertJsonPath('message.content', 'GA4 esta listo para revisar reportes.');

    $conversationId = $response->json('conversation.id');

    $this->assertDatabaseHas('agent_conversations', [
        'id' => $conversationId,
        'user_id' => $admin->id,
        'title' => 'Revisa si GA4 esta conectado.',
    ]);

    $this->assertDatabaseHas('agent_conversation_messages', [
        'conversation_id' => $conversationId,
        'agent' => 'ads',
        'role' => 'user',
        'content' => 'Revisa si GA4 esta conectado.',
    ]);

    $this->assertDatabaseHas('agent_conversation_messages', [
        'conversation_id' => $conversationId,
        'agent' => 'ads',
        'role' => 'assistant',
        'content' => 'GA4 esta listo para revisar reportes.',
    ]);

    AdsAgent::assertPrompted('Revisa si GA4 esta conectado.');
});

test('admin can send first message and create a persisted marketing ideas conversation', function () {
    $admin = User::factory()->admin()->create();

    MarketingIdeasAgent::fake(['Prioriza SEO local, alianzas con spas y muestras para terapeutas.']);

    $response = $this->actingAs($admin)->postJson('/admin/chat/messages', [
        'agent' => 'marketing_ideas',
        'message' => 'Dame ideas para vender mas aceite 5 L.',
    ]);

    $response
        ->assertSuccessful()
        ->assertJsonPath('message.agent', 'marketing_ideas')
        ->assertJsonPath('message.role', 'assistant')
        ->assertJsonPath('message.content', 'Prioriza SEO local, alianzas con spas y muestras para terapeutas.');

    $conversationId = $response->json('conversation.id');

    $this->assertDatabaseHas('agent_conversation_messages', [
        'conversation_id' => $conversationId,
        'agent' => 'marketing_ideas',
        'role' => 'user',
        'content' => 'Dame ideas para vender mas aceite 5 L.',
    ]);

    $this->assertDatabaseHas('agent_conversation_messages', [
        'conversation_id' => $conversationId,
        'agent' => 'marketing_ideas',
        'role' => 'assistant',
        'content' => 'Prioriza SEO local, alianzas con spas y muestras para terapeutas.',
    ]);

    MarketingIdeasAgent::assertPrompted('Dame ideas para vender mas aceite 5 L.');
});

test('admin can append to an owned conversation with selected agent', function () {
    $admin = User::factory()->admin()->create();
    $conversation = AgentConversation::factory()->for($admin)->create();
    AgentConversationMessage::factory()->for($conversation, 'conversation')->for($admin)->create([
        'agent' => 'admin',
        'role' => 'assistant',
        'content' => 'Puedo ayudarte con tareas administrativas.',
    ]);

    AdminChatAgent::fake(['Claro, puedo ayudarte con eso.']);

    $response = $this->actingAs($admin)->postJson('/admin/chat/messages', [
        'agent' => 'admin',
        'conversation_id' => $conversation->id,
        'message' => 'Ayudame a redactar una respuesta para un cliente.',
    ]);

    $response
        ->assertSuccessful()
        ->assertJsonPath('conversation.id', $conversation->id)
        ->assertJsonPath('message.agent', 'admin')
        ->assertJsonPath('message.content', 'Claro, puedo ayudarte con eso.');

    expect(AgentConversationMessage::query()->where('conversation_id', $conversation->id)->count())->toBe(3);

    AdminChatAgent::assertPrompted('Ayudame a redactar una respuesta para un cliente.');
});

test('chat message requires content', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->postJson('/admin/chat/messages', [
        'agent' => 'ads',
        'message' => '',
    ]);

    $response->assertJsonValidationErrors('message');
});

test('chat message requires a valid agent', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->postJson('/admin/chat/messages', [
        'agent' => 'unknown',
        'message' => 'Hello',
    ]);

    $response->assertJsonValidationErrors('agent');
});

test('admin cannot append to another users conversation', function () {
    $admin = User::factory()->admin()->create();
    $otherAdmin = User::factory()->admin()->create();
    $conversation = AgentConversation::factory()->for($otherAdmin)->create();

    $response = $this->actingAs($admin)->postJson('/admin/chat/messages', [
        'agent' => 'ads',
        'conversation_id' => $conversation->id,
        'message' => 'Hello',
    ]);

    $response->assertForbidden();
});

test('customer cannot send chat message', function () {
    $customer = User::factory()->create();

    $response = $this->actingAs($customer)->postJson('/admin/chat/messages', [
        'agent' => 'ads',
        'message' => 'Hello',
    ]);

    $response->assertForbidden();
});
