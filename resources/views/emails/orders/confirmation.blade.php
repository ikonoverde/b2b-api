@component('mail::message')
# Confirmación de Pedido

Hola {{ $user->name }},

Gracias por tu compra. Hemos recibido tu pedido correctamente.

**Número de Pedido:** #{{ $order->id }}  
**Fecha:** {{ $order->created_at->format('d/m/Y H:i') }}  
**Estado:** {{ ucfirst($order->status) }}

@component('mail::table')
| Producto | Cantidad | Precio | Subtotal |
|----------|----------|--------|----------|
@foreach($order->items as $item)
| {{ $item->product_name }} | {{ $item->quantity }} | ${{ number_format($item->unit_price, 2) }} | ${{ number_format($item->subtotal, 2) }} |
@endforeach
@endcomponent

**Subtotal:** ${{ number_format($order->total_amount - $order->shipping_cost, 2) }}  
**Envío:** ${{ number_format($order->shipping_cost, 2) }}  
**Total:** ${{ number_format($order->total_amount, 2) }}

@if($order->shippingMethod)
**Método de Envío:** {{ $order->shippingMethod->name }}
@endif

@if($order->tracking_number)
**Número de Rastreo:** {{ $order->tracking_number }}  
**Transportista:** {{ $order->shipping_carrier }}
@endif

@component('mail::button', ['url' => config('app.url').'/orders/'.$order->id, 'color' => 'primary'])
Ver Detalles del Pedido
@endcomponent

Gracias,  
{{ config('app.name') }}
@endcomponent
