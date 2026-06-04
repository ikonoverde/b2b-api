@php
    $address = $order->shipping_address ?? [];
    $street = $address['address_line_1'] ?? $address['street'] ?? null;
    $secondaryLine = $address['address_line_2'] ?? $address['neighborhood'] ?? null;
    $city = $address['city'] ?? null;
    $state = $address['state'] ?? null;
    $postalCode = $address['postal_code'] ?? $address['zip'] ?? null;
    $country = $address['country'] ?? null;
    $recipient = $address['name'] ?? $order->user?->name;
    $phone = $address['phone'] ?? $order->user?->phone;

    $cityStateLine = collect([$city, $state])->filter()->join(', ');
    $postalCountryLine = collect([$postalCode, $country])->filter()->join(', ');
@endphp

@if($street || $cityStateLine || $postalCountryLine || $recipient || $phone)
<tr>
    <td class="pad" style="padding:28px 40px 0 40px; font-family:{{ $sans }}; font-size:11px; font-weight:500; letter-spacing:0.06em; color:#586767; text-transform:uppercase;">
        Dirección de envío
    </td>
</tr>
<tr>
    <td class="pad" style="padding:10px 40px 0 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4fafa; border:1px solid #dce7e8;">
            <tr>
                <td style="padding:16px 20px; font-family:{{ $sans }}; font-size:13px; line-height:1.5; color:#0f1d1e;">
                    @if($recipient)
                        <div style="font-weight:600; color:#0f1d1e;">{{ $recipient }}</div>
                    @endif
                    @if($street)
                        <div>{{ $street }}</div>
                    @endif
                    @if($secondaryLine)
                        <div>{{ $secondaryLine }}</div>
                    @endif
                    @if($cityStateLine)
                        <div>{{ $cityStateLine }}</div>
                    @endif
                    @if($postalCountryLine)
                        <div>{{ $postalCountryLine }}</div>
                    @endif
                    @if($phone)
                        <div style="margin-top:8px; font-family:{{ $mono }}; font-size:12px; color:#586767;">Tel. {{ $phone }}</div>
                    @endif
                </td>
            </tr>
        </table>
    </td>
</tr>
@endif
