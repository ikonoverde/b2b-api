<?php

use App\Models\User;
use Laravel\Cashier\Events\WebhookReceived;
use Stripe\StripeClient;

beforeEach(function () {
    $this->mockStripeClient = Mockery::mock(StripeClient::class);
    $this->app->bind(StripeClient::class, fn () => $this->mockStripeClient);
});

// ── Create Setup Session ──

it('requires authentication to create setup session', function () {
    $response = $this->postJson('/api/payment-methods/setup-session', []);

    $response->assertUnauthorized();
});

it('requires success_url and cancel_url', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/payment-methods/setup-session', []);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['success_url', 'cancel_url']);
});

it('validates urls are valid', function (string $field) {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/payment-methods/setup-session', [
        'success_url' => $field === 'success_url' ? 'not-a-url' : 'https://example.com/success',
        'cancel_url' => $field === 'cancel_url' ? 'not-a-url' : 'https://example.com/cancel',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors([$field]);
})->with(['success_url', 'cancel_url']);

it('creates setup session and returns checkout url', function () {
    $user = User::factory()->create(['stripe_id' => 'cus_test_123']);

    $mockSession = (object) [
        'id' => 'cs_test_setup_123',
        'url' => 'https://checkout.stripe.com/c/setup/cs_test_setup_123',
    ];

    $mockSessions = Mockery::mock();
    $mockSessions->shouldReceive('create')
        ->once()
        ->with(Mockery::on(function (array $params) {
            return $params['mode'] === 'setup'
                && $params['customer'] === 'cus_test_123'
                && $params['payment_method_types'] === ['card'];
        }))
        ->andReturn($mockSession);

    $this->mockStripeClient->checkout = (object) ['sessions' => $mockSessions];

    $response = $this->actingAs($user)->postJson('/api/payment-methods/setup-session', [
        'success_url' => 'https://example.com/success',
        'cancel_url' => 'https://example.com/cancel',
    ]);

    $response->assertOk();
    $response->assertJsonPath('checkout_url', 'https://checkout.stripe.com/c/setup/cs_test_setup_123');
});

it('creates stripe customer if user has none', function () {
    $user = User::factory()->create(['stripe_id' => null]);

    $mockSession = (object) [
        'id' => 'cs_test_new_customer',
        'url' => 'https://checkout.stripe.com/c/setup/cs_test_new_customer',
    ];

    $mockSessions = Mockery::mock();
    $mockSessions->shouldReceive('create')->once()->andReturn($mockSession);

    $mockCustomers = Mockery::mock();
    $mockCustomers->shouldReceive('create')->once()->andReturn((object) ['id' => 'cus_new_123']);

    $this->mockStripeClient->checkout = (object) ['sessions' => $mockSessions];
    $this->mockStripeClient->customers = $mockCustomers;

    $response = $this->actingAs($user)->postJson('/api/payment-methods/setup-session', [
        'success_url' => 'https://example.com/success',
        'cancel_url' => 'https://example.com/cancel',
    ]);

    $response->assertOk();
    expect($user->fresh()->stripe_id)->not->toBeNull();
});

// ── Verify Setup Session ──

it('requires authentication to verify setup session', function () {
    $response = $this->getJson('/api/payment-methods/setup-verify');

    $response->assertUnauthorized();
});

it('requires session_id to verify', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/payment-methods/setup-verify');

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['session_id']);
});

it('returns forbidden when session belongs to another customer', function () {
    $user = User::factory()->create(['stripe_id' => 'cus_test_owner']);

    $mockSession = (object) [
        'id' => 'cs_test_other',
        'customer' => 'cus_test_different',
        'status' => 'complete',
    ];

    $mockSessions = Mockery::mock();
    $mockSessions->shouldReceive('retrieve')->once()->andReturn($mockSession);

    $this->mockStripeClient->checkout = (object) ['sessions' => $mockSessions];

    $response = $this->actingAs($user)->getJson('/api/payment-methods/setup-verify?session_id=cs_test_other');

    $response->assertForbidden();
    $response->assertJsonPath('message', 'This session does not belong to your account.');
});

it('returns pending status when session is not complete', function () {
    $user = User::factory()->create(['stripe_id' => 'cus_test_pending']);

    $mockSession = (object) [
        'id' => 'cs_test_pending',
        'customer' => 'cus_test_pending',
        'status' => 'open',
    ];

    $mockSessions = Mockery::mock();
    $mockSessions->shouldReceive('retrieve')->once()->andReturn($mockSession);

    $this->mockStripeClient->checkout = (object) ['sessions' => $mockSessions];

    $response = $this->actingAs($user)->getJson('/api/payment-methods/setup-verify?session_id=cs_test_pending');

    $response->assertOk();
    $response->assertJsonPath('status', 'open');
    $response->assertJsonPath('payment_method', null);
});

it('returns payment method details when session is complete', function () {
    $user = User::factory()->create(['stripe_id' => 'cus_test_complete']);

    $mockSession = (object) [
        'id' => 'cs_test_complete',
        'customer' => 'cus_test_complete',
        'status' => 'complete',
        'setup_intent' => 'seti_test_123',
    ];

    $mockSetupIntent = (object) [
        'id' => 'seti_test_123',
        'payment_method' => 'pm_test_card_123',
    ];

    $mockPaymentMethod = (object) [
        'id' => 'pm_test_card_123',
        'type' => 'card',
        'card' => (object) [
            'brand' => 'visa',
            'last4' => '4242',
            'exp_month' => 12,
            'exp_year' => 2027,
        ],
    ];

    $mockSessions = Mockery::mock();
    $mockSessions->shouldReceive('retrieve')->once()->andReturn($mockSession);

    $mockSetupIntents = Mockery::mock();
    $mockSetupIntents->shouldReceive('retrieve')->with('seti_test_123')->once()->andReturn($mockSetupIntent);

    $mockPaymentMethods = Mockery::mock();
    $mockPaymentMethods->shouldReceive('retrieve')->with('pm_test_card_123')->once()->andReturn($mockPaymentMethod);

    $this->mockStripeClient->checkout = (object) ['sessions' => $mockSessions];
    $this->mockStripeClient->setupIntents = $mockSetupIntents;
    $this->mockStripeClient->paymentMethods = $mockPaymentMethods;

    $response = $this->actingAs($user)->getJson('/api/payment-methods/setup-verify?session_id=cs_test_complete');

    $response->assertOk();
    $response->assertJsonPath('status', 'complete');
    $response->assertJsonPath('payment_method.id', 'pm_test_card_123');
    $response->assertJsonPath('payment_method.card.brand', 'visa');
    $response->assertJsonPath('payment_method.card.last4', '4242');
});

// ── Webhook: setup mode checkout.session.completed ──

it('handles setup mode checkout.session.completed webhook', function () {
    $user = User::factory()->create(['stripe_id' => 'cus_webhook_setup']);

    $mockSetupIntents = Mockery::mock();
    $mockSetupIntents->shouldReceive('retrieve')
        ->with('seti_webhook_123')
        ->once()
        ->andReturn((object) ['id' => 'seti_webhook_123', 'payment_method' => 'pm_webhook_card']);

    $mockPaymentMethods = Mockery::mock();
    $mockPaymentMethods->shouldReceive('attach')
        ->once()
        ->with('pm_webhook_card', ['customer' => 'cus_webhook_setup'])
        ->andReturn((object) ['id' => 'pm_webhook_card']);

    $mockCustomers = Mockery::mock();
    $mockCustomers->shouldReceive('update')
        ->once()
        ->with('cus_webhook_setup', ['invoice_settings' => ['default_payment_method' => 'pm_webhook_card']])
        ->andReturn((object) ['id' => 'cus_webhook_setup']);

    $this->mockStripeClient->setupIntents = $mockSetupIntents;
    $this->mockStripeClient->paymentMethods = $mockPaymentMethods;
    $this->mockStripeClient->customers = $mockCustomers;

    event(new WebhookReceived([
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'mode' => 'setup',
                'customer' => 'cus_webhook_setup',
                'setup_intent' => 'seti_webhook_123',
            ],
        ],
    ]));

    expect(true)->toBeTrue();
});

it('ignores setup webhook for unknown customer', function () {
    event(new WebhookReceived([
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'mode' => 'setup',
                'customer' => 'cus_nonexistent',
                'setup_intent' => 'seti_noop',
            ],
        ],
    ]));

    expect(true)->toBeTrue();
});

it('ignores setup webhook with missing data', function () {
    event(new WebhookReceived([
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'mode' => 'setup',
            ],
        ],
    ]));

    expect(true)->toBeTrue();
});
