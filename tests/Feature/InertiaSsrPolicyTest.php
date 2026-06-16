<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Support\Facades\Route;

beforeEach(function () {
    config(['inertia.ssr.enabled' => true]);
});

it('keeps SSR enabled for public web requests', function () {
    Route::middleware(HandleInertiaRequests::class)->get('/ssr-policy-public', fn () => response()->json([
        'enabled' => config('inertia.ssr.enabled'),
    ]));

    $this->get('/ssr-policy-public')
        ->assertOk()
        ->assertJson(['enabled' => true]);
});

it('disables SSR for admin requests', function () {
    Route::middleware(HandleInertiaRequests::class)->get('/admin/ssr-policy', fn () => response()->json([
        'enabled' => config('inertia.ssr.enabled'),
    ]));

    $this->get('/admin/ssr-policy')
        ->assertOk()
        ->assertJson(['enabled' => false]);
});

it('disables SSR for the Stripe payment route', function () {
    Route::middleware(HandleInertiaRequests::class)
        ->get('/ssr-policy-checkout-payment', fn () => response()->json([
            'enabled' => config('inertia.ssr.enabled'),
        ]))
        ->name('checkout.payment');

    $this->get('/ssr-policy-checkout-payment')
        ->assertOk()
        ->assertJson(['enabled' => false]);
});
