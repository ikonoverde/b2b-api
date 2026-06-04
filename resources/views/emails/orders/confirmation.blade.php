@php
    $paymentStatusLabels = [
        'completed' => 'Confirmado',
        'paid' => 'Confirmado',
        'pending' => 'Pendiente',
        'unpaid' => 'Pendiente',
        'failed' => 'Fallido',
        'refunded' => 'Reembolsado',
    ];

    $orderStatusLabels = [
        'payment_pending' => 'Pago pendiente',
        'pending' => 'Recibido',
        'processing' => 'En preparación',
        'shipped' => 'Enviado',
        'delivered' => 'Entregado',
        'cancelled' => 'Cancelado',
    ];

    $paymentStatus = $paymentStatusLabels[$order->payment_status] ?? ucfirst((string) $order->payment_status);
    $orderStatus = $orderStatusLabels[$order->status] ?? ucfirst((string) $order->status);
    $subtotal = (float) $order->total_amount - (float) $order->shipping_cost;

    $paymentTone = match (true) {
        in_array($order->payment_status, ['completed', 'paid'], true) => 'success',
        in_array($order->payment_status, ['pending', 'unpaid'], true) => 'warning',
        $order->payment_status === 'failed' => 'error',
        $order->payment_status === 'refunded' => 'neutral',
        default => 'neutral',
    };

    $toneStyles = [
        'success' => ['bg' => '#dcefef', 'text' => '#005159', 'dot' => '#006871'],
        'warning' => ['bg' => '#f6ecd9', 'text' => '#7a4f10', 'dot' => '#ca933e'],
        'error' => ['bg' => '#f6dede', 'text' => '#931c21', 'dot' => '#b32228'],
        'neutral' => ['bg' => '#e6eff0', 'text' => '#586767', 'dot' => '#586767'],
    ];
    $tone = $toneStyles[$paymentTone];

    $serif = "Georgia, 'Times New Roman', serif";
    $sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    $mono = "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";

    $orderUrl = config('app.url').'/account/orders/'.$order->id;
@endphp
<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Pago confirmado: Pedido #{{ $order->id }}</title>
    <style>
        body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table { border-collapse: collapse; }
        img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
        a { color: #006871; }
        .num { font-variant-numeric: tabular-nums; }
        @media only screen and (max-width: 620px) {
            .container { width: 100% !important; }
            .pad { padding-left: 24px !important; padding-right: 24px !important; }
        }
    </style>
</head>
<body style="margin:0; padding:0; background-color:#dce7e8;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; font-size:1px; line-height:1px; color:#dce7e8;">
        Comprobante de compra — Pedido #{{ $order->id }}. Total pagado ${{ number_format((float) $order->total_amount, 2) }}.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#dce7e8;">
        <tr>
            <td align="center" style="padding:32px 16px;">
                <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#ebf6f7; border:1px solid #dce7e8;">

                    {{-- Header / wordmark --}}
                    <tr>
                        <td class="pad" style="padding:28px 40px 24px 40px; border-bottom:1px solid #dce7e8;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="font-family:{{ $sans }}; font-size:18px; font-weight:600; letter-spacing:-0.01em; color:#0f1d1e;">
                                        Ikono<span style="color:#1a9d11;">verde</span>
                                    </td>
                                    <td align="right" style="font-family:{{ $sans }}; font-size:11px; font-weight:500; letter-spacing:0.06em; color:#586767; text-transform:uppercase;">
                                        Comprobante de compra
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Hero: payment confirmed --}}
                    <tr>
                        <td class="pad" style="padding:40px 40px 8px 40px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td valign="middle" style="width:40px; height:40px; background-color:#006871; border-radius:20px; text-align:center; font-family:{{ $sans }}; font-size:20px; line-height:40px; color:#f3fafa;">
                                        &#10003;
                                    </td>
                                    <td valign="middle" style="padding-left:16px; font-family:{{ $sans }}; font-size:12px; font-weight:500; letter-spacing:0.06em; color:#006871; text-transform:uppercase;">
                                        Pago recibido
                                    </td>
                                </tr>
                            </table>
                            <h1 style="margin:24px 0 0 0; font-family:{{ $serif }}; font-size:34px; line-height:1.1; font-weight:400; letter-spacing:-0.01em; color:#0f1d1e;">
                                Pago confirmado
                            </h1>
                        </td>
                    </tr>

                    {{-- Intro copy --}}
                    <tr>
                        <td class="pad" style="padding:16px 40px 8px 40px; font-family:{{ $sans }}; font-size:15px; line-height:1.55; color:#3a4a4b;">
                            Hola {{ $user->name }}. Hemos confirmado el pago de tu pedido. Conserva este correo como comprobante de compra.
                        </td>
                    </tr>

                    {{-- Order meta --}}
                    <tr>
                        <td class="pad" style="padding:24px 40px 8px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4fafa; border:1px solid #dce7e8;">
                                <tr>
                                    <td style="padding:18px 20px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:{{ $sans }}; font-size:13px;">
                                            <tr>
                                                <td style="padding:6px 0; color:#586767;">Pedido</td>
                                                <td align="right" style="padding:6px 0; font-family:{{ $mono }}; font-size:13px; color:#0f1d1e;">#{{ $order->id }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0; color:#586767; border-top:1px solid #e4eeef;">Fecha de pago</td>
                                                <td align="right" class="num" style="padding:6px 0; font-family:{{ $mono }}; font-size:13px; color:#0f1d1e; border-top:1px solid #e4eeef;">{{ $order->updated_at->format('d/m/Y H:i') }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0; color:#586767; border-top:1px solid #e4eeef;">Pago</td>
                                                <td align="right" style="padding:6px 0; border-top:1px solid #e4eeef;">
                                                    <span style="display:inline-block; padding:3px 10px; border-radius:11px; background-color:{{ $tone['bg'] }}; font-family:{{ $sans }}; font-size:12px; font-weight:600; color:{{ $tone['text'] }};">
                                                        <span style="color:{{ $tone['dot'] }};">&#9679;</span>&nbsp;{{ $paymentStatus }}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0; color:#586767; border-top:1px solid #e4eeef;">Estado del pedido</td>
                                                <td align="right" style="padding:6px 0; font-family:{{ $sans }}; font-size:13px; font-weight:500; color:#0f1d1e; border-top:1px solid #e4eeef;">{{ $orderStatus }}</td>
                                            </tr>
                                            @if($order->payment_intent_id)
                                            <tr>
                                                <td style="padding:6px 0; color:#586767; border-top:1px solid #e4eeef;">Referencia de pago</td>
                                                <td align="right" style="padding:6px 0; font-family:{{ $mono }}; font-size:12px; color:#586767; border-top:1px solid #e4eeef; word-break:break-all;">{{ $order->payment_intent_id }}</td>
                                            </tr>
                                            @endif
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Products --}}
                    <tr>
                        <td class="pad" style="padding:28px 40px 0 40px; font-family:{{ $sans }}; font-size:11px; font-weight:500; letter-spacing:0.06em; color:#586767; text-transform:uppercase;">
                            Productos pagados
                        </td>
                    </tr>
                    <tr>
                        <td class="pad" style="padding:12px 40px 0 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding:0 0 8px 0; font-family:{{ $sans }}; font-size:11px; font-weight:600; letter-spacing:0.04em; color:#586767; border-bottom:1px solid #dce7e8;">Producto</td>
                                    <td align="center" style="padding:0 0 8px 0; font-family:{{ $sans }}; font-size:11px; font-weight:600; letter-spacing:0.04em; color:#586767; border-bottom:1px solid #dce7e8;">Cant.</td>
                                    <td align="right" style="padding:0 8px 8px 8px; font-family:{{ $sans }}; font-size:11px; font-weight:600; letter-spacing:0.04em; color:#586767; border-bottom:1px solid #dce7e8;">Unitario</td>
                                    <td align="right" style="padding:0 0 8px 0; font-family:{{ $sans }}; font-size:11px; font-weight:600; letter-spacing:0.04em; color:#586767; border-bottom:1px solid #dce7e8;">Subtotal</td>
                                </tr>
                                @foreach($order->items as $item)
                                <tr>
                                    <td style="padding:12px 8px 12px 0; font-family:{{ $sans }}; font-size:14px; color:#0f1d1e; border-bottom:1px solid #e4eeef;">{{ $item->product_name }}</td>
                                    <td align="center" class="num" style="padding:12px 0; font-family:{{ $mono }}; font-size:13px; color:#0f1d1e; border-bottom:1px solid #e4eeef;">{{ $item->quantity }}</td>
                                    <td align="right" class="num" style="padding:12px 8px; font-family:{{ $mono }}; font-size:13px; color:#586767; border-bottom:1px solid #e4eeef;">${{ number_format((float) $item->unit_price, 2) }}</td>
                                    <td align="right" class="num" style="padding:12px 0; font-family:{{ $mono }}; font-size:13px; color:#0f1d1e; border-bottom:1px solid #e4eeef;">${{ number_format((float) $item->subtotal, 2) }}</td>
                                </tr>
                                @endforeach
                            </table>
                        </td>
                    </tr>

                    {{-- Totals --}}
                    <tr>
                        <td class="pad" style="padding:20px 40px 0 40px;">
                            <table role="presentation" align="right" cellpadding="0" cellspacing="0" style="width:280px;">
                                <tr>
                                    <td style="padding:5px 0; font-family:{{ $sans }}; font-size:13px; color:#586767;">Subtotal</td>
                                    <td align="right" class="num" style="padding:5px 0; font-family:{{ $mono }}; font-size:13px; color:#0f1d1e;">${{ number_format($subtotal, 2) }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:5px 0; font-family:{{ $sans }}; font-size:13px; color:#586767;">Envío</td>
                                    <td align="right" class="num" style="padding:5px 0; font-family:{{ $mono }}; font-size:13px; color:#0f1d1e;">${{ number_format((float) $order->shipping_cost, 2) }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0 0 0; font-family:{{ $sans }}; font-size:14px; font-weight:600; color:#0f1d1e; border-top:1px solid #dce7e8;">Total pagado</td>
                                    <td align="right" class="num" style="padding:12px 0 0 0; font-family:{{ $mono }}; font-size:18px; font-weight:700; color:#0f1d1e; border-top:1px solid #dce7e8;">${{ number_format((float) $order->total_amount, 2) }}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    @if($order->shippingMethod)
                    <tr>
                        <td class="pad" style="padding:28px 40px 0 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="font-family:{{ $sans }}; font-size:13px; color:#586767;">Método de envío</td>
                                    <td align="right" style="font-family:{{ $sans }}; font-size:13px; font-weight:500; color:#0f1d1e;">{{ $order->shippingMethod->name }}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    @endif

                    @include('emails.orders.partials.shipping-address', ['order' => $order])

                    {{-- Note --}}
                    <tr>
                        <td class="pad" style="padding:28px 40px 0 40px; font-family:{{ $sans }}; font-size:14px; line-height:1.55; color:#3a4a4b;">
                            Te avisaremos cuando el pedido avance a preparación o envío.
                        </td>
                    </tr>

                    {{-- CTA --}}
                    <tr>
                        <td class="pad" style="padding:28px 40px 8px 40px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" bgcolor="#006871" style="background-color:#006871;">
                                        <a href="{{ $orderUrl }}" target="_blank" style="display:inline-block; padding:13px 32px; font-family:{{ $sans }}; font-size:14px; font-weight:600; letter-spacing:0.01em; color:#f3fafa; text-decoration:none;">
                                            Ver pedido
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td class="pad" style="padding:36px 40px 32px 40px; border-top:1px solid #dce7e8;">
                            <div style="font-family:{{ $sans }}; font-size:13px; line-height:1.55; color:#586767;">
                                Gracias,<br>
                                <span style="color:#0f1d1e; font-weight:600;">Ikono<span style="color:#1a9d11;">verde</span></span>
                            </div>
                            <div style="margin-top:14px; font-family:{{ $sans }}; font-size:11px; line-height:1.5; color:#8a9696;">
                                Si no reconoces esta compra, responde a este correo.
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
