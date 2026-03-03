<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationPreferencesResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'notify_order_updates' => $this->notify_order_updates,
            'notify_promotional_emails' => $this->notify_promotional_emails,
            'notify_newsletter' => $this->notify_newsletter,
        ];
    }
}
