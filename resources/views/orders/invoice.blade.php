<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura #{{ $order->id }} - {{ config('app.name') }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            padding: 40px;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 30px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #5E7052;
        }
        .company-info h1 {
            color: #5E7052;
            font-size: 24px;
            margin-bottom: 5px;
        }
        .invoice-title {
            text-align: right;
        }
        .invoice-title h2 {
            font-size: 28px;
            color: #333;
            margin-bottom: 5px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        .info-box {
            padding: 15px;
            background: #f9f9f9;
            border-radius: 5px;
        }
        .info-box h3 {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .info-box p {
            font-size: 14px;
            margin-bottom: 3px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th {
            background: #5E7052;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 14px;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
        }
        .text-right {
            text-align: right;
        }
        .totals {
            width: 300px;
            margin-left: auto;
            margin-top: 20px;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .totals-row.total {
            border-top: 2px solid #5E7052;
            border-bottom: none;
            font-weight: bold;
            font-size: 18px;
            padding-top: 15px;
            margin-top: 10px;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-payment_pending { background: #fff3cd; color: #856404; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-processing { background: #cce5ff; color: #004085; }
        .status-shipped { background: #d1ecf1; color: #0c5460; }
        .status-delivered { background: #d4edda; color: #155724; }
        .status-cancelled { background: #f8d7da; color: #721c24; }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        @media print {
            body {
                padding: 0;
            }
            .invoice-container {
                border: none;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="company-info">
                <h1>{{ $company['name'] }}</h1>
                <p>{{ $company['address'] }}</p>
                <p>Tel: {{ $company['phone'] }}</p>
                <p>Email: {{ $company['email'] }}</p>
            </div>
            <div class="invoice-title">
                <h2>FACTURA</h2>
                <p><strong>#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</strong></p>
                <span class="status-badge status-{{ $order->status }}">
                    {{ $order->status === 'payment_pending' ? 'Pago Pendiente' :
                       ($order->status === 'pending' ? 'Pendiente' :
                       ($order->status === 'processing' ? 'Procesando' :
                       ($order->status === 'shipped' ? 'Enviado' :
                       ($order->status === 'delivered' ? 'Entregado' :
                       ($order->status === 'cancelled' ? 'Cancelado' : $order->status))))) }}
                </span>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-box">
                <h3>Facturar a:</h3>
                <p><strong>{{ $order->user->name }}</strong></p>
                <p>{{ $order->user->email }}</p>
                @if($order->user->rfc)
                    <p>RFC: {{ $order->user->rfc }}</p>
                @endif
            </div>
            <div class="info-box">
                <h3>Información del Pedido:</h3>
                <p><strong>Fecha:</strong> {{ $order->created_at->format('d/m/Y H:i') }}</p>
                <p><strong>Estado de Pago:</strong>
                    {{ $order->payment_status === 'completed' ? 'Completado' :
                       ($order->payment_status === 'pending' ? 'Pendiente' :
                       ($order->payment_status === 'failed' ? 'Fallido' :
                       ($order->payment_status === 'refunded' ? 'Reembolsado' : $order->payment_status))) }}
                </p>
                @if($order->tracking_number)
                    <p><strong>Tracking:</strong> {{ $order->shipping_carrier }} - {{ $order->tracking_number }}</p>
                @endif
            </div>
        </div>

        @if($order->shipping_address)
        <div class="info-box" style="margin-bottom: 30px;">
            <h3>Dirección de Envío:</h3>
            <p>{{ $order->shipping_address['street'] ?? '' }}</p>
            <p>{{ $order->shipping_address['city'] ?? '' }}, {{ $order->shipping_address['state'] ?? '' }} {{ $order->shipping_address['zip'] ?? '' }}</p>
            <p>{{ $order->shipping_address['country'] ?? 'México' }}</p>
        </div>
        @endif

        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th class="text-right">Cantidad</th>
                    <th class="text-right">Precio Unit.</th>
                    <th class="text-right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->product_name }}</td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td class="text-right">${{ number_format($item->unit_price, 2) }}</td>
                    <td class="text-right">${{ number_format($item->subtotal, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <div class="totals-row">
                <span>Subtotal:</span>
                <span>${{ number_format($order->items->sum('subtotal'), 2) }}</span>
            </div>
            <div class="totals-row">
                <span>Envío:</span>
                <span>${{ number_format($order->shipping_cost, 2) }}</span>
            </div>
            @if($order->refunded_amount > 0)
            <div class="totals-row" style="color: #dc3545;">
                <span>Reembolsado:</span>
                <span>-${{ number_format($order->refunded_amount, 2) }}</span>
            </div>
            @endif
            <div class="totals-row total">
                <span>TOTAL:</span>
                <span>${{ number_format($order->total_amount, 2) }}</span>
            </div>
        </div>

        <div class="footer">
            <p>Gracias por su compra</p>
            <p>Si tiene alguna pregunta, contacte a {{ $company['email'] }}</p>
        </div>
    </div>
</body>
</html>
