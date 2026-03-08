<?php

use App\Models\Order;
use App\Models\User;
use Stripe\StripeClient;

function mockStripePaymentIntentRetrieve(): void
{
    $mockPaymentIntent = new \stdClass;
    $mockPaymentIntent->client_secret = 'pi_test_123_secret_456';

    $mockPaymentIntents = Mockery::mock(\Stripe\Service\PaymentIntentService::class);
    $mockPaymentIntents->shouldReceive('retrieve')->once()->andReturn($mockPaymentIntent);

    $mockStripe = Mockery::mock(StripeClient::class);
    $mockStripe->paymentIntents = $mockPaymentIntents;

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
        );
});
