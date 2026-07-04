<?php

use App\Models\Order;
use App\Models\User;
use Stripe\Customer;
use Stripe\PaymentMethod;
use Stripe\Service\CustomerService;
use Stripe\Service\PaymentIntentService;
use Stripe\Service\PaymentMethodService;
use Stripe\StripeClient;

function mockStripePaymentIntentRetrieve(): void
{
    $mockPaymentIntent = new stdClass;
    $mockPaymentIntent->client_secret = 'pi_test_123_secret_456';

    $mockPaymentIntents = Mockery::mock(PaymentIntentService::class);
    $mockPaymentIntents->shouldReceive('retrieve')->once()->andReturn($mockPaymentIntent);

    $mockStripe = Mockery::mock(StripeClient::class);
    $mockStripe->paymentIntents = $mockPaymentIntents;

    app()->bind(StripeClient::class, fn () => $mockStripe);
}

function stripePaymentMethodForCheckout(string $id, string $brand, string $last4): PaymentMethod
{
    return PaymentMethod::constructFrom([
        'id' => $id,
        'customer' => 'cus_test_123',
        'type' => 'card',
        'card' => [
            'brand' => $brand,
            'last4' => $last4,
            'exp_month' => 12,
            'exp_year' => 2028,
        ],
    ]);
}

function mockStripeCheckoutWithPaymentMethods(): void
{
    $mockPaymentIntent = new stdClass;
    $mockPaymentIntent->client_secret = 'pi_test_123_secret_456';
    $mockPaymentIntent->customer = 'cus_test_123';

    $defaultPaymentMethod = stripePaymentMethodForCheckout('pm_card_visa', 'visa', '4242');
    $secondPaymentMethod = stripePaymentMethodForCheckout('pm_card_mastercard', 'mastercard', '4444');

    $customer = Customer::constructFrom([
        'id' => 'cus_test_123',
        'default_source' => null,
    ]);
    $customer->invoice_settings = (object) [
        'default_payment_method' => $defaultPaymentMethod,
    ];

    $mockPaymentIntents = Mockery::mock(PaymentIntentService::class);
    $mockPaymentIntents->shouldReceive('retrieve')->once()->andReturn($mockPaymentIntent);

    $mockPaymentMethods = Mockery::mock(PaymentMethodService::class);
    $mockPaymentMethods->shouldReceive('all')
        ->once()
        ->with(['customer' => 'cus_test_123', 'limit' => 24])
        ->andReturn((object) ['data' => [$defaultPaymentMethod, $secondPaymentMethod]]);

    $mockCustomers = Mockery::mock(CustomerService::class);
    $mockCustomers->shouldReceive('retrieve')
        ->once()
        ->with('cus_test_123', ['expand' => ['default_source', 'invoice_settings.default_payment_method']])
        ->andReturn($customer);

    $mockStripe = Mockery::mock(StripeClient::class);
    $mockStripe->paymentIntents = $mockPaymentIntents;
    $mockStripe->paymentMethods = $mockPaymentMethods;
    $mockStripe->customers = $mockCustomers;

    app()->bind(StripeClient::class, fn () => $mockStripe);
}

function mockStripeCheckoutWithDetachedPaymentIntent(): void
{
    $mockPaymentIntent = new stdClass;
    $mockPaymentIntent->client_secret = 'pi_test_123_secret_456';
    $mockPaymentIntent->customer = null;

    $updatedPaymentIntent = new stdClass;
    $updatedPaymentIntent->client_secret = 'pi_test_123_secret_456';
    $updatedPaymentIntent->customer = 'cus_test_123';

    $defaultPaymentMethod = stripePaymentMethodForCheckout('pm_card_visa', 'visa', '4242');

    $customer = Customer::constructFrom([
        'id' => 'cus_test_123',
        'default_source' => null,
    ]);
    $customer->invoice_settings = (object) [
        'default_payment_method' => $defaultPaymentMethod,
    ];

    $mockPaymentIntents = Mockery::mock(PaymentIntentService::class);
    $mockPaymentIntents->shouldReceive('retrieve')->once()->andReturn($mockPaymentIntent);
    $mockPaymentIntents->shouldReceive('update')
        ->once()
        ->with('pi_test_123', ['customer' => 'cus_test_123'])
        ->andReturn($updatedPaymentIntent);

    $mockPaymentMethods = Mockery::mock(PaymentMethodService::class);
    $mockPaymentMethods->shouldReceive('all')
        ->once()
        ->with(['customer' => 'cus_test_123', 'limit' => 24])
        ->andReturn((object) ['data' => [$defaultPaymentMethod]]);

    $mockCustomers = Mockery::mock(CustomerService::class);
    $mockCustomers->shouldReceive('retrieve')
        ->once()
        ->with('cus_test_123', ['expand' => ['default_source', 'invoice_settings.default_payment_method']])
        ->andReturn($customer);

    $mockStripe = Mockery::mock(StripeClient::class);
    $mockStripe->paymentIntents = $mockPaymentIntents;
    $mockStripe->paymentMethods = $mockPaymentMethods;
    $mockStripe->customers = $mockCustomers;

    app()->bind(StripeClient::class, fn () => $mockStripe);
}

it('requires authentication', function () {
    $this->get('/checkout/payment?order=1')->assertRedirect('/login');
});

it('returns 404 for another users order', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $otherUser->id,
        'status' => 'payment_pending',
        'payment_intent_id' => 'pi_test_123',
    ]);

    $this->actingAs($user)->get("/checkout/payment?order={$order->id}")
        ->assertNotFound();
});

it('returns 404 for non payment_pending order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'processing',
        'payment_intent_id' => 'pi_test_123',
    ]);

    $this->actingAs($user)->get("/checkout/payment?order={$order->id}")
        ->assertNotFound();
});

it('shows payment page with client_secret', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'payment_pending',
        'payment_intent_id' => 'pi_test_123',
    ]);

    mockStripePaymentIntentRetrieve();

    $this->actingAs($user)->get("/checkout/payment?order={$order->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Checkout/Payment')
            ->has('client_secret')
            ->has('stripe_key')
            ->has('order')
            ->where('payment_methods', [])
        );
});

it('shows saved payment methods on payment page', function () {
    $user = User::factory()->create(['stripe_id' => 'cus_test_123']);
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'payment_pending',
        'payment_intent_id' => 'pi_test_123',
    ]);

    mockStripeCheckoutWithPaymentMethods();

    $this->actingAs($user)->get("/checkout/payment?order={$order->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Checkout/Payment')
            ->has('payment_methods', 2)
            ->where('payment_methods.0.id', 'pm_card_visa')
            ->where('payment_methods.0.card.last4', '4242')
            ->where('payment_methods.0.is_default', true)
            ->where('payment_methods.1.id', 'pm_card_mastercard')
            ->where('payment_methods.1.is_default', false)
        );
});

it('attaches an existing payment intent to the stripe customer', function () {
    $user = User::factory()->create(['stripe_id' => 'cus_test_123']);
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'payment_pending',
        'payment_intent_id' => 'pi_test_123',
    ]);

    mockStripeCheckoutWithDetachedPaymentIntent();

    $this->actingAs($user)->get("/checkout/payment?order={$order->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Checkout/Payment')
            ->where('client_secret', 'pi_test_123_secret_456')
            ->has('payment_methods', 1)
        );
});
