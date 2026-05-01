import { useState, type MouseEvent } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import AccountShell from '@/Layouts/AccountShell';
import { formatCurrency } from '@/utils/currency';
import { formatDateShort } from '@/utils/date';
import { statusLabels } from '@/utils/order';
import type { PageProps } from '@/types';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    image: string | null;
}

interface Order {
    id: number;
    status: string;
    payment_status: string;
    total_amount: number;
    shipping_cost: number;
    items: OrderItem[];
    created_at: string;
}

interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface OrdersIndexProps extends PageProps {
    orders: PaginatedOrders;
}

const TERMINAL_STATUSES = new Set(['delivered']);
const ALERT_STATUSES = new Set(['cancelled', 'payment_pending']);

export default function OrdersIndex() {
    const { orders, flash } = usePage<OrdersIndexProps>().props;

    return (
        <AccountShell
            title="Pedidos"
            eyebrow="Cuenta · Pedidos"
            headline="Historial de pedidos"
            sub="Revisa el estado de tus pedidos y reordena formatos habituales en un paso."
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

            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--iko-stone-hairline)] pb-4">
                <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                    {String(orders.total).padStart(2, '0')}{' '}
                    {orders.total === 1 ? 'pedido' : 'pedidos en total'}
                </span>
                <Link
                    href="/catalog"
                    className="inline-flex h-11 items-center bg-[var(--iko-accent)] px-5 text-[13px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)]"
                >
                    Hacer un pedido
                </Link>
            </div>

            {orders.data.length === 0 ? (
                <EmptyOrders />
            ) : (
                <ol className="divide-y divide-[var(--iko-stone-hairline)] border-b border-[var(--iko-stone-hairline)]">
                    {orders.data.map((order) => (
                        <OrderRow key={order.id} order={order} />
                    ))}
                </ol>
            )}

            <Pagination orders={orders} />
        </AccountShell>
    );
}

function OrderRow({ order }: { order: Order }) {
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const statusTone = statusToneFor(order.status);

    return (
        <li>
            <Link
                href={`/account/orders/${order.id}`}
                className="grid grid-cols-1 gap-4 py-6 transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset md:grid-cols-[8rem_1fr_8rem_8rem] md:items-center md:gap-6"
            >
                <div className="flex flex-col gap-1 px-1">
                    <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-accent)] uppercase">
                        Pedido · {String(order.id).padStart(5, '0')}
                    </span>
                    <span className="font-spec text-[11px] tabular-nums text-[var(--iko-stone-whisper)]">
                        {formatDateShort(order.created_at)}
                    </span>
                </div>

                <div className="flex items-center gap-3 px-1">
                    <span className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item) => (
                            <span
                                key={item.id}
                                className="h-10 w-10 overflow-hidden border border-[var(--iko-stone-paper)] bg-[var(--iko-stone-mid)]/40"
                            >
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt=""
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : null}
                            </span>
                        ))}
                        {order.items.length > 3 && (
                            <span className="flex h-10 w-10 items-center justify-center border border-[var(--iko-stone-paper)] bg-[var(--iko-stone-mid)]/30 font-spec text-[10px] tabular-nums text-[var(--iko-stone-ink)]">
                                +{order.items.length - 3}
                            </span>
                        )}
                    </span>
                    <span className="font-spec text-[12px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-whisper)]">
                        {itemCount} {itemCount === 1 ? 'unidad' : 'unidades'}
                    </span>
                </div>

                <div className="flex items-center gap-2 px-1">
                    <span
                        aria-hidden="true"
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                            statusTone === 'success'
                                ? 'bg-[var(--iko-accent)]'
                                : statusTone === 'alert'
                                ? 'bg-[var(--iko-error)]'
                                : 'bg-[var(--iko-stone-mid)]'
                        }`}
                    />
                    <span className="text-[13px] text-[var(--iko-stone-ink)]">
                        {statusLabels[order.status] ?? order.status}
                    </span>
                </div>

                <div className="flex items-baseline justify-between gap-3 px-1 md:justify-end">
                    <span className="font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)] md:hidden">
                        {formatCurrency(order.total_amount)}
                    </span>
                    <span className="hidden font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)] md:inline">
                        {formatCurrency(order.total_amount)}
                    </span>
                </div>
            </Link>
            <div className="flex items-center justify-end gap-5 px-1 pb-4 md:pb-2">
                <ReorderButton orderId={order.id} />
                <Link
                    href={`/account/orders/${order.id}`}
                    className="font-spec text-[12px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase hover:text-[var(--iko-accent)]"
                >
                    Ver detalle →
                </Link>
            </div>
        </li>
    );
}

function statusToneFor(status: string): 'success' | 'alert' | 'neutral' {
    if (TERMINAL_STATUSES.has(status)) {
        return 'success';
    }
    if (ALERT_STATUSES.has(status)) {
        return 'alert';
    }
    return 'neutral';
}

function ReorderButton({ orderId }: { orderId: number }) {
    const [processing, setProcessing] = useState(false);

    function handleClick(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        setProcessing(true);

        router.post(
            `/account/orders/${orderId}/reorder`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            },
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={processing}
            className="inline-flex items-center gap-1.5 font-spec text-[12px] tracking-[0.04em] text-[var(--iko-accent)] uppercase hover:text-[var(--iko-accent-hover)] disabled:opacity-60"
        >
            <RefreshCw
                className={`h-3.5 w-3.5 ${processing ? 'animate-spin' : ''}`}
                strokeWidth={1.5}
            />
            {processing ? 'Procesando…' : 'Reordenar'}
        </button>
    );
}

function EmptyOrders() {
    return (
        <section className="flex flex-col gap-5 border-y border-[var(--iko-stone-hairline)] py-16">
            <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                Sin pedidos
            </span>
            <p className="max-w-[42ch] font-display text-[1.5rem] leading-[1.15] text-[var(--iko-stone-ink)]">
                Aún no has hecho un pedido.
            </p>
            <p className="max-w-[58ch] text-[14px] leading-[1.55] text-[var(--iko-stone-ink)]/75">
                Explora el catálogo para hacer tu primer pedido. Una vez confirmado podrás reordenar
                con un solo clic desde aquí.
            </p>
            <div>
                <Link
                    href="/catalog"
                    className="inline-flex h-12 items-center bg-[var(--iko-accent)] px-7 text-[14px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)]"
                >
                    Ver catálogo
                </Link>
            </div>
        </section>
    );
}

function Pagination({ orders }: { orders: PaginatedOrders }) {
    if (orders.last_page <= 1) {
        return null;
    }

    function go(page: number): void {
        router.get('/account/orders', { page }, { preserveState: true, preserveScroll: false });
    }

    return (
        <nav
            aria-label="Paginación"
            className="mt-10 flex items-center justify-between border-t border-[var(--iko-stone-hairline)] pt-6"
        >
            <button
                type="button"
                onClick={() => go(orders.current_page - 1)}
                disabled={orders.current_page === 1}
                className="font-spec text-[12px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase hover:text-[var(--iko-stone-ink)] disabled:opacity-30"
            >
                ← Anterior
            </button>
            <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                Página {String(orders.current_page).padStart(2, '0')} ·{' '}
                {String(orders.last_page).padStart(2, '0')}
            </span>
            <button
                type="button"
                onClick={() => go(orders.current_page + 1)}
                disabled={orders.current_page === orders.last_page}
                className="font-spec text-[12px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase hover:text-[var(--iko-stone-ink)] disabled:opacity-30"
            >
                Siguiente →
            </button>
        </nav>
    );
}
