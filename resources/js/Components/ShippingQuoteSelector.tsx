import { Package, Truck } from 'lucide-react';
import ShippingQuoteOption from '@/Components/ShippingQuoteOption';
import type { ShippingQuote } from '@/types';

interface ShippingQuoteSelectorProps {
    quotes: ShippingQuote[];
    selectedQuoteId: string;
    loading: boolean;
    fetched: boolean;
    error: string | null;
    validationError?: string;
    onSelect: (quote: ShippingQuote) => void;
}

export default function ShippingQuoteSelector({
    quotes,
    selectedQuoteId,
    loading,
    fetched,
    error,
    validationError,
    onSelect,
}: ShippingQuoteSelectorProps) {
    return (
        <div>
            <p className="text-[13px] font-medium text-stripe-text font-body mb-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                Opciones de envío
            </p>

            {!fetched && !loading && (
                <div className="rounded-xl border border-dashed border-stripe-border bg-white p-6 text-center">
                    <Package className="w-7 h-7 text-stripe-muted mx-auto mb-2" />
                    <p className="text-[13px] text-stripe-muted font-body">
                        Ingresa tu dirección para ver las opciones de envío
                    </p>
                </div>
            )}

            {loading && (
                <div className="rounded-xl border border-stripe-border bg-white overflow-hidden divide-y divide-stripe-border shadow-[0_1px_1px_0_rgba(0,0,0,0.03)]">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[60px] animate-pulse bg-[#fafafa]" />
                    ))}
                </div>
            )}

            {error && !loading && (
                <div className="rounded-xl border border-stripe-border bg-white p-4 shadow-[0_1px_1px_0_rgba(0,0,0,0.03)]">
                    <p className="text-[13px] text-stripe-error font-body">{error}</p>
                </div>
            )}

            {fetched && !loading && quotes.length > 0 && (
                <div className="rounded-xl border border-stripe-border bg-white overflow-hidden divide-y divide-stripe-border shadow-[0_1px_1px_0_rgba(0,0,0,0.03)]">
                    {quotes.map((quote) => (
                        <ShippingQuoteOption
                            key={quote.quote_id}
                            quote={quote}
                            isSelected={selectedQuoteId === quote.quote_id}
                            onSelect={() => onSelect(quote)}
                        />
                    ))}
                </div>
            )}

            {validationError && (
                <p className="text-[13px] text-stripe-error font-body mt-1.5">{validationError}</p>
            )}
        </div>
    );
}
