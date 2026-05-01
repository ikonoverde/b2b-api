import ShippingQuoteOption from '@/Components/ShippingQuoteOption';
import type { ShippingQuote } from '@/types';

interface ShippingQuoteSelectorProps {
    quotes: ShippingQuote[];
    selectedRateId: string;
    loading: boolean;
    fetched: boolean;
    error: string | null;
    validationError?: string;
    onSelect: (quote: ShippingQuote) => void;
}

export default function ShippingQuoteSelector({
    quotes,
    selectedRateId,
    loading,
    fetched,
    error,
    validationError,
    onSelect,
}: ShippingQuoteSelectorProps) {
    return (
        <section aria-labelledby="shipping-quotes-heading" className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between border-b border-[var(--iko-stone-hairline)] pb-2">
                <h3
                    id="shipping-quotes-heading"
                    className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase"
                >
                    Opciones de envío
                </h3>
            </div>

            {!fetched && !loading && (
                <div className="border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] px-5 py-6">
                    <p className="text-[13px] leading-[1.55] text-[var(--iko-stone-whisper)]">
                        Completa tu dirección para ver las tarifas y tiempos de entrega disponibles.
                    </p>
                </div>
            )}

            {loading && (
                <div className="border border-[var(--iko-stone-hairline)]">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-[60px] animate-pulse border-b border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-mid)]/20 last:border-b-0"
                        />
                    ))}
                </div>
            )}

            {error && !loading && (
                <div className="border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-4">
                    <p className="font-spec text-[12px] tabular-nums tracking-[0.04em] text-[var(--iko-error)]">
                        {error}
                    </p>
                </div>
            )}

            {fetched && !loading && quotes.length > 0 && (
                <div className="border border-[var(--iko-stone-hairline)] divide-y divide-[var(--iko-stone-hairline)]">
                    {quotes.map((quote) => (
                        <ShippingQuoteOption
                            key={quote.rate_id}
                            quote={quote}
                            isSelected={selectedRateId === quote.rate_id}
                            onSelect={() => onSelect(quote)}
                        />
                    ))}
                </div>
            )}

            {validationError && (
                <p className="font-spec text-[11px] tracking-[0.04em] text-[var(--iko-error)]">
                    {validationError}
                </p>
            )}
        </section>
    );
}
