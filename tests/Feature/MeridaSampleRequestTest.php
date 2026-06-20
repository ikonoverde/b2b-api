<?php

use App\Models\MeridaSampleRequest;
use App\Models\User;
use App\Notifications\SampleRequest\NewMeridaSampleRequest;
use Illuminate\Support\Facades\Notification;

function validMeridaSamplePayload(array $overrides = []): array
{
    return [
        'business_name' => 'Spa Centro Mérida',
        'contact_name' => 'Ana López',
        'email' => 'ana@example.com',
        'phone' => '9991234567',
        'business_type' => 'SPA (Day Spa)',
        'client_volume' => '11-30 masajes/semana',
        'social_url' => 'https://instagram.com/spacentromerida',
        'products_interested' => ['Aceites', 'Gel After Sun'],
        'improvement_goals' => ['Mejor precio/rendimiento', 'Proveedor local más rápido'],
        ...$overrides,
    ];
}

it('renders the Merida sample request page', function () {
    $response = $this->get('/muestras-gratis-merida');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('MeridaSamples')
        ->where('options.businessTypes.0', 'Terapeuta independiente')
        ->where('options.products.0', 'Aceites')
    );
});

it('allows successful submissions to reset scroll to the confirmation message', function () {
    $page = file_get_contents(resource_path('js/Pages/MeridaSamples.tsx'));

    expect($page)
        ->toContain('Solicitud enviada')
        ->toContain('window.setTimeout')
        ->toContain('scrollIntoView')
        ->not->toContain('preserveScroll: true');
});

it('stores a Merida sample request', function () {
    $response = $this->post('/muestras-gratis-merida', validMeridaSamplePayload());

    $response
        ->assertRedirect(route('merida-samples.show'))
        ->assertSessionHasNoErrors()
        ->assertSessionHas('success');

    $sampleRequest = MeridaSampleRequest::query()->firstOrFail();

    expect($sampleRequest->business_name)->toBe('Spa Centro Mérida')
        ->and($sampleRequest->contact_name)->toBe('Ana López')
        ->and($sampleRequest->email)->toBe('ana@example.com')
        ->and($sampleRequest->business_type)->toBe('SPA (Day Spa)')
        ->and($sampleRequest->client_volume)->toBe('11-30 masajes/semana')
        ->and($sampleRequest->products_interested)->toBe(['Aceites', 'Gel After Sun'])
        ->and($sampleRequest->improvement_goals)->toBe(['Mejor precio/rendimiento', 'Proveedor local más rápido'])
        ->and($sampleRequest->status)->toBe('pending');
});

it('emails active admin users when a Merida sample request is submitted', function () {
    Notification::fake();

    $admin = User::factory()->admin()->create();
    $superAdmin = User::factory()->superAdmin()->create();
    $inactiveAdmin = User::factory()->admin()->inactive()->create();
    $customer = User::factory()->create();

    $this->post('/muestras-gratis-merida', validMeridaSamplePayload())
        ->assertRedirect(route('merida-samples.show'));

    $sampleRequest = MeridaSampleRequest::query()->firstOrFail();

    Notification::assertSentTo($admin, NewMeridaSampleRequest::class, function (NewMeridaSampleRequest $notification, array $channels) use ($sampleRequest): bool {
        return in_array('mail', $channels, true)
            && $notification->sampleRequest->is($sampleRequest);
    });

    Notification::assertSentTo($superAdmin, NewMeridaSampleRequest::class, function (NewMeridaSampleRequest $notification, array $channels) use ($sampleRequest): bool {
        return in_array('mail', $channels, true)
            && $notification->sampleRequest->is($sampleRequest);
    });

    Notification::assertNotSentTo($inactiveAdmin, NewMeridaSampleRequest::class);
    Notification::assertNotSentTo($customer, NewMeridaSampleRequest::class);
    Notification::assertSentTimes(NewMeridaSampleRequest::class, 2);
});

it('associates sample requests with authenticated users', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/muestras-gratis-merida', validMeridaSamplePayload())
        ->assertRedirect(route('merida-samples.show'));

    expect(MeridaSampleRequest::query()->firstOrFail()->user)->toBeInstanceOf(User::class)
        ->and(MeridaSampleRequest::query()->firstOrFail()->user_id)->toBe($user->id);
});

it('validates required questionnaire answers', function () {
    $response = $this->post('/muestras-gratis-merida', []);

    $response->assertInvalid([
        'business_name',
        'contact_name',
        'email',
        'business_type',
        'client_volume',
        'products_interested',
        'improvement_goals',
    ]);

    expect(MeridaSampleRequest::query()->count())->toBe(0);
});

it('rejects unsupported questionnaire options', function () {
    $response = $this->post('/muestras-gratis-merida', validMeridaSamplePayload([
        'business_type' => 'Gimnasio',
        'products_interested' => ['Producto desconocido'],
    ]));

    $response->assertInvalid(['business_type', 'products_interested.0']);

    expect(MeridaSampleRequest::query()->count())->toBe(0);
});
