<?php

use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;

// Authentication Tests
describe('Authentication', function () {
    it('requires authentication to list payment methods', function () {
        $response = $this->getJson('/api/payment-methods');

        $response->assertUnauthorized();
    });

    it('requires authentication to add payment method', function () {
        $response = $this->postJson('/api/payment-methods', [
            'payment_method_id' => 'pm_test123',
        ]);

        $response->assertUnauthorized();
    });

    it('requires authentication to delete payment method', function () {
        $response = $this->deleteJson('/api/payment-methods/pm_test123');

        $response->assertUnauthorized();
    });

    it('requires authentication to set default payment method', function () {
        $response = $this->patchJson('/api/payment-methods/pm_test123/default');

        $response->assertUnauthorized();
    });

    it('requires authentication to view payment methods page', function () {
        $response = $this->get('/account/payment-methods');

        $response->assertRedirect('/login');
    });

    it('requires authentication to store payment method via web', function () {
        $response = $this->post('/account/payment-methods', [
            'payment_method_id' => 'pm_test123',
        ]);

        $response->assertRedirect('/login');
    });

    it('requires authentication to delete payment method via web', function () {
        $response = $this->delete('/account/payment-methods/pm_test123');

        $response->assertRedirect('/login');
    });

    it('requires authentication to set default via web', function () {
        $response = $this->patch('/account/payment-methods/pm_test123/default');

        $response->assertRedirect('/login');
    });
});

// Validation Tests
describe('Validation', function () {
    it('validates payment_method_id is required when adding', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/payment-methods', [
            'set_as_default' => true,
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['payment_method_id']);
    });

    it('validates payment_method_id is required when adding via web', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/account/payment-methods', [
            'set_as_default' => true,
        ]);

        $response->assertSessionHasErrors(['payment_method_id']);
    });
});

// Stripe Key Tests
describe('Stripe Key', function () {
    it('returns stripe publishable key when configured', function () {
        Config::set('cashier.key', 'pk_test_1234567890');
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/payment-methods/stripe-key');

        $response->assertOk()
            ->assertJson([
                'key' => 'pk_test_1234567890',
            ]);
    });

    it('returns error when stripe key is not configured', function () {
        Config::set('cashier.key', null);
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/payment-methods/stripe-key');

        $response->assertServerError()
            ->assertJson(['message' => 'Configuración de Stripe no disponible.']);
    });
});

// Web Routes Tests
describe('Web Routes', function () {
    it('returns payment methods page for authenticated user', function () {
        Config::set('cashier.key', 'pk_test_1234567890');
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/account/payment-methods');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('PaymentMethods')
                ->has('stripe_key')
                ->has('payment_methods')
            );
    });

    it('includes stripe key in page props', function () {
        Config::set('cashier.key', 'pk_test_example123');
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/account/payment-methods');

        $response->assertInertia(fn ($page) => $page
            ->component('PaymentMethods')
            ->where('stripe_key', 'pk_test_example123')
        );
    });

    it('passes empty payment methods when user has no stripe id', function () {
        Config::set('cashier.key', 'pk_test_1234567890');
        $user = User::factory()->create(['stripe_id' => null]);

        $response = $this->actingAs($user)->get('/account/payment-methods');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('PaymentMethods')
                ->where('payment_methods', [])
            );
    });
});

// API Structure Tests
describe('API Response Structure', function () {
    it('returns proper error format for not found payment method', function () {
        Http::fake([
            'api.stripe.com/*' => Http::response(['error' => ['message' => 'Not found']], 404),
        ]);

        $user = User::factory()->create(['stripe_id' => 'cus_test123']);

        $response = $this->actingAs($user)->deleteJson('/api/payment-methods/pm_nonexistent');

        $response->assertNotFound()
            ->assertJsonStructure(['message']);
    });
});
