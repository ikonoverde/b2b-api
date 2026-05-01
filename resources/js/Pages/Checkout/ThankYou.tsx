import { Link } from '@inertiajs/react';
import CustomerShell from '@/Layouts/CustomerShell';
import CheckoutStepIndicator from '@/Components/CheckoutStepIndicator';
import OrderSummary from '@/Components/OrderSummary';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    image: string | null;
}

interface ThankYouProps {
    order: {
        id: number;
        status: string;
        payment_status: string;
        total_amount: number;
        shipping_cost: number;
        shipping_address: Record<string, string> | null;
        created_at: string;
        items: OrderItem[];
    };
}

export default function ThankYou({ order }: ThankYouProps) {
    const isProcessing = order.payment_status === 'pending';

    return (
        <CustomerShell title={isProcessing ? 'Procesando · Compra' : 'Pedido confirmado'}>
            <header className="flex flex-col gap-3">
                <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase">
                    {isProcessing ? 'Compra · Procesando' : 'Compra · Confirmada'}
                </span>
                <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                    {isProcessing ? 'Procesando tu pago' : 'Pedido confirmado'}
                </h1>
                <p className="max-w-[58ch] text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75">
                    {isProcessing
                        ? 'Tu pago está siendo confirmado. Te notificaremos cuando se complete y aparecerá en tu historial de pedidos.'
                        : 'Hemos recibido tu pedido. Te enviaremos los siguientes pasos por correo electrónico junto con la información de seguimiento.'}
                </p>
            </header>

            <div className="mt-10">
                <CheckoutStepIndicator currentStep={3} />
            </div>

            <section
                aria-labelledby="order-detail-heading"
                className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem]"
            >
                <div className="flex flex-col gap-8">
                    <div className="flex items-baseline justify-between border-b border-[var(--iko-stone-hairline)] pb-3">
                        <h2
                            id="order-detail-heading"
                            className="font-display text-[1.5rem] leading-tight text-[var(--iko-stone-ink)]"
                        >
                            Detalle del pedido
                        </h2>
                        <span className="font-spec text-[12px] tabular-nums tracking-[0.04em] text-[var(--iko-accent)] uppercase">
                            Pedido · {String(order.id).padStart(5, '0')}
                        </span>
                    </div>

                    {order.shipping_address && (
                        <ShippingAddressBlock address={order.shipping_address} />
                    )}

                    <div className="border border-[var(--iko-stone-hairline)] px-5 py-2">
                        <OrderSummary
                            items={order.items}
                            totalAmount={order.total_amount}
                            shippingCost={order.shipping_cost}
                            showCard={false}
                        />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href={`/account/orders/${order.id}`}
                            className="inline-flex h-12 items-center bg-[var(--iko-accent)] px-7 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                        >
                            Ver pedido
                        </Link>
                        <Link
                            href="/catalog"
                            className="inline-flex h-12 items-center border border-[var(--iko-stone-hairline)] px-7 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)] hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                        >
                            Seguir comprando
                        </Link>
                    </div>
                </div>

                <NextStepsPanel isProcessing={isProcessing} />
            </section>
        </CustomerShell>
    );
}

function ShippingAddressBlock({ address }: { address: Record<string, string> }) {
    return (
        <div className="border-y border-[var(--iko-stone-hairline)] py-5">
            <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                Dirección de envío
            </span>
            <p className="mt-3 text-[14px] leading-[1.7] text-[var(--iko-stone-ink)]">
                {address.name}
                <br />
                {address.address_line_1}
                {address.address_line_2 && `, ${address.address_line_2}`}
                <br />
                {address.city}, {address.state} {address.postal_code}
                {address.phone && (
                    <>
                        <br />
                        <span className="font-spec text-[12px] tabular-nums text-[var(--iko-stone-whisper)]">
                            Tel · {address.phone}
                        </span>
                    </>
                )}
            </p>
        </div>
    );
}

function NextStepsPanel({ isProcessing }: { isProcessing: boolean }) {
    const steps = isProcessing
        ? [
              { eyebrow: '01', title: 'Confirmación', body: 'Confirmaremos el pago en los próximos minutos.' },
              { eyebrow: '02', title: 'Notificación', body: 'Recibirás un correo con el detalle final del pedido.' },
              { eyebrow: '03', title: 'Envío', body: 'Coordinaremos el envío al confirmar el pago.' },
          ]
        : [
              { eyebrow: '01', title: 'Preparación', body: 'Preparamos tu pedido en las próximas 24 horas hábiles.' },
              { eyebrow: '02', title: 'Envío', body: 'Recibirás el número de seguimiento por correo electrónico.' },
              { eyebrow: '03', title: 'Reorden', body: 'Vuelve a pedir con un clic desde tu historial.' },
          ];

    return (
        <aside className="border border-[var(--iko-stone-hairline)] lg:sticky lg:top-24">
            <header className="border-b border-[var(--iko-stone-hairline)] px-5 py-4">
                <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase">
                    Próximos pasos
                </span>
            </header>
            <ol className="divide-y divide-[var(--iko-stone-hairline)]">
                {steps.map((step) => (
                    <li
                        key={step.eyebrow}
                        className="grid grid-cols-[2rem_1fr] gap-4 px-5 py-4"
                    >
                        <span className="font-spec text-[11px] tabular-nums text-[var(--iko-accent)]">
                            {step.eyebrow}
                        </span>
                        <span className="flex flex-col gap-1">
                            <span className="text-[14px] text-[var(--iko-stone-ink)]">
                                {step.title}
                            </span>
                            <span className="text-[13px] leading-[1.55] text-[var(--iko-stone-whisper)]">
                                {step.body}
                            </span>
                        </span>
                    </li>
                ))}
            </ol>
        </aside>
    );
}
