<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\SkydropxService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

/**
 * @phpstan-type ShipmentResult array{
 *     id: string,
 *     tracking_number: string|null,
 *     tracking_url: string|null,
 *     label_url: string|null,
 * }
 */
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

        if (! $this->order->isSkydropxShipment() || $this->order->payment_status !== 'completed') {
            return;
        }

        $result = $this->fetchShipmentResult($skydropx);

        if ($result === null) {
            return;
        }

        $this->order->update($this->buildUpdateData($result, $this->resolveLabelUrl($result, $skydropx)));
    }

    /**
     * @param  ShipmentResult  $result
     */
    private function resolveLabelUrl(array $result, SkydropxService $skydropx): ?string
    {
        if ($result['label_url']) {
            return $result['label_url'];
        }

        return $result['id'] ? $skydropx->getLabel($result['id']) : null;
    }

    /**
     * @return ShipmentResult|null
     */
    private function fetchShipmentResult(SkydropxService $skydropx): ?array
    {
        if ($this->order->skydropx_shipment_id) {
            $result = $skydropx->getTracking($this->order->skydropx_shipment_id);
        } else {
            if (! $this->parseCarrier($this->order->shipping_carrier)) {
                $this->order->update(['label_error' => 'No se pudo determinar la paquetería del pedido.']);

                return null;
            }

            $result = $skydropx->createShipment($this->buildAddressTo(), $this->order);
        }

        if (! $result) {
            $this->order->update(['label_error' => 'Skydropx no pudo crear el envío. Se reintentará.']);

            throw new \RuntimeException('Skydropx shipment creation returned null');
        }

        return $result;
    }

    /**
     * @param  ShipmentResult  $result
     * @return array<string, mixed>
     */
    private function buildUpdateData(array $result, ?string $labelUrl): array
    {
        $optional = array_filter([
            'label_url' => $labelUrl,
            'tracking_number' => $result['tracking_number'],
            'tracking_url' => $result['tracking_url'],
        ]);

        return [
            'skydropx_shipment_id' => $result['id'],
            'label_error' => null,
            ...$optional,
        ];
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
        $address = ($this->order->shipping_address ?? []) + [
            'postal_code' => '',
            'city' => '',
            'state' => '',
            'address_line_1' => '',
            'address_line_2' => '',
            'name' => '',
            'phone' => '',
            'reference' => null,
        ];

        return [
            'postal_code' => $address['postal_code'],
            'city' => $address['city'],
            'state' => $address['state'],
            'neighborhood' => $address['address_line_2'],
            'name' => $address['name'],
            'street' => $address['address_line_1'],
            'phone' => $address['phone'],
            'email' => $this->order->user?->email ?? '',
            'reference' => $address['reference'] ?? $address['address_line_2'],
        ];
    }
}
