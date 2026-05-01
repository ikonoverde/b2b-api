import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { MiniCart as MiniCartType } from '@/types';
import { formatCurrency } from '@/utils/currency';

interface MiniCartProps {
    miniCart: MiniCartType;
}

export default function MiniCart({ miniCart }: MiniCartProps) {
    const { items, subtotal, totalCount } = miniCart;
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="inline-flex h-9 items-center gap-2 px-2 text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors"
                aria-label={`Carrito · ${totalCount} ${totalCount === 1 ? 'producto' : 'productos'}`}
                aria-haspopup="dialog"
                aria-expanded={open}
            >
                <ShoppingCart className="h-4.5 w-4.5" strokeWidth={1.5} />
                <span className="font-spec text-[12px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-whisper)]">
                    {String(totalCount).padStart(2, '0')}
                </span>
            </button>

            {open && (
                <div
                    role="dialog"
                    aria-label="Resumen del carrito"
                    className="absolute right-0 top-full z-50 mt-3 w-80 border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] sm:w-96"
                >
                    {totalCount === 0 ? (
                        <EmptyState onDismiss={() => setOpen(false)} />
                    ) : (
                        <>
                            <header className="flex items-baseline justify-between border-b border-[var(--iko-stone-hairline)] px-5 py-4">
                                <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent)] uppercase">
                                    Carrito
                                </span>
                                <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                                    {totalCount} {totalCount === 1 ? 'producto' : 'productos'}
                                </span>
                            </header>

                            <ul className="max-h-80 divide-y divide-[var(--iko-stone-hairline)] overflow-y-auto">
                                {items.map((item) => (
                                    <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                                        <div className="h-12 w-12 shrink-0 overflow-hidden bg-[var(--iko-stone-mid)]/40">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : null}
                                        </div>
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <span className="truncate text-[13px] leading-tight text-[var(--iko-stone-ink)]">
                                                {item.name}
                                            </span>
                                            <span className="font-spec text-[11px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-whisper)]">
                                                {item.quantity} × {formatCurrency(item.price)}
                                            </span>
                                        </div>
                                        <span className="shrink-0 font-spec text-[12px] tabular-nums text-[var(--iko-stone-ink)]">
                                            {formatCurrency(item.subtotal)}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex items-baseline justify-between border-t border-[var(--iko-stone-hairline)] px-5 py-4">
                                <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                                    Subtotal
                                </span>
                                <span className="font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)]">
                                    {formatCurrency(subtotal)}
                                </span>
                            </div>

                            <div className="flex gap-px border-t border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-hairline)]">
                                <Link
                                    href="/cart"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 bg-[var(--iko-stone-paper)] py-3 text-center text-[13px] text-[var(--iko-stone-ink)] hover:bg-[var(--iko-accent-soft)]"
                                >
                                    Ver carrito
                                </Link>
                                <Link
                                    href="/checkout/shipping"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 bg-[var(--iko-accent)] py-3 text-center text-[13px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)]"
                                >
                                    Realizar pedido
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function EmptyState({ onDismiss }: { onDismiss: () => void }) {
    return (
        <div className="flex flex-col items-start gap-3 px-5 py-6">
            <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent)] uppercase">
                Carrito vacío
            </span>
            <p className="max-w-[26ch] text-[13px] leading-[1.55] text-[var(--iko-stone-ink)]/75">
                Agrega productos desde el catálogo para empezar tu pedido.
            </p>
            <Link
                href="/catalog"
                onClick={onDismiss}
                className="inline-flex items-baseline gap-2 text-[13px] font-medium text-[var(--iko-accent)] hover:text-[var(--iko-accent-hover)]"
            >
                Ver catálogo
                <span aria-hidden="true">→</span>
            </Link>
        </div>
    );
}
