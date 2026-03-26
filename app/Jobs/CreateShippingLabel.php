<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\SkydropxService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class CreateShippingLabel implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [60, 300, 900];

    public function __construct(public Order $order)
    {
        $this->afterCommit();
    }

    public function handle(SkydropxService $skydropx): void
    {
        if ($this->order->hasShippingLabel()) {
            $this->order->update(['label_error' => null]);

            return;
        }

        if (! $this->order->isSkydropxShipment()) {
            return;
        }

        if ($this->order->payment_status !== 'completed') {
            return;
        }

        if ($this->order->skydropx_shipment_id) {
            $result = $skydropx->getTracking($this->order->skydropx_shipment_id);
        } else {
            $carrierParts = $this->parseCarrier($this->order->shipping_carrier);

            if (! $carrierParts) {
                $this->order->update(['label_error' => 'No se pudo determinar la paquetería del pedido.']);

                return;
            }

            $addressTo = $this->buildAddressTo();

            $result = $skydropx->createShipment($addressTo, $this->order);
        }

        if (! $result) {
            $this->order->update(['label_error' => 'Skydropx no pudo crear el envío. Se reintentará.']);

            throw new \RuntimeException('Skydropx shipment creation returned null');
        }

        $labelUrl = $result['label_url'];

        if (! $labelUrl && $result['id']) {
            $labelUrl = $skydropx->getLabel($result['id']);
        }

        $updateData = [
            'skydropx_shipment_id' => $result['id'],
            'label_error' => null,
        ];

        if ($labelUrl) {
            $updateData['label_url'] = $labelUrl;
        }

        if ($result['tracking_number']) {
            $updateData['tracking_number'] = $result['tracking_number'];
        }

        if ($result['tracking_url']) {
            $updateData['tracking_url'] = $result['tracking_url'];
        }

        $this->order->update($updateData);
    }

    public function failed(\Throwable $e): void
    {
        Log::error('CreateShippingLabel job failed', [
            'order_id' => $this->order->id,
            'message' => $e->getMessage(),
        ]);

        $this->order->update([
            'label_error' => $e->getMessage(),
        ]);
    }

    /**
     * @return array{carrier: string, service: string}|null
     */
    private function parseCarrier(?string $shippingCarrier): ?array
    {
        if (! $shippingCarrier || ! str_contains($shippingCarrier, ' - ')) {
            return null;
        }

        [$carrier, $service] = explode(' - ', $shippingCarrier, 2);

        return [
            'carrier' => trim($carrier),
            'service' => trim($service),
        ];
    }

    /**
     * @return array{postal_code: string, city: string, state: string,
     *               neighborhood: string, name: string, street: string,
     *               phone: string, email: string, reference: string}
     */
    private function buildAddressTo(): array
    {
        $address = $this->order->shipping_address;

        return [
            'postal_code' => $address['postal_code'] ?? '',
            'city' => $address['city'] ?? '',
            'state' => $address['state'] ?? '',
            'neighborhood' => $address['address_line_2'] ?? '',
            'name' => $address['name'] ?? '',
            'street' => $address['address_line_1'] ?? '',
            'phone' => $address['phone'] ?? '',
            'email' => $this->order->user?->email ?? '',
            'reference' => $address['reference'] ?? $address['address_line_2'] ?? '',
        ];
    }
}
