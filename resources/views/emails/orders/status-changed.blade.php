@component('mail::message')
# Actualización de Estado de Pedido

Hola {{ $user->name }},

Te informamos que el estado de tu pedido ha sido actualizado.

**Número de Pedido:** #{{ $order->id }}  
**Estado Anterior:** {{ $oldStatus }}  
**Estado Actual:** {{ $newStatus }}

@if($order->status === 'processing')
Tu pedido está siendo preparado para el envío.
@elseif($order->status === 'shipped')
@if($trackingNumber)
**Número de Rastreo:** {{ $trackingNumber }}  
**Transportista:** {{ $shippingCarrier }}  
@if($trackingUrl)
**Enlace de Rastreo:** [Seguir Envío]({{ $trackingUrl }})
@endif
@endif
Tu pedido ha sido enviado y está en camino.
@elseif($order->status === 'delivered')
Tu pedido ha sido entregado exitosamente.
@elseif($order->status === 'cancelled')
Tu pedido ha sido cancelado. Si tienes alguna pregunta, por favor contáctanos.
@endif

**Resumen del Pedido:**

@component('mail::table')
| Producto | Cantidad | Precio |
|----------|----------|--------|
@foreach($order->items as $item)
| {{ $item->product_name }} | {{ $item->quantity }} | ${{ number_format($item->unit_price, 2) }} |
@endforeach
@endcomponent

**Total:** ${{ number_format($order->total_amount, 2) }}

@component('mail::button', ['url' => config('app.url').'/orders/'.$order->id, 'color' => 'primary'])
Ver Detalles del Pedido
@endcomponent

Gracias,  
{{ config('app.name') }}
@endcomponent
