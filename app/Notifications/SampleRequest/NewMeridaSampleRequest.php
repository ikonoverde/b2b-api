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
        $message = (new MailMessage)
            ->subject('Nueva solicitud de muestras gratis: '.$this->sampleRequest->business_name)
            ->greeting('Nueva solicitud de muestras gratis')
            ->line('Un negocio solicitó muestras gratis desde la campaña de Mérida.')
            ->line('Negocio: '.$this->sampleRequest->business_name)
            ->line('Contacto: '.$this->sampleRequest->contact_name)
            ->line('Correo: '.$this->sampleRequest->email)
            ->line('Tipo de negocio: '.$this->sampleRequest->business_type)
            ->line('Volumen: '.$this->sampleRequest->client_volume)
            ->line('Productos de interés: '.implode(', ', $this->sampleRequest->products_interested ?? []))
            ->action('Ver solicitudes', route('admin.sample-requests'));

        if ($this->sampleRequest->phone) {
            $message->line('Teléfono: '.$this->sampleRequest->phone);
        }

        if ($this->sampleRequest->social_url) {
            $message->line('Perfil social: '.$this->sampleRequest->social_url);
        }

        if ($this->sampleRequest->user) {
            $message->line('Usuario asociado: '.$this->sampleRequest->user->name.' <'.$this->sampleRequest->user->email.'>');
        }

        return $message;
    }
}
