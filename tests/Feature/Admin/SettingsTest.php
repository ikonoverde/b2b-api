<?php

use App\Models\AppSettings;
use App\Models\User;

test('unauthenticated user is redirected to login', function () {
    $response = $this->get('/admin/settings');

    $response->assertRedirect('/admin/login');
});

test('customer cannot access settings page', function () {
    $customer = User::factory()->create();

    $response = $this->actingAs($customer)->get('/admin/settings');

    $response->assertForbidden();
});

test('admin can view settings page', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get('/admin/settings');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/settings/Index')
        ->has('settings')
        ->where('settings.contact_email', null)
        ->where('settings.contact_phone', null)
        ->where('settings.contact_address', null)
    );

    $this->assertDatabaseHas('app_settings', ['id' => 1]);
});

test('admin can view settings page with existing values', function () {
    $admin = User::factory()->admin()->create();
    AppSettings::create([
        'id' => 1,
        'contact_email' => 'hola@ikonoverde.com',
        'contact_phone' => '999 123 4567',
        'contact_address' => 'Calle 27 223A, Conkal, Yucatán',
    ]);

    $response = $this->actingAs($admin)->get('/admin/settings');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('settings.contact_email', 'hola@ikonoverde.com')
        ->where('settings.contact_phone', '999 123 4567')
        ->where('settings.contact_address', 'Calle 27 223A, Conkal, Yucatán')
    );
});

test('super_admin can view settings page', function () {
    $superAdmin = User::factory()->superAdmin()->create();

    $response = $this->actingAs($superAdmin)->get('/admin/settings');

    $response->assertSuccessful();
});

test('admin can update settings with valid payload', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)
        ->from('/admin/settings')
        ->put('/admin/settings', [
            'contact_email' => 'hola@ikonoverde.com',
            'contact_phone' => '999 123 4567',
            'contact_address' => 'Calle 27 223A, Conkal, Yucatán',
        ]);

    $response->assertRedirect('/admin/settings');
    $response->assertSessionHas('success', 'Configuración actualizada exitosamente.');

    $this->assertDatabaseHas('app_settings', [
        'id' => 1,
        'contact_email' => 'hola@ikonoverde.com',
        'contact_phone' => '999 123 4567',
        'contact_address' => 'Calle 27 223A, Conkal, Yucatán',
    ]);
});

test('admin can clear settings by submitting empty values', function () {
    $admin = User::factory()->admin()->create();
    AppSettings::create([
        'id' => 1,
        'contact_email' => 'old@example.com',
        'contact_phone' => '111',
        'contact_address' => 'Old',
    ]);

    $response = $this->actingAs($admin)
        ->from('/admin/settings')
        ->put('/admin/settings', [
            'contact_email' => '',
            'contact_phone' => '',
            'contact_address' => '',
        ]);

    $response->assertRedirect('/admin/settings');

    $this->assertDatabaseHas('app_settings', [
        'id' => 1,
        'contact_email' => null,
        'contact_phone' => null,
        'contact_address' => null,
    ]);
});

test('update fails with invalid email and returns spanish error', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)
        ->from('/admin/settings')
        ->put('/admin/settings', [
            'contact_email' => 'not-an-email',
        ]);

    $response->assertRedirect('/admin/settings');
    $response->assertSessionHasErrors([
        'contact_email' => 'El correo electrónico no es válido.',
    ]);
});

test('update fails when phone exceeds max length', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)
        ->from('/admin/settings')
        ->put('/admin/settings', [
            'contact_phone' => str_repeat('9', 51),
        ]);

    $response->assertSessionHasErrors([
        'contact_phone' => 'El teléfono no puede exceder 50 caracteres.',
    ]);
});

test('customer cannot update settings', function () {
    $customer = User::factory()->create();

    $response = $this->actingAs($customer)->put('/admin/settings', [
        'contact_email' => 'hola@ikonoverde.com',
    ]);

    $response->assertForbidden();
});

test('unauthenticated user cannot update settings', function () {
    $response = $this->put('/admin/settings', [
        'contact_email' => 'hola@ikonoverde.com',
    ]);

    $response->assertRedirect('/admin/login');
});
