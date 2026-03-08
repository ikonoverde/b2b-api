<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Stripe\StripeClient;

function validShippingData(): array
{
    return [
        'name' => 'Juan Perez',
        'address_line_1' => 'Calle 123',
        'address_line_2' => 'Piso 2',
        'city' => 'CDMX',
        'state' => 'CDMX',
        'postal_code' => '06600',
        'phone' => '5551234567',
    ];
}

function mockStripePaymentIntentCreate(): void
{
    $mockPaymentIntent = new \stdClass;
    $mockPaymentIntent->id = 'pi_test_123';
    $mockPaymentIntent->client_secret = 'pi_test_123_secret_456';

    $mockPaymentIntents = Mockery::mock(\Stripe\Service\PaymentIntentService::class);
    $mockPaymentIntents->shouldReceive('create')->once()->andReturn($mockPaymentIntent);

    $mockStripe = Mockery::mock(StripeClient::class);
    $mockStripe->paymentIntents = $mockPaymentIntents;

    app()->bind(StripeClient::class, fn () => $mockStripe);
}

it('validates required fields', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    CartItem::factory()->create(['cart_id' => $cart->id]);

    $this->actingAs($user)->post('/checkout/shipping', [])
        ->assertSessionHasErrors(['name', 'address_line_1', 'city', 'state', 'postal_code', 'phone']);
});

it('creates order with payment_pending status', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 100, 'stock' => 50]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 100,
    ]);

    mockStripePaymentIntentCreate();

    $this->actingAs($user)->post('/checkout/shipping', validShippingData())
        ->assertRedirect();

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'status' => 'payment_pending',
        'payment_status' => 'pending',
        'payment_intent_id' => 'pi_test_123',
    ]);

    $this->assertDatabaseHas('order_items', [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);
});

it('does not clear the cart', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 50, 'stock' => 50]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'unit_price' => 50,
    ]);

    mockStripePaymentIntentCreate();

    $this->actingAs($user)->post('/checkout/shipping', validShippingData());

    expect($cart->fresh()->status)->toBe('active');
    expect($cart->items()->count())->toBe(1);
});

it('does not decrement stock', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 50, 'stock' => 50]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 5,
        'unit_price' => 50,
    ]);

    mockStripePaymentIntentCreate();

    $this->actingAs($user)->post('/checkout/shipping', validShippingData());

    expect($product->fresh()->stock)->toBe(50);
});

it('redirects to payment page', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 100, 'stock' => 50]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 100,
    ]);

    mockStripePaymentIntentCreate();

    $response = $this->actingAs($user)->post('/checkout/shipping', validShippingData());

    $order = \App\Models\Order::where('user_id', $user->id)->latest()->first();
    $response->assertRedirect(route('checkout.payment', ['order' => $order->id]));
});

it('returns stock errors for insufficient stock', function () {
    $user = User::factory()->create();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 100, 'stock' => 2]);
    CartItem::factory()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 10,
        'unit_price' => 100,
    ]);

    $this->actingAs($user)->post('/checkout/shipping', validShippingData())
        ->assertSessionHasErrors('stock');
});

it('redirects to cart when cart is empty', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/checkout/shipping', validShippingData())
        ->assertRedirect(route('cart'));
});
