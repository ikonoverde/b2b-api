import { Link, router, usePage } from '@inertiajs/react';
import { FileText, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import AccountShell from '@/Layouts/AccountShell';
import { formatCurrency } from '@/utils/currency';
import { formatDateTimeLong } from '@/utils/date';
import { statusLabels } from '@/utils/order';
import type { PageProps } from '@/types';

interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    image: string | null;
    product?: {
        slug: string;
    };
}

interface StatusHistory {
    id: number;
    from_status: string | null;
    to_status: string;
    note: string | null;
    admin_name: string | null;
    created_at: string;
}

interface Order {
    id: number;
    status: string;
    payment_status: string;
    total_amount: number;
    shipping_cost: number;
    shipping_address: Record<string, string> | null;
    tracking_number: string | null;
    shipping_carrier: string | null;
    tracking_url: string | null;
    items: OrderItem[];
    status_histories: StatusHistory[];
    created_at: string;
}

interface Props extends PageProps {
    order: Order;
}

const STATUS_ORDER = ['payment_pending', 'pending', 'processing', 'shipped', 'delivered'];

const CARRIER_TRACKING_URLS: Record<string, (id: string) => string> = {
    dhl: (id) =>
        `https://www.dhl.com/mx-es/home/tracking/tracking-parcel.html?submit=1&tracking-id=${id}`,
    fedex: (id) => `https://www.fedex.com/apps/fedextrack/?tracknumbers=${id}`,
    ups: (id) => `https://www.ups.com/track?tracknum=${id}`,
    estafeta: (id) => `https://www.estafeta.com/rastrear-pedido?gui=${id}`,
    redpack: (id) => `https://www.redpack.com.mx/es/rastreo/?guia=${id}`,
    paquetexpress: (id) => `https://www.paquetexpress.com.mx/rastreo/?guia=${id}`,
};

function getCarrierTrackingUrl(
    carrier: string | null,
    trackingNumber: string | null,
): string | null {
    if (!carrier || !trackingNumber) {
        return null;
    }
    const lower = carrier.toLowerCase();
    const matched = Object.keys(CARRIER_TRACKING_URLS).find((key) => lower.includes(key));
    return matched ? CARRIER_TRACKING_URLS[matched](trackingNumber) : null;
}

export default function OrderShow() {
    const { order, flash } = usePage<Props>().props;

    return (
        <AccountShell
            title={`Pedido #${order.id}`}
            eyebrow={`Pedido · ${String(order.id).padStart(5, '0')}`}
            headline="Detalle del pedido"
            sub={`Realizado el ${formatDateTimeLong(order.created_at)}`}
            section="orders"
        >
            {flash?.success && (
                <div className="mb-2 border border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] px-5 py-3 text-[13px] text-[var(--iko-stone-ink)]">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-2 border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-3 text-[13px] text-[var(--iko-error)]">
                    {flash.error}
                </div>
            )}

            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--iko-stone-hairline)] pb-3">
                <Link
                    href="/account/orders"
                    className="font-spec text-[12px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase hover:text-[var(--iko-stone-ink)]"
                >
                    ← Volver a pedidos
                </Link>
                <StatusPill status={order.status} />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem]">
                <div className="flex flex-col gap-12">
                    <OrderItemsBlock order={order} />
                    <OrderTimeline order={order} />
                </div>

                <div className="flex flex-col gap-8">
                    <ActionsBlock orderId={order.id} />
                    <ShippingBlock order={order} />
                </div>
            </div>
        </AccountShell>
    );
}

function StatusPill({ status }: { status: string }) {
    const tone =
        status === 'delivered'
            ? 'success'
            : status === 'cancelled' || status === 'payment_pending'
            ? 'alert'
            : 'neutral';

    return (
        <span className="inline-flex items-baseline gap-2">
            <span
                aria-hidden="true"
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                    tone === 'success'
                        ? 'bg-[var(--iko-accent)]'
                        : tone === 'alert'
                        ? 'bg-[var(--iko-error)]'
                        : 'bg-[var(--iko-stone-mid)]'
                }`}
            />
            <span className="font-spec text-[12px] tracking-[0.04em] text-[var(--iko-stone-ink)] uppercase">
                {statusLabels[status] ?? status}
            </span>
        </span>
    );
}

function OrderItemsBlock({ order }: { order: Order }) {
    const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);

    return (
        <section aria-labelledby="items-heading">
            <div className="flex items-baseline justify-between border-b border-[var(--iko-stone-hairline)] pb-3">
                <h2
                    id="items-heading"
                    className="font-display text-[1.5rem] leading-tight text-[var(--iko-stone-ink)]"
                >
                    Productos
                </h2>
                <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                    {order.items.length}{' '}
                    {order.items.length === 1 ? 'producto' : 'productos'}
                </span>
            </div>

            <ol className="divide-y divide-[var(--iko-stone-hairline)] border-b border-[var(--iko-stone-hairline)]">
                {order.items.map((item, idx) => (
                    <li
                        key={item.id}
                        className="grid grid-cols-[2.5rem_4rem_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[3rem_5rem_1fr_auto] sm:gap-6"
                    >
                        <span className="font-spec text-[11px] tabular-nums text-[var(--iko-accent)]">
                            {String(idx + 1).padStart(2, '0')}
                        </span>
                        <ItemImage item={item} />
                        <div className="flex min-w-0 flex-col gap-1">
                            <ItemName item={item} />
                            <span className="font-spec text-[11px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-whisper)]">
                                {item.quantity} × {formatCurrency(item.unit_price)}
                            </span>
                        </div>
                        <span className="font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)]">
                            {formatCurrency(item.subtotal)}
                        </span>
                    </li>
                ))}
            </ol>

            <dl className="mt-3 px-1">
                <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                <SummaryRow label="Envío" value={formatCurrency(order.shipping_cost)} />
            </dl>
            <div className="flex items-baseline justify-between border-t border-[var(--iko-stone-hairline)] py-4">
                <dt className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                    Total
                </dt>
                <dd className="font-spec text-[1.25rem] tabular-nums text-[var(--iko-stone-ink)]">
                    {formatCurrency(order.total_amount)}
                </dd>
            </div>
        </section>
    );
}

function ItemName({ item }: { item: OrderItem }) {
    if (item.product) {
        return (
            <Link
                href={`/products/${item.product.slug}`}
                className="font-display text-[1rem] leading-tight text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)]"
            >
                {item.product_name}
            </Link>
        );
    }
    return (
        <span className="font-display text-[1rem] leading-tight text-[var(--iko-stone-ink)]">
            {item.product_name}
        </span>
    );
}

function ItemImage({ item }: { item: OrderItem }) {
    const inner = (
        <div className="h-14 w-14 overflow-hidden bg-[var(--iko-stone-mid)]/40 sm:h-16 sm:w-16">
            {item.image ? (
                <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            ) : null}
        </div>
    );

    if (item.product) {
        return (
            <Link href={`/products/${item.product.slug}`} className="shrink-0">
                {inner}
            </Link>
        );
    }
    return inner;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline justify-between py-2">
            <dt className="text-[13px] text-[var(--iko-stone-whisper)]">{label}</dt>
            <dd className="font-spec text-[13px] tabular-nums text-[var(--iko-stone-ink)]">
                {value}
            </dd>
        </div>
    );
}

function OrderTimeline({ order }: { order: Order }) {
    const isCancelled = order.status === 'cancelled';
    const currentIndex = STATUS_ORDER.indexOf(order.status);

    const steps = STATUS_ORDER.map((status, index) => {
        const historyEntry = order.status_histories.find((h) => h.to_status === status);
        return {
            status,
            label: statusLabels[status] ?? status,
            isCompleted: !isCancelled && index <= currentIndex,
            isCurrent: !isCancelled && index === currentIndex,
            date: historyEntry ? formatDateTimeLong(historyEntry.created_at) : null,
        };
    });

    return (
        <section aria-labelledby="timeline-heading">
            <div className="border-b border-[var(--iko-stone-hairline)] pb-3">
                <h2
                    id="timeline-heading"
                    className="font-display text-[1.5rem] leading-tight text-[var(--iko-stone-ink)]"
                >
                    Estado
                </h2>
            </div>

            {isCancelled ? (
                <div className="mt-6 border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-4">
                    <p className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-error)] uppercase">
                        Pedido cancelado
                    </p>
                    <p className="mt-1 text-[13px] leading-[1.55] text-[var(--iko-error)]">
                        Este pedido fue cancelado y no se procesará. Si crees que es un error, contacta
                        al equipo comercial.
                    </p>
                </div>
            ) : (
                <ol className="mt-4 border-b border-[var(--iko-stone-hairline)]">
                    {steps.map((step, index) => (
                        <TimelineRow
                            key={step.status}
                            step={step}
                            index={index + 1}
                        />
                    ))}
                </ol>
            )}
        </section>
    );
}

function TimelineRow({
    step,
    index,
}: {
    step: { status: string; label: string; isCompleted: boolean; isCurrent: boolean; date: string | null };
    index: number;
}) {
    const tone = step.isCompleted
        ? 'completed'
        : step.isCurrent
        ? 'current'
        : 'pending';

    return (
        <li className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-t border-[var(--iko-stone-hairline)] py-4 first:border-t-0 sm:gap-6">
            <span
                className={`font-spec text-[11px] tabular-nums ${
                    tone === 'completed' || tone === 'current'
                        ? 'text-[var(--iko-accent)]'
                        : 'text-[var(--iko-stone-mid)]'
                }`}
            >
                {String(index).padStart(2, '0')}
            </span>
            <span
                className={`text-[14px] ${
                    tone === 'pending'
                        ? 'text-[var(--iko-stone-whisper)]'
                        : 'text-[var(--iko-stone-ink)]'
                }`}
            >
                {step.label}
                {tone === 'current' && (
                    <span className="ml-3 font-spec text-[10px] tracking-[0.08em] text-[var(--iko-accent)] uppercase">
                        · Actual
                    </span>
                )}
            </span>
            <span className="font-spec text-[11px] tabular-nums text-[var(--iko-stone-whisper)]">
                {step.date ?? '—'}
            </span>
        </li>
    );
}

function ActionsBlock({ orderId }: { orderId: number }) {
    const [reordering, setReordering] = useState(false);

    function reorder(): void {
        setReordering(true);
        router.post(
            `/account/orders/${orderId}/reorder`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setReordering(false),
            },
        );
    }

    function downloadInvoice(): void {
        window.open(`/account/orders/${orderId}/invoice`, '_blank');
    }

    return (
        <aside className="border border-[var(--iko-stone-hairline)]">
            <header className="border-b border-[var(--iko-stone-hairline)] px-5 py-4">
                <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase">
                    Acciones
                </span>
            </header>
            <div className="flex flex-col gap-3 p-5">
                <button
                    type="button"
                    onClick={reorder}
                    disabled={reordering}
                    className="flex h-12 w-full items-center justify-center gap-2 bg-[var(--iko-accent)] text-[14px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] disabled:opacity-60"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${reordering ? 'animate-spin' : ''}`}
                        strokeWidth={1.5}
                    />
                    {reordering ? 'Procesando…' : 'Volver a ordenar'}
                </button>
                <button
                    type="button"
                    onClick={downloadInvoice}
                    className="flex h-12 w-full items-center justify-center gap-2 border border-[var(--iko-stone-hairline)] text-[14px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)] hover:text-[var(--iko-accent)]"
                >
                    <FileText className="h-4 w-4" strokeWidth={1.5} />
                    Descargar factura
                </button>
            </div>
        </aside>
    );
}

function ShippingBlock({ order }: { order: Order }) {
    const trackingUrl =
        order.tracking_url ?? getCarrierTrackingUrl(order.shipping_carrier, order.tracking_number);

    return (
        <aside className="border border-[var(--iko-stone-hairline)]">
            <header className="border-b border-[var(--iko-stone-hairline)] px-5 py-4">
                <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase">
                    Envío
                </span>
            </header>
            <div className="flex flex-col gap-5 p-5">
                {order.shipping_address ? (
                    <div className="flex flex-col gap-1.5">
                        <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                            Dirección
                        </span>
                        <p className="text-[13px] leading-[1.6] text-[var(--iko-stone-ink)]">
                            {order.shipping_address.name && (
                                <>
                                    {order.shipping_address.name}
                                    <br />
                                </>
                            )}
                            {order.shipping_address.address_line_1 ?? order.shipping_address.street}
                            {order.shipping_address.address_line_2 &&
                                `, ${order.shipping_address.address_line_2}`}
                            <br />
                            {order.shipping_address.city}, {order.shipping_address.state}{' '}
                            {order.shipping_address.postal_code ?? order.shipping_address.zip}
                        </p>
                    </div>
                ) : null}

                {order.tracking_number ? (
                    <div className="flex flex-col gap-1.5">
                        <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                            Rastreo
                        </span>
                        <p className="font-spec text-[13px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-ink)]">
                            {order.shipping_carrier} · {order.tracking_number}
                        </p>
                        {trackingUrl && (
                            <a
                                href={trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-baseline gap-2 text-[13px] text-[var(--iko-accent)] hover:text-[var(--iko-accent-hover)]"
                            >
                                Rastrear envío
                                <span aria-hidden="true">→</span>
                            </a>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                            Rastreo
                        </span>
                        <p className="text-[13px] leading-[1.55] text-[var(--iko-stone-whisper)]">
                            La información estará disponible una vez enviado el pedido.
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
}
