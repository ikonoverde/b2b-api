import { formatCurrency } from '@/utils/currency';

interface OrderSummaryItem {
    id: number;
    product_name: string;
    quantity: number;
    subtotal: number;
}

interface OrderSummaryProps {
    items: OrderSummaryItem[];
    totalAmount: number;
    shippingCost: number;
    showCard?: boolean;
}

function SummaryContent({
    items,
    totalAmount,
    shippingCost,
}: Omit<OrderSummaryProps, 'showCard'>) {
    const subtotal = totalAmount - shippingCost;

    return (
        <>
            <ul className="divide-y divide-[var(--iko-stone-hairline)]">
                {items.map((item) => (
                    <li key={item.id} className="flex items-baseline justify-between gap-3 py-3">
                        <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--iko-stone-ink)]">
                            {item.product_name}
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

            <dl className="border-t border-[var(--iko-stone-hairline)] py-3">
                <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                <SummaryRow label="Envío" value={formatCurrency(shippingCost)} />
            </dl>
            <div className="flex items-baseline justify-between border-t border-[var(--iko-stone-hairline)] py-3">
                <dt className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                    Total
                </dt>
                <dd className="font-spec text-[1.125rem] tabular-nums text-[var(--iko-stone-ink)]">
                    {formatCurrency(totalAmount)}
                </dd>
            </div>
        </>
    );
}

export default function OrderSummary({
    items,
    totalAmount,
    shippingCost,
    showCard = true,
}: OrderSummaryProps) {
    if (!showCard) {
        return (
            <SummaryContent
                items={items}
                totalAmount={totalAmount}
                shippingCost={shippingCost}
            />
        );
    }

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
            <div className="px-5">
                <SummaryContent
                    items={items}
                    totalAmount={totalAmount}
                    shippingCost={shippingCost}
                />
            </div>
        </aside>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline justify-between py-1.5">
            <dt className="text-[13px] text-[var(--iko-stone-whisper)]">{label}</dt>
            <dd className="font-spec text-[13px] tabular-nums text-[var(--iko-stone-ink)]">
                {value}
            </dd>
        </div>
    );
}
