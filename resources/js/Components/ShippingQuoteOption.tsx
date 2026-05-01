import { formatCurrency } from '@/utils/currency';
import type { ShippingQuote } from '@/types';

interface ShippingQuoteOptionProps {
    quote: ShippingQuote;
    isSelected: boolean;
    onSelect: () => void;
}

export default function ShippingQuoteOption({
    quote,
    isSelected,
    onSelect,
}: ShippingQuoteOptionProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={isSelected}
            className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset ${
                isSelected
                    ? 'bg-[var(--iko-accent-soft)]'
                    : 'hover:bg-[var(--iko-stone-mid)]/15'
            }`}
        >
            <span
                aria-hidden="true"
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isSelected
                        ? 'border-[var(--iko-accent)]'
                        : 'border-[var(--iko-stone-mid)]'
                }`}
            >
                {isSelected && <span className="h-2 w-2 rounded-full bg-[var(--iko-accent)]" />}
            </span>
            <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-[14px] text-[var(--iko-stone-ink)]">{quote.carrier}</span>
                <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                    {quote.service} · {quote.estimated_days}{' '}
                    {quote.estimated_days === 1 ? 'día hábil' : 'días hábiles'}
                </span>
            </span>
            <span className="font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)]">
                {formatCurrency(quote.price)}
            </span>
        </button>
    );
}
