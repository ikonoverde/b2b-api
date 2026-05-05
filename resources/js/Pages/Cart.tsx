import { Link, router, usePage } from '@inertiajs/react';
import { Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import CustomerShell from '@/Layouts/CustomerShell';
import { formatCurrency } from '@/utils/currency';
import type { Cart, CartItem, PageProps, ReorderWarnings } from '@/types';

interface CartPageProps {
    cart: Cart;
}

export default function CartPage({ cart }: CartPageProps) {
    const { flash } = usePage<PageProps>().props;
    const [warningsDismissed, setWarningsDismissed] = useState(false);
    const isEmpty = cart.items.length === 0;
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    function clearCart(): void {
        if (!confirm('¿Vaciar todo el carrito?')) {
            return;
        }
        router.delete('/cart', { preserveScroll: true });
    }

    return (
        <CustomerShell title="Carrito">
            <header className="flex flex-col gap-3">
                <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase">
                    01 · Carrito
                </span>
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                        Tu pedido
                    </h1>
                    {!isEmpty && (
                        <button
                            type="button"
                            onClick={clearCart}
                            className="font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase transition-colors hover:text-[var(--iko-error)]"
                        >
                            Vaciar carrito
                        </button>
                    )}
                </div>
                {!isEmpty && (
                    <p className="max-w-[58ch] font-spec text-[12px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                        {itemCount} {itemCount === 1 ? 'unidad' : 'unidades'} ·{' '}
                        {cart.items.length} {cart.items.length === 1 ? 'producto' : 'productos'}
                    </p>
                )}
            </header>

            {flash.reorder_warnings && !warningsDismissed && (
                <ReorderWarningPanel
                    warnings={flash.reorder_warnings}
                    onDismiss={() => setWarningsDismissed(true)}
                />
            )}

            {isEmpty ? (
                <EmptyCart />
            ) : (
                <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem]">
                    <section aria-labelledby="cart-items-heading">
                        <h2 id="cart-items-heading" className="sr-only">
                            Artículos en el carrito
                        </h2>
                        <ol className="border-t border-[var(--iko-stone-hairline)]">
                            {cart.items.map((item, idx) => (
                                <li key={item.id}>
                                    <CartLineRow item={item} index={idx + 1} />
                                </li>
                            ))}
                        </ol>
                    </section>

                    <aside aria-labelledby="cart-summary-heading">
                        <SummaryPanel cart={cart} />
                    </aside>
                </div>
            )}
        </CustomerShell>
    );
}

function CartLineRow({ item, index }: { item: CartItem; index: number }) {
    function updateQuantity(newQty: number): void {
        if (newQty < 1) {
            return;
        }
        router.post(`/cart/items/${item.id}`, { quantity: newQty }, { preserveScroll: true });
    }

    function remove(): void {
        router.delete(`/cart/items/${item.id}`, { preserveScroll: true });
    }

    return (
        <div className="grid grid-cols-[2.5rem_4.5rem_1fr_auto] items-center gap-4 border-b border-[var(--iko-stone-hairline)] py-6 sm:grid-cols-[3rem_5rem_1fr_auto_auto] sm:gap-6">
            <span className="font-spec text-[11px] tabular-nums text-[var(--iko-accent)]">
                {String(index).padStart(2, '0')}
            </span>

            <div className="h-16 w-16 shrink-0 overflow-hidden bg-[var(--iko-stone-mid)]/40 sm:h-20 sm:w-20">
                {item.image ? (
                    <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : null}
            </div>

            <div className="flex min-w-0 flex-col gap-1.5">
                <span className="font-display text-[1.125rem] leading-tight text-[var(--iko-stone-ink)]">
                    {item.name}
                </span>
                <span className="font-spec text-[11px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-whisper)]">
                    {formatCurrency(item.price)} / unidad
                </span>
                <div className="mt-1 flex items-center sm:hidden">
                    <QuantityStepper
                        quantity={item.quantity}
                        onIncrement={() => updateQuantity(item.quantity + 1)}
                        onDecrement={() => updateQuantity(item.quantity - 1)}
                    />
                </div>
            </div>

            <div className="hidden sm:block">
                <QuantityStepper
                    quantity={item.quantity}
                    onIncrement={() => updateQuantity(item.quantity + 1)}
                    onDecrement={() => updateQuantity(item.quantity - 1)}
                />
            </div>

            <div className="flex items-center gap-3">
                <span className="font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)]">
                    {formatCurrency(item.subtotal)}
                </span>
                <button
                    type="button"
                    onClick={remove}
                    className="text-[var(--iko-stone-whisper)] transition-colors hover:text-[var(--iko-error)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                    aria-label={`Quitar ${item.name} del carrito`}
                >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
}

function QuantityStepper({
    quantity,
    onIncrement,
    onDecrement,
}: {
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
}) {
    return (
        <div className="inline-flex items-center border border-[var(--iko-stone-hairline)]">
            <button
                type="button"
                onClick={onDecrement}
                disabled={quantity <= 1}
                className="flex h-9 w-9 items-center justify-center text-[var(--iko-stone-ink)] transition-colors hover:bg-[var(--iko-accent-soft)] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset"
                aria-label="Reducir cantidad"
            >
                <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <span className="flex h-9 min-w-[3rem] items-center justify-center border-x border-[var(--iko-stone-hairline)] font-spec text-[13px] tabular-nums text-[var(--iko-stone-ink)]">
                {quantity}
            </span>
            <button
                type="button"
                onClick={onIncrement}
                className="flex h-9 w-9 items-center justify-center text-[var(--iko-stone-ink)] transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset"
                aria-label="Aumentar cantidad"
            >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
        </div>
    );
}

function SummaryPanel({ cart }: { cart: Cart }) {
    return (
        <div className="border border-[var(--iko-stone-hairline)] lg:sticky lg:top-24">
            <div className="border-b border-[var(--iko-stone-hairline)] px-6 py-5">
                <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase">
                    Resumen
                </span>
            </div>
            <dl className="flex flex-col px-6 py-5">
                <SummaryRow label="Subtotal" value={formatCurrency(cart.totals.subtotal)} />
                <SummaryRow
                    label="Envío"
                    value={
                        cart.totals.shipping === null
                            ? 'A calcular'
                            : formatCurrency(cart.totals.shipping)
                    }
                    muted={cart.totals.shipping === null}
                />
            </dl>
            <div className="flex items-baseline justify-between border-t border-[var(--iko-stone-hairline)] px-6 py-5">
                <dt className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                    Total
                </dt>
                <dd className="font-spec text-[1.25rem] tabular-nums text-[var(--iko-stone-ink)]">
                    {cart.totals.total === null ? '—' : formatCurrency(cart.totals.total)}
                </dd>
            </div>
            <div className="border-t border-[var(--iko-stone-hairline)] p-6">
                <Link
                    href="/checkout/shipping"
                    className="flex h-12 w-full items-center justify-center bg-[var(--iko-accent)] text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                >
                    Continuar al envío
                </Link>
                <Link
                    href="/catalog"
                    className="mt-3 inline-flex w-full items-baseline justify-center gap-2 text-[13px] text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]"
                >
                    Seguir comprando
                </Link>
            </div>
        </div>
    );
}

function SummaryRow({
    label,
    value,
    muted = false,
}: {
    label: string;
    value: string;
    muted?: boolean;
}) {
    return (
        <div className="flex items-baseline justify-between py-2">
            <dt className="text-[13px] text-[var(--iko-stone-whisper)]">{label}</dt>
            <dd
                className={`font-spec text-[13px] tabular-nums ${
                    muted ? 'text-[var(--iko-stone-whisper)]' : 'text-[var(--iko-stone-ink)]'
                }`}
            >
                {value}
            </dd>
        </div>
    );
}

function EmptyCart() {
    return (
        <section className="mt-16 flex flex-col gap-6 border-y border-[var(--iko-stone-hairline)] py-20">
            <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                Sin productos
            </span>
            <p className="max-w-[42ch] font-display text-[1.875rem] leading-[1.15] text-[var(--iko-stone-ink)]">
                Tu carrito está vacío.
            </p>
            <p className="max-w-[52ch] text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75">
                Agrega productos desde el catálogo para empezar tu pedido. Compra desde una unidad, sin
                mínimos.
            </p>
            <div>
                <Link
                    href="/catalog"
                    className="inline-flex h-12 items-center bg-[var(--iko-accent)] px-7 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                >
                    Explorar catálogo
                </Link>
            </div>
        </section>
    );
}

const reasonLabels: Record<string, string> = {
    out_of_stock: 'Sin existencias',
    product_unavailable: 'Producto no disponible',
};

function ReorderWarningPanel({
    warnings,
    onDismiss,
}: {
    warnings: ReorderWarnings;
    onDismiss: () => void;
}) {
    return (
        <div className="mt-10 border-l-0 border-y border-r border-[var(--iko-stone-hairline)] bg-[var(--iko-accent-soft)]">
            <div className="grid grid-cols-[auto_1fr_auto] gap-5 px-6 py-5">
                <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent)] uppercase">
                    Aviso
                </span>
                <div className="flex flex-col gap-4">
                    <WarningSection
                        title="Productos no disponibles"
                        items={warnings.unavailable}
                        renderDetail={(item) => <span>{reasonLabels[item.reason] ?? item.reason}</span>}
                    />
                    <WarningSection
                        title="Precios actualizados"
                        items={warnings.price_changes}
                        renderDetail={(item) => (
                            <>
                                <span className="font-spec tabular-nums text-[var(--iko-stone-whisper)] line-through">
                                    {formatCurrency(item.original_price)}
                                </span>
                                <span className="text-[var(--iko-stone-whisper)]">→</span>
                                <span className="font-spec tabular-nums text-[var(--iko-stone-ink)]">
                                    {formatCurrency(item.current_price)}
                                </span>
                            </>
                        )}
                    />
                </div>
                <button
                    type="button"
                    onClick={onDismiss}
                    className="text-[var(--iko-stone-whisper)] transition-colors hover:text-[var(--iko-stone-ink)]"
                    aria-label="Cerrar aviso"
                >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
}

function WarningSection<T extends { product_id: number; product_name: string }>({
    title,
    items,
    renderDetail,
}: {
    title: string;
    items: T[];
    renderDetail: (item: T) => React.ReactNode;
}) {
    if (items.length === 0) {
        return null;
    }
    return (
        <div className="flex flex-col gap-2">
            <span className="font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-ink)] uppercase">
                {title}
            </span>
            <ul className="flex flex-col gap-1.5">
                {items.map((item) => (
                    <li
                        key={item.product_id}
                        className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13px] text-[var(--iko-stone-ink)]"
                    >
                        <span>{item.product_name}</span>
                        <span className="text-[var(--iko-stone-whisper)]">·</span>
                        {renderDetail(item)}
                    </li>
                ))}
            </ul>
        </div>
    );
}
