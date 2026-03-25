<?php

use App\Jobs\CreateShippingLabel;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Queue;

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
});

it('dispatches label job on retry', function () {
    Queue::fake();

    $order = Order::factory()
        ->processing()
        ->withSkydropxShipping()
        ->create(['label_error' => 'Previous error']);

    $this->actingAs($this->admin)
        ->post("/admin/orders/{$order->id}/retry-label")
        ->assertRedirect()
        ->assertSessionHas('success');

    Queue::assertPushed(CreateShippingLabel::class, fn ($job) => $job->order->id === $order->id);

    expect($order->fresh()->label_error)->toBeNull();
});

it('rejects retry for non-skydropx orders', function () {
    Queue::fake();

    $order = Order::factory()->processing()->create([
        'shipping_quote_source' => 'static',
    ]);

    $this->actingAs($this->admin)
        ->post("/admin/orders/{$order->id}/retry-label")
        ->assertRedirect()
        ->assertSessionHas('error');

    Queue::assertNotPushed(CreateShippingLabel::class);
});

it('rejects retry for orders with existing label', function () {
    Queue::fake();

    $order = Order::factory()
        ->processing()
        ->withLabel()
        ->create();

    $this->actingAs($this->admin)
        ->post("/admin/orders/{$order->id}/retry-label")
        ->assertRedirect()
        ->assertSessionHas('error');

    Queue::assertNotPushed(CreateShippingLabel::class);
});

it('rejects retry for non-processing orders', function () {
    Queue::fake();

    $order = Order::factory()
        ->shipped()
        ->withSkydropxShipping()
        ->create();

    $this->actingAs($this->admin)
        ->post("/admin/orders/{$order->id}/retry-label")
        ->assertRedirect()
        ->assertSessionHas('error');

    Queue::assertNotPushed(CreateShippingLabel::class);
});

it('requires authentication', function () {
    $order = Order::factory()->processing()->withSkydropxShipping()->create();

    $this->post("/admin/orders/{$order->id}/retry-label")
        ->assertRedirect('/admin/login');
});
