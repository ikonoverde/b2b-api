<?php

namespace App\Notifications\SampleRequest;

use App\Models\MeridaSampleRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewMeridaSampleRequest extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [30, 120, 600];

    /**
     * Create a new notification instance.
     */
    public function __construct(public MeridaSampleRequest $sampleRequest)
    {
        $this->sampleRequest->load('user');
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nueva solicitud de muestras gratis: '.$this->sampleRequest->business_name)
            ->view('emails.sample-requests.new-request', [
                'sampleRequest' => $this->sampleRequest,
                'adminUrl' => route('admin.sample-requests'),
            ]);
    }
}
