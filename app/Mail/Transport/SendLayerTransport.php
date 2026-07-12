<?php

namespace App\Mail\Transport;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Symfony\Component\Mailer\Exception\TransportException;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\MessageConverter;
use Symfony\Component\Mime\Part\DataPart;

/**
 * Sends mail through SendLayer's HTTP API instead of SMTP.
 *
 * Outbound SMTP is blocked by the host provider, so port 587 hangs until the
 * queue worker kills the job. HTTPS is not subject to that policy.
 */
class SendLayerTransport extends AbstractTransport
{
    public function __construct(
        private readonly string $endpoint,
        private readonly string $apiKey,
        private readonly int $timeout = 15,
        private readonly int $connectTimeout = 5,
    ) {
        parent::__construct();
    }

    protected function doSend(SentMessage $message): void
    {
        $email = MessageConverter::toEmail($message->getOriginalMessage());

        try {
            $response = Http::withToken($this->apiKey)
                ->connectTimeout($this->connectTimeout)
                ->timeout($this->timeout)
                ->asJson()
                ->post(rtrim($this->endpoint, '/').'/email', $this->payload($email))
                ->throw();
        } catch (RequestException $e) {
            throw new TransportException(sprintf(
                'SendLayer rejected the message (HTTP %d): %s',
                $e->response->status(),
                Str::limit($e->response->body(), 500),
            ), 0, $e);
        } catch (ConnectionException $e) {
            throw new TransportException('Could not reach SendLayer: '.$e->getMessage(), 0, $e);
        }

        $messageId = $response->json('MessageID');

        if (is_string($messageId)) {
            $message->setMessageId($messageId);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(Email $email): array
    {
        $html = $this->body($email->getHtmlBody());
        $text = $this->body($email->getTextBody());

        if ($html === null && $text === null) {
            throw new TransportException('The message has no body to send.');
        }

        $payload = [
            'From' => $this->address($email->getFrom()[0]),
            'To' => $this->addresses($email->getTo()),
            'Subject' => $email->getSubject() ?? '',
            'ContentType' => 'HTML',
            'HTMLContent' => $html ?? '<pre>'.e($text).'</pre>',
        ];

        if ($text !== null) {
            $payload['PlainContent'] = $text;
        }

        foreach (['CC' => $email->getCc(), 'BCC' => $email->getBcc(), 'ReplyTo' => $email->getReplyTo()] as $key => $addresses) {
            if ($addresses !== []) {
                $payload[$key] = $this->addresses($addresses);
            }
        }

        $attachments = $this->attachments($email);

        if ($attachments !== []) {
            $payload['Attachments'] = $attachments;
        }

        return $payload;
    }

    /**
     * @param  array<int, Address>  $addresses
     * @return array<int, array<string, string>>
     */
    private function addresses(array $addresses): array
    {
        return array_map(fn (Address $address): array => $this->address($address), $addresses);
    }

    /**
     * @return array<string, string>
     */
    private function address(Address $address): array
    {
        return array_filter([
            'email' => $address->getAddress(),
            'name' => $address->getName(),
        ], fn (string $value): bool => $value !== '');
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function attachments(Email $email): array
    {
        return array_map(fn (DataPart $part): array => [
            'Content' => base64_encode($part->getBody()),
            'Type' => $part->getMediaType().'/'.$part->getMediaSubtype(),
            'Filename' => $part->getFilename() ?? 'attachment',
            'Disposition' => $part->getDisposition() ?? 'attachment',
        ], $email->getAttachments());
    }

    /**
     * Bodies may be a string or a stream, depending on how the message was built.
     *
     * @param  resource|string|null  $body
     */
    private function body(mixed $body): ?string
    {
        if (is_resource($body)) {
            $body = stream_get_contents($body);
        }

        return is_string($body) && $body !== '' ? $body : null;
    }

    public function __toString(): string
    {
        return 'sendlayer';
    }
}
