import { Link } from '@inertiajs/react';
import { useEffect } from 'react';
import CustomerShell from '@/Layouts/CustomerShell';
import CheckoutStepIndicator from '@/Components/CheckoutStepIndicator';
import OrderSummary from '@/Components/OrderSummary';
import { formatCurrency } from '@/utils/currency';
import { META_PIXEL_CURRENCY, trackGoogleAnalyticsPurchase, trackMetaPurchase } from '@/utils/analytics';

interface OrderItem {
    id: number;
    product_id: number;
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
        meta_purchase_event_id: string | null;
        total_amount: number;
        shipping_cost: number;
        shipping_address: Record<string, string> | null;
        created_at: string;
        items: OrderItem[];
    };
}

type Tone = 'success' | 'warning' | 'danger' | 'neutral';

const PAYMENT_STATUS_LABELS: Record<string, string> = {
    pending: 'Pago pendiente',
    completed: 'Pago confirmado',
    failed: 'Pago fallido',
    refunded: 'Reembolsado',
    partially_refunded: 'Reembolso parcial',
};

const TONE_STYLES: Record<Tone, { bg: string; border: string; dot: string; text: string }> = {
    success: {
        bg: 'bg-[var(--iko-accent-mist)]',
        border: 'border-[var(--iko-accent-line)]',
        dot: 'bg-[var(--iko-accent)]',
        text: 'text-[var(--iko-accent-ink)]',
    },
    warning: {
        bg: 'bg-[var(--iko-caution-soft)]',
        border: 'border-[var(--iko-caution-line)]',
        dot: 'bg-[var(--iko-caution)]',
        text: 'text-[var(--iko-caution-ink)]',
    },
    danger: {
        bg: 'bg-[var(--iko-error-soft)]',
        border: 'border-[var(--iko-error-line)]',
        dot: 'bg-[var(--iko-error)]',
        text: 'text-[var(--iko-error-ink)]',
    },
    neutral: {
        bg: 'bg-[var(--iko-stone-surface)]',
        border: 'border-[var(--iko-stone-hairline)]',
        dot: 'bg-[var(--iko-stone-mid)]',
        text: 'text-[var(--iko-stone-whisper)]',
    },
};

function paymentToneFor(status: string): Tone {
    if (status === 'completed') {
        return 'success';
    }

    if (status === 'pending') {
        return 'warning';
    }

    if (status === 'failed' || status === 'cancelled') {
        return 'danger';
    }

    return 'neutral';
}

function headerCopyFor(status: string): { eyebrow: string; title: string; body: string } {
    if (status === 'pending') {
        return {
            eyebrow: 'Compra · Procesando',
            title: 'Procesando tu pago',
            body: 'Tu pago está siendo confirmado. Te notificaremos cuando se complete y aparecerá en tu historial de pedidos.',
        };
    }

    if (status === 'failed' || status === 'cancelled') {
        return {
            eyebrow: 'Compra · Revisión',
            title: 'Pago en revisión',
            body: 'No pudimos confirmar el pago todavía. Conservamos el pedido para que puedas revisarlo o intentar nuevamente.',
        };
    }

    return {
        eyebrow: 'Compra · Confirmada',
        title: 'Pedido confirmado',
        body: 'Hemos recibido tu pedido. Te enviaremos los siguientes pasos por correo electrónico junto con la información de seguimiento.',
    };
}

type PurchaseTrackingPlatform = 'ga4' | 'meta';

function purchaseStorageKey(platform: PurchaseTrackingPlatform, eventId: string): string {
    return `${platform}_purchase_tracked:${eventId}`;
}

function hasTrackedPurchase(platform: PurchaseTrackingPlatform, eventId: string): boolean {
    try {
        return window.localStorage.getItem(purchaseStorageKey(platform, eventId)) === '1';
    } catch {
        return false;
    }
}

function rememberTrackedPurchase(platform: PurchaseTrackingPlatform, eventId: string): void {
    try {
        window.localStorage.setItem(purchaseStorageKey(platform, eventId), '1');
    } catch {
        // Ignore storage failures so analytics never blocks the thank-you page.
    }
}

export default function ThankYou({ order }: ThankYouProps) {
    const headerCopy = headerCopyFor(order.payment_status);
    const paymentTone = paymentToneFor(order.payment_status);
    const paymentStyles = TONE_STYLES[paymentTone];
    const orderCode = String(order.id).padStart(5, '0');
    const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);

    useEffect(() => {
        const eventId = order.meta_purchase_event_id;

        if (! eventId) {
            return;
        }

        if (! hasTrackedPurchase('ga4', eventId)) {
            const didTrackGoogleAnalytics = trackGoogleAnalyticsPurchase({
                transaction_id: eventId,
                value: order.total_amount,
                shipping: order.shipping_cost,
                currency: META_PIXEL_CURRENCY,
                items: order.items.map((item) => ({
                    item_id: String(item.product_id),
                    item_name: item.product_name,
                    price: item.unit_price,
                    quantity: item.quantity,
                })),
            });

            if (didTrackGoogleAnalytics) {
                rememberTrackedPurchase('ga4', eventId);
            }
        }

        if (! hasTrackedPurchase('meta', eventId)) {
            const didTrackMeta = trackMetaPurchase(
                {
                    content_ids: order.items.map((item) => String(item.product_id)),
                    content_type: 'product',
                    contents: order.items.map((item) => ({
                        id: String(item.product_id),
                        quantity: item.quantity,
                        item_price: item.unit_price,
                    })),
                    value: order.total_amount,
                    currency: META_PIXEL_CURRENCY,
                    num_items: itemCount,
                },
                eventId,
            );

            if (didTrackMeta) {
                rememberTrackedPurchase('meta', eventId);
            }
        }
    }, [order.items, order.meta_purchase_event_id, order.shipping_cost, order.total_amount, itemCount]);

    return (
        <CustomerShell title={headerCopy.title}>
            <header className="flex flex-col gap-3">
                <span className={`font-spec text-[11px] tracking-[0.12em] uppercase ${paymentStyles.text}`}>
                    {headerCopy.eyebrow}
                </span>
                <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                    {headerCopy.title}
                </h1>
                <p className="max-w-[58ch] text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75">
                    {headerCopy.body}
                </p>
            </header>

            <div className="mt-10">
                <CheckoutStepIndicator currentStep={3} />
            </div>

            <PaymentStatusPanel
                order={order}
                orderCode={orderCode}
                paymentStyles={paymentStyles}
            />

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
                        <span className="font-spec text-[12px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                            Pedido · {orderCode}
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

                <NextStepsPanel paymentStatus={order.payment_status} paymentStyles={paymentStyles} />
            </section>
        </CustomerShell>
    );
}

function PaymentStatusPanel({
    order,
    orderCode,
    paymentStyles,
}: {
    order: ThankYouProps['order'];
    orderCode: string;
    paymentStyles: (typeof TONE_STYLES)[Tone];
}) {
    const statusLabel = PAYMENT_STATUS_LABELS[order.payment_status] ?? order.payment_status;

    return (
        <section
            aria-label="Estado del pago"
            aria-live={order.payment_status === 'pending' ? 'polite' : 'off'}
            className={`mt-8 grid gap-5 border px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center ${paymentStyles.bg} ${paymentStyles.border}`}
        >
            <div className="flex flex-col gap-2">
                <span className={`font-spec text-[11px] tracking-[0.1em] uppercase ${paymentStyles.text}`}>
                    Estado de la compra
                </span>
                <div className="flex flex-wrap items-center gap-3">
                    <PaymentStatusPill statusLabel={statusLabel} paymentStyles={paymentStyles} />
                    <span className="font-spec text-[12px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                        Pedido · {orderCode}
                    </span>
                </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-7 gap-y-3 sm:min-w-72">
                <StatusFact label="Total" value={formatCurrency(order.total_amount)} />
                <StatusFact label="Productos" value={String(order.items.length).padStart(2, '0')} />
            </dl>
        </section>
    );
}

function PaymentStatusPill({
    statusLabel,
    paymentStyles,
}: {
    statusLabel: string;
    paymentStyles: (typeof TONE_STYLES)[Tone];
}) {
    return (
        <span className={`inline-flex items-center gap-2 border px-3 py-1.5 ${paymentStyles.bg} ${paymentStyles.border}`}>
            <span aria-hidden="true" className={`inline-block h-1.5 w-1.5 rounded-full ${paymentStyles.dot}`} />
            <span className={`font-spec text-[12px] tracking-[0.04em] uppercase ${paymentStyles.text}`}>
                {statusLabel}
            </span>
        </span>
    );
}

function StatusFact({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <dt className="font-spec text-[10px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                {label}
            </dt>
            <dd className="font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)]">
                {value}
            </dd>
        </div>
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

function NextStepsPanel({
    paymentStatus,
    paymentStyles,
}: {
    paymentStatus: string;
    paymentStyles: (typeof TONE_STYLES)[Tone];
}) {
    const steps = paymentStatus === 'pending'
        ? [
              { eyebrow: '01', title: 'Confirmación', body: 'Confirmaremos el pago en los próximos minutos.' },
              { eyebrow: '02', title: 'Notificación', body: 'Recibirás un correo con el detalle final del pedido.' },
              { eyebrow: '03', title: 'Envío', body: 'Coordinaremos el envío al confirmar el pago.' },
          ]
        : paymentStatus === 'failed' || paymentStatus === 'cancelled'
        ? [
              { eyebrow: '01', title: 'Revisión', body: 'Revisa el estado del pedido antes de intentar otro pago.' },
              { eyebrow: '02', title: 'Nuevo intento', body: 'Puedes volver al pedido y completar el pago cuando lo necesites.' },
              { eyebrow: '03', title: 'Soporte', body: 'Contáctanos si el cargo aparece en tu banco.' },
          ]
        : [
              { eyebrow: '01', title: 'Preparación', body: 'Preparamos tu pedido en las próximas 24 horas hábiles.' },
              { eyebrow: '02', title: 'Envío', body: 'Recibirás el número de seguimiento por correo electrónico.' },
              { eyebrow: '03', title: 'Reorden', body: 'Vuelve a pedir con un clic desde tu historial.' },
          ];

    return (
        <aside className="border border-[var(--iko-stone-hairline)] lg:sticky lg:top-24">
            <header className="border-b border-[var(--iko-stone-hairline)] px-5 py-4">
                <span className={`font-spec text-[11px] tracking-[0.12em] uppercase ${paymentStyles.text}`}>
                    Próximos pasos
                </span>
            </header>
            <ol className="divide-y divide-[var(--iko-stone-hairline)]">
                {steps.map((step) => (
                    <li
                        key={step.eyebrow}
                        className="grid grid-cols-[2rem_1fr] gap-4 px-5 py-4"
                    >
                        <span className={`font-spec text-[11px] tabular-nums ${paymentStyles.text}`}>
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
