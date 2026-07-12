<?php

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportException;

const SENDLAYER_ENDPOINT = 'https://console.sendlayer.com/api/v1/email';

beforeEach(function () {
    config()->set('mail.default', 'sendlayer');
    config()->set('mail.mailers.sendlayer', [
        'transport' => 'sendlayer',
        'key' => 'test-api-key',
        'endpoint' => 'https://console.sendlayer.com/api/v1',
        'timeout' => 15,
        'connect_timeout' => 5,
    ]);
    config()->set('mail.from', ['address' => 'info@ikonoverde.com', 'name' => 'Ikonoverde']);
});

function fakeSendLayer(array $response = ['MessageID' => 'abc-123'], int $status = 200): void
{
    Http::fake([SENDLAYER_ENDPOINT => Http::response($response, $status)]);
}

it('posts the message to the sendlayer api with a bearer token', function () {
    fakeSendLayer();

    Mail::html('<p>Hola</p>', function (Message $message) {
        $message->to('cliente@example.com', 'Cliente')->subject('Pedido enviado');
    });

    Http::assertSent(function (Request $request) {
        expect($request->url())->toBe(SENDLAYER_ENDPOINT)
            ->and($request->method())->toBe('POST')
            ->and($request->hasHeader('Authorization', 'Bearer test-api-key'))->toBeTrue();

        expect($request->data())
            ->toHaveKey('From', ['email' => 'info@ikonoverde.com', 'name' => 'Ikonoverde'])
            ->toHaveKey('To', [['email' => 'cliente@example.com', 'name' => 'Cliente']])
            ->toHaveKey('Subject', 'Pedido enviado')
            ->toHaveKey('ContentType', 'HTML')
            ->toHaveKey('HTMLContent', '<p>Hola</p>');

        return true;
    });
});

it('includes cc, bcc and reply-to recipients', function () {
    fakeSendLayer();

    Mail::html('<p>Hola</p>', function (Message $message) {
        $message->to('cliente@example.com')
            ->cc('ventas@ikonoverde.com', 'Ventas')
            ->bcc('registro@ikonoverde.com')
            ->replyTo('soporte@ikonoverde.com', 'Soporte')
            ->subject('Pedido');
    });

    Http::assertSent(function (Request $request) {
        expect($request->data())
            ->toHaveKey('CC', [['email' => 'ventas@ikonoverde.com', 'name' => 'Ventas']])
            ->toHaveKey('BCC', [['email' => 'registro@ikonoverde.com']])
            ->toHaveKey('ReplyTo', [['email' => 'soporte@ikonoverde.com', 'name' => 'Soporte']]);

        return true;
    });
});

it('sends the plain text part alongside the html body', function () {
    fakeSendLayer();

    Mail::send([], [], function (Message $message) {
        $message->to('cliente@example.com')
            ->subject('Pedido')
            ->html('<p>Hola</p>')
            ->text('Hola');
    });

    Http::assertSent(function (Request $request) {
        expect($request->data())
            ->toHaveKey('HTMLContent', '<p>Hola</p>')
            ->toHaveKey('PlainContent', 'Hola');

        return true;
    });
});

it('base64 encodes attachments', function () {
    fakeSendLayer();

    Mail::html('<p>Guía de envío</p>', function (Message $message) {
        $message->to('cliente@example.com')
            ->subject('Guía')
            ->attachData('label-pdf-bytes', 'guia.pdf', ['mime' => 'application/pdf']);
    });

    Http::assertSent(function (Request $request) {
        expect($request->data()['Attachments'])->toBe([[
            'Content' => base64_encode('label-pdf-bytes'),
            'Type' => 'application/pdf',
            'Filename' => 'guia.pdf',
            'Disposition' => 'attachment',
        ]]);

        return true;
    });
});

it('throws when sendlayer rejects the message', function () {
    fakeSendLayer(['Error' => 'Invalid API key'], 401);

    Mail::html('<p>Hola</p>', function (Message $message) {
        $message->to('cliente@example.com')->subject('Pedido');
    });
})->throws(TransportException::class, 'SendLayer rejected the message (HTTP 401)');

it('throws when sendlayer is unreachable', function () {
    Http::fake(fn () => throw new ConnectionException('cURL error 28: Operation timed out'));

    Mail::html('<p>Hola</p>', function (Message $message) {
        $message->to('cliente@example.com')->subject('Pedido');
    });
})->throws(TransportException::class, 'Could not reach SendLayer');
