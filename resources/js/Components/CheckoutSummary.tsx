import { formatCurrency } from '@/utils/currency';
import type { CartItem } from '@/types';

interface CheckoutSummaryProps {
    items: CartItem[];
    subtotal: number;
    shippingCost: number | null;
    total: number | null;
}

export default function CheckoutSummary({
    items,
    subtotal,
    shippingCost,
    total,
}: CheckoutSummaryProps) {
    return (
        <aside className="border border-[var(--iko-stone-hairline)] lg:sticky lg:top-24">
            <header className="flex items-baseline justify-between border-b border-[var(--iko-stone-hairline)] px-5 py-4">
                <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase">
                    Resumen
                </span>
                <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                    {items.length} {items.length === 1 ? 'producto' : 'productos'}
                </span>
            </header>

            <ul className="divide-y divide-[var(--iko-stone-hairline)]">
                {items.map((item) => (
                    <li key={item.id} className="flex items-baseline justify-between gap-3 px-5 py-3">
                        <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--iko-stone-ink)]">
                            {item.name}
                            <span className="ml-2 font-spec text-[11px] tabular-nums text-[var(--iko-stone-whisper)]">
                                ×{item.quantity}
                            </span>
                        </span>
                        <span className="shrink-0 font-spec text-[12px] tabular-nums text-[var(--iko-stone-ink)]">
                            {formatCurrency(item.subtotal)}
                        </span>
                    </li>
                ))}
            </ul>

            <dl className="border-t border-[var(--iko-stone-hairline)] px-5 py-4">
                <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                <SummaryRow
                    label="Envío"
                    value={shippingCost === null ? 'A calcular' : formatCurrency(shippingCost)}
                    muted={shippingCost === null}
                />
            </dl>
            <div className="flex items-baseline justify-between border-t border-[var(--iko-stone-hairline)] px-5 py-4">
                <dt className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                    Total
                </dt>
                <dd className="font-spec text-[1.125rem] tabular-nums text-[var(--iko-stone-ink)]">
                    {total === null ? '—' : formatCurrency(total)}
                </dd>
            </div>
        </aside>
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
        <div className="flex items-baseline justify-between py-1.5">
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
