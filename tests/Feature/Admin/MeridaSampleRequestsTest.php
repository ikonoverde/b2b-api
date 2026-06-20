<?php

use App\Models\MeridaSampleRequest;
use App\Models\User;

test('admin can view Merida sample requests', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create([
        'name' => 'Spa Buyer',
        'email' => 'buyer@example.com',
    ]);

    MeridaSampleRequest::factory()->for($user)->create([
        'business_name' => 'Spa Centro Merida',
        'contact_name' => 'Ana Lopez',
        'email' => 'ana@example.com',
        'phone' => '9991234567',
    ]);

    $response = $this->actingAs($admin)->get('/admin/sample-requests');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/merida-sample-requests/Index')
        ->where('sampleRequests.total', 1)
        ->where('sampleRequests.data.0.business_name', 'Spa Centro Merida')
        ->where('sampleRequests.data.0.contact_name', 'Ana Lopez')
        ->where('sampleRequests.data.0.user.name', 'Spa Buyer')
        ->missing('sampleRequests.data.0.ip_address')
        ->missing('sampleRequests.data.0.user_agent')
        ->has('filters')
    );
});

test('admin can search Merida sample requests', function () {
    $admin = User::factory()->admin()->create();

    MeridaSampleRequest::factory()->create(['business_name' => 'Spa Zen Merida']);
    MeridaSampleRequest::factory()->create(['business_name' => 'Hotel Centro']);

    $response = $this->actingAs($admin)->get('/admin/sample-requests?search=Zen');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('sampleRequests.total', 1)
        ->where('sampleRequests.data.0.business_name', 'Spa Zen Merida')
        ->where('filters.search', 'Zen')
    );
});

test('admin can filter Merida sample requests by status', function () {
    $admin = User::factory()->admin()->create();

    MeridaSampleRequest::factory()->create([
        'business_name' => 'Spa Pendiente',
        'status' => 'pending',
    ]);
    MeridaSampleRequest::factory()->create([
        'business_name' => 'Spa Contactado',
        'status' => 'contacted',
    ]);

    $response = $this->actingAs($admin)->get('/admin/sample-requests?status=contacted');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('sampleRequests.total', 1)
        ->where('sampleRequests.data.0.business_name', 'Spa Contactado')
        ->where('filters.status', 'contacted')
    );
});

test('non-admin cannot access Merida sample requests', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/admin/sample-requests');

    $response->assertForbidden();
});
