<?php

use App\Models\Address;
use App\Models\User;

describe('GET /account/addresses', function () {
    it('requires authentication to access addresses page', function () {
        $response = $this->get('/account/addresses');

        $response->assertRedirect('/login');
    });

    it('renders the addresses page for authenticated users', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/account/addresses');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Addresses')
            );
    });

    it('includes user data in the page props', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/account/addresses');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('auth.user')
                ->where('auth.user.id', $user->id)
                ->where('auth.user.name', $user->name)
                ->where('auth.user.email', $user->email)
            );
    });

    it('passes addresses as props', function () {
        $user = User::factory()->create();
        Address::factory()->count(2)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/account/addresses');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Addresses')
                ->has('addresses', 2)
            );
    });

    it('does not include other users addresses', function () {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        Address::factory()->create(['user_id' => $user->id]);
        Address::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->get('/account/addresses');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('addresses', 1)
            );
    });
});

describe('POST /account/addresses', function () {
    it('requires authentication', function () {
        $response = $this->post('/account/addresses');

        $response->assertRedirect('/login');
    });

    it('creates a new address', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/account/addresses', [
            'label' => 'Casa',
            'name' => 'Juan Pérez',
            'address_line_1' => 'Av. Reforma 222',
            'city' => 'Ciudad de México',
            'state' => 'Ciudad de México',
            'postal_code' => '06600',
            'phone' => '5551234567',
        ]);

        $response->assertRedirect()
            ->assertSessionHas('success', 'Dirección agregada exitosamente.');

        $this->assertDatabaseHas('addresses', [
            'user_id' => $user->id,
            'label' => 'Casa',
            'name' => 'Juan Pérez',
            'country' => 'MX',
        ]);
    });

    it('validates required fields', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/account/addresses', []);

        $response->assertSessionHasErrors(['label', 'name', 'address_line_1', 'city', 'state', 'postal_code', 'phone']);
    });

    it('sets as default when is_default is true', function () {
        $user = User::factory()->create();
        $existing = Address::factory()->create(['user_id' => $user->id, 'is_default' => true, 'label' => 'Casa']);

        $this->actingAs($user)->post('/account/addresses', [
            'label' => 'Oficina Nueva',
            'name' => 'Juan Pérez',
            'address_line_1' => 'Av. Juárez 100',
            'city' => 'Guadalajara',
            'state' => 'Jalisco',
            'postal_code' => '44100',
            'phone' => '3331234567',
            'is_default' => true,
        ]);

        $this->assertFalse($existing->fresh()->is_default);
        $this->assertTrue(
            Address::where('user_id', $user->id)->where('label', 'Oficina Nueva')->first()->is_default
        );
    });
});

describe('PUT /account/addresses/{address}', function () {
    it('requires authentication', function () {
        $address = Address::factory()->create();

        $response = $this->put("/account/addresses/{$address->id}");

        $response->assertRedirect('/login');
    });

    it('updates an address', function () {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id, 'label' => 'Casa']);

        $response = $this->actingAs($user)->put("/account/addresses/{$address->id}", [
            'label' => 'Oficina',
            'name' => $address->name,
            'address_line_1' => $address->address_line_1,
            'city' => $address->city,
            'state' => $address->state,
            'postal_code' => $address->postal_code,
            'phone' => $address->phone,
        ]);

        $response->assertRedirect()
            ->assertSessionHas('success', 'Dirección actualizada exitosamente.');

        $this->assertEquals('Oficina', $address->fresh()->label);
    });

    it('forbids updating another users address', function () {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->put("/account/addresses/{$address->id}", [
            'label' => 'Hacked',
            'name' => 'Hacker',
            'address_line_1' => '123 Hack St',
            'city' => 'Hackville',
            'state' => 'Jalisco',
            'postal_code' => '12345',
            'phone' => '1234567890',
        ]);

        $response->assertForbidden();
    });
});

describe('DELETE /account/addresses/{address}', function () {
    it('requires authentication', function () {
        $address = Address::factory()->create();

        $response = $this->delete("/account/addresses/{$address->id}");

        $response->assertRedirect('/login');
    });

    it('deletes an address', function () {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete("/account/addresses/{$address->id}");

        $response->assertRedirect()
            ->assertSessionHas('success', 'Dirección eliminada exitosamente.');

        $this->assertDatabaseMissing('addresses', ['id' => $address->id]);
    });

    it('forbids deleting another users address', function () {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->delete("/account/addresses/{$address->id}");

        $response->assertForbidden();
        $this->assertDatabaseHas('addresses', ['id' => $address->id]);
    });

    it('promotes next address to default when deleting default', function () {
        $user = User::factory()->create();
        $default = Address::factory()->create(['user_id' => $user->id, 'is_default' => true]);
        $other = Address::factory()->create(['user_id' => $user->id, 'is_default' => false]);

        $this->actingAs($user)->delete("/account/addresses/{$default->id}");

        $this->assertTrue($other->fresh()->is_default);
    });
});
