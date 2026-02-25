<?php

use App\Models\Address;
use App\Models\User;

// ============================================================================
// GET /api/addresses
// ============================================================================

it('requires authentication to list addresses', function () {
    $this->getJson('/api/addresses')->assertUnauthorized();
});

it('returns empty list when user has no addresses', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->getJson('/api/addresses')
        ->assertSuccessful()
        ->assertJsonCount(0, 'data');
});

it('returns only the authenticated user\'s addresses', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    Address::factory(2)->create(['user_id' => $user->id]);
    Address::factory(3)->create(['user_id' => $other->id]);

    $this->actingAs($user, 'sanctum')
        ->getJson('/api/addresses')
        ->assertSuccessful()
        ->assertJsonCount(2, 'data');
});

it('returns addresses with correct structure and country MX', function () {
    $user = User::factory()->create();
    Address::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user, 'sanctum')
        ->getJson('/api/addresses')
        ->assertSuccessful()
        ->assertJsonStructure([
            'data' => [[
                'id', 'label', 'name', 'address_line_1', 'address_line_2',
                'city', 'state', 'postal_code', 'phone', 'is_default',
                'country', 'created_at', 'updated_at',
            ]],
        ])
        ->assertJsonPath('data.0.country', 'MX');
});

it('returns default address first', function () {
    $user = User::factory()->create();
    Address::factory()->create(['user_id' => $user->id, 'is_default' => false]);
    $default = Address::factory()->asDefault()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user, 'sanctum')->getJson('/api/addresses');

    $response->assertSuccessful();
    expect($response->json('data.0.id'))->toBe($default->id);
});

// ============================================================================
// POST /api/addresses
// ============================================================================

it('requires authentication to create an address', function () {
    $this->postJson('/api/addresses', [])->assertUnauthorized();
});

it('creates an address with valid data', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'sanctum')->postJson('/api/addresses', [
        'label' => 'Oficina Principal',
        'name' => 'Juan Pérez',
        'address_line_1' => 'Av. Reforma 222',
        'address_line_2' => 'Piso 3, Oficina 301',
        'city' => 'Ciudad de México',
        'state' => 'CDMX',
        'postal_code' => '06600',
        'phone' => '5551234567',
        'is_default' => false,
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.label', 'Oficina Principal')
        ->assertJsonPath('data.country', 'MX');

    $this->assertDatabaseHas('addresses', [
        'user_id' => $user->id,
        'label' => 'Oficina Principal',
        'country' => 'MX',
    ]);
});

it('creates address with country always set to MX', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'sanctum')->postJson('/api/addresses', [
        'label' => 'Bodega',
        'name' => 'Empresa SA',
        'address_line_1' => 'Calle 5 Sur',
        'city' => 'Monterrey',
        'state' => 'Nuevo León',
        'postal_code' => '64000',
        'phone' => '8112233445',
    ]);

    $response->assertCreated()->assertJsonPath('data.country', 'MX');
});

it('unsets other defaults when creating address with is_default true', function () {
    $user = User::factory()->create();
    $existing = Address::factory()->asDefault()->create(['user_id' => $user->id]);

    $this->actingAs($user, 'sanctum')->postJson('/api/addresses', [
        'label' => 'Bodega',
        'name' => 'Juan',
        'address_line_1' => 'Blvd. Kukulcán',
        'city' => 'Cancún',
        'state' => 'Quintana Roo',
        'postal_code' => '77500',
        'phone' => '9981234567',
        'is_default' => true,
    ])->assertCreated()->assertJsonPath('data.is_default', true);

    expect($existing->fresh()->is_default)->toBeFalse();
});

it('validates required fields on store', function (string $field) {
    $user = User::factory()->create();
    $data = [
        'label' => 'Oficina',
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '06600',
        'phone' => '5550000000',
    ];
    unset($data[$field]);

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/addresses', $data)
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$field]);
})->with(['label', 'name', 'address_line_1', 'city', 'state', 'postal_code', 'phone']);

it('validates max length on label', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')->postJson('/api/addresses', [
        'label' => str_repeat('a', 101),
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '06600',
        'phone' => '5550000000',
    ])->assertUnprocessable()->assertJsonValidationErrors(['label']);
});

it('validates max length on postal_code', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')->postJson('/api/addresses', [
        'label' => 'Oficina',
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '12345678901',
        'phone' => '5550000000',
    ])->assertUnprocessable()->assertJsonValidationErrors(['postal_code']);
});

it('validates max length on phone', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')->postJson('/api/addresses', [
        'label' => 'Oficina',
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '06600',
        'phone' => str_repeat('5', 21),
    ])->assertUnprocessable()->assertJsonValidationErrors(['phone']);
});

// ============================================================================
// PUT /api/addresses/{id}
// ============================================================================

it('requires authentication to update an address', function () {
    $this->putJson('/api/addresses/1', [])->assertUnauthorized();
});

it('updates an address with valid data', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user, 'sanctum')->putJson("/api/addresses/{$address->id}", [
        'label' => 'Updated',
        'name' => 'María López',
        'address_line_1' => 'Paseo de la Reforma 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '06600',
        'phone' => '5599887766',
        'is_default' => false,
    ])->assertSuccessful()->assertJsonPath('data.label', 'Updated');

    $this->assertDatabaseHas('addresses', [
        'id' => $address->id,
        'label' => 'Updated',
    ]);
});

it('unsets other defaults when updating address with is_default true', function () {
    $user = User::factory()->create();
    $original = Address::factory()->asDefault()->create(['user_id' => $user->id]);
    $toUpdate = Address::factory()->create(['user_id' => $user->id, 'is_default' => false]);

    $this->actingAs($user, 'sanctum')->putJson("/api/addresses/{$toUpdate->id}", [
        'label' => 'New Default',
        'name' => 'Pedro',
        'address_line_1' => 'Calle 2',
        'city' => 'GDL',
        'state' => 'Jalisco',
        'postal_code' => '44100',
        'phone' => '3300000000',
        'is_default' => true,
    ])->assertSuccessful()->assertJsonPath('data.is_default', true);

    expect($original->fresh()->is_default)->toBeFalse();
    expect($toUpdate->fresh()->is_default)->toBeTrue();
});

it('cannot update another user\'s address', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user, 'sanctum')->putJson("/api/addresses/{$address->id}", [
        'label' => 'Hack',
        'name' => 'Hacker',
        'address_line_1' => 'Evil St',
        'city' => 'Bad City',
        'state' => 'BA',
        'postal_code' => '00000',
        'phone' => '0000000000',
    ])->assertForbidden()->assertJsonPath('message', 'Forbidden');
});

it('returns 404 for non-existent address on update', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')->putJson('/api/addresses/99999', [
        'label' => 'Home',
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '06600',
        'phone' => '5550000000',
    ])->assertNotFound();
});

it('validates required fields on update', function (string $field) {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    $data = [
        'label' => 'Oficina',
        'name' => 'Juan',
        'address_line_1' => 'Calle 1',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '06600',
        'phone' => '5550000000',
    ];
    unset($data[$field]);

    $this->actingAs($user, 'sanctum')
        ->putJson("/api/addresses/{$address->id}", $data)
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$field]);
})->with(['label', 'name', 'address_line_1', 'city', 'state', 'postal_code', 'phone']);

// ============================================================================
// DELETE /api/addresses/{id}
// ============================================================================

it('requires authentication to delete an address', function () {
    $this->deleteJson('/api/addresses/1')->assertUnauthorized();
});

it('deletes an address and returns 204', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/addresses/{$address->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('addresses', ['id' => $address->id]);
});

it('promotes next most recent address to default when default is deleted', function () {
    $user = User::factory()->create();
    $default = Address::factory()->asDefault()->create([
        'user_id' => $user->id,
        'created_at' => now()->subDay(),
    ]);
    $next = Address::factory()->create([
        'user_id' => $user->id,
        'is_default' => false,
        'created_at' => now(),
    ]);

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/addresses/{$default->id}")
        ->assertNoContent();

    expect($next->fresh()->is_default)->toBeTrue();
});

it('leaves no default when only address is deleted', function () {
    $user = User::factory()->create();
    $address = Address::factory()->asDefault()->create(['user_id' => $user->id]);

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/addresses/{$address->id}")
        ->assertNoContent();

    expect(Address::where('user_id', $user->id)->count())->toBe(0);
});

it('does not promote default when non-default address is deleted', function () {
    $user = User::factory()->create();
    $default = Address::factory()->asDefault()->create(['user_id' => $user->id]);
    $nonDefault = Address::factory()->create(['user_id' => $user->id, 'is_default' => false]);

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/addresses/{$nonDefault->id}")
        ->assertNoContent();

    expect($default->fresh()->is_default)->toBeTrue();
});

it('cannot delete another user\'s address', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user, 'sanctum')
        ->deleteJson("/api/addresses/{$address->id}")
        ->assertForbidden()
        ->assertJsonPath('message', 'Forbidden');

    $this->assertDatabaseHas('addresses', ['id' => $address->id]);
});

it('returns 404 for non-existent address on delete', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->deleteJson('/api/addresses/99999')
        ->assertNotFound();
});
