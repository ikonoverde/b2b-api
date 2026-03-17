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
        <div className="mt-2">
            <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit] mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Opciones de envío
            </label>

            {!fetched && !loading && (
                <div className="rounded-xl border border-dashed border-[#E5E5E5] p-6 text-center">
                    <Package className="w-8 h-8 text-[#999999] mx-auto mb-2" />
                    <p className="text-sm text-[#999999] font-[Outfit]">
                        Ingresa tu dirección para ver las opciones de envío
                    </p>
                </div>
            )}

            {loading && (
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-20 rounded-xl border border-[#E5E5E5] bg-gray-50 animate-pulse"
                        />
                    ))}
                </div>
            )}

            {error && !loading && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm text-amber-800 font-[Outfit]">{error}</p>
                </div>
            )}

            {fetched && !loading && quotes.length > 0 && (
                <div className="flex flex-col gap-3">
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
                <span className="text-sm text-red-500 font-[Outfit] mt-1">{validationError}</span>
            )}
        </div>
    );
}
