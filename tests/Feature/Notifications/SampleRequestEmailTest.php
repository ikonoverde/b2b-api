<?php

use App\Models\MeridaSampleRequest;
use App\Models\User;
use App\Notifications\SampleRequest\NewMeridaSampleRequest;

function sampleRequestNotification(array $overrides = []): NewMeridaSampleRequest
{
    return new NewMeridaSampleRequest(new MeridaSampleRequest(array_merge([
        'business_name' => 'Spa Yucatán',
        'contact_name' => 'María López',
        'email' => 'maria@spa.mx',
        'phone' => '9991234567',
        'business_type' => 'Spa',
        'client_volume' => '50-100 clientes/mes',
        'products_interested' => ['Aceite de masaje', 'Crema corporal'],
    ], $overrides)));
}

it('renders the sample request email in spanish with the brand template', function () {
    $notification = sampleRequestNotification();

    $mailMessage = $notification->toMail(new User(['name' => 'Admin']));
    $rendered = (string) $mailMessage->render();

    expect($mailMessage->subject)->toContain('Nueva solicitud de muestras gratis')
        ->and($mailMessage->subject)->toContain('Spa Yucatán');

    expect($rendered)
        ->toContain('Nueva solicitud de muestras')
        ->toContain('Un negocio solicitó muestras gratis desde la campaña de Mérida.')
        ->toContain('Panel de administración')
        ->toContain('Spa Yucatán')
        ->toContain('María López')
        ->toContain('maria@spa.mx')
        ->toContain('Teléfono')
        ->toContain('9991234567')
        ->toContain('Aceite de masaje')
        ->toContain('Crema corporal')
        ->toContain('Ver solicitudes')
        ->toContain('#006871');
});

it('omits optional rows that are empty', function () {
    $rendered = (string) sampleRequestNotification(['phone' => null, 'social_url' => null])
        ->toMail(new User(['name' => 'Admin']))
        ->render();

    expect($rendered)
        ->not->toContain('Teléfono')
        ->not->toContain('Perfil social')
        ->toContain('Spa Yucatán');
});

it('leaves no english copy from the framework default', function () {
    $rendered = (string) sampleRequestNotification()->toMail(new User(['name' => 'Admin']))->render();

    expect($rendered)
        ->not->toContain('Regards')
        ->not->toContain('All rights reserved')
        ->not->toContain('having trouble clicking')
        ->not->toContain('Hello');
});
