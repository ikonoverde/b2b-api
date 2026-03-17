import { formatCurrency } from '@/utils/currency';
import type { ShippingQuote } from '@/types';

interface ShippingQuoteOptionProps {
    quote: ShippingQuote;
    isSelected: boolean;
    onSelect: () => void;
}

export default function ShippingQuoteOption({ quote, isSelected, onSelect }: ShippingQuoteOptionProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex items-center justify-between rounded-xl border-2 p-4 text-left transition-colors ${
                isSelected ? 'border-[#5E7052] bg-[#5E7052]/5' : 'border-[#E5E5E5] hover:border-[#5E7052]/40'
            }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#5E7052]' : 'border-[#CCCCCC]'
                    }`}
                >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#5E7052]" />}
                </div>
                <div>
                    <p className="text-sm font-semibold text-[#1A1A1A] font-[Outfit]">{quote.carrier}</p>
                    <p className="text-xs text-[#999999] font-[Outfit]">
                        {quote.service} · {quote.estimated_days} día{quote.estimated_days !== 1 ? 's' : ''} hábiles
                    </p>
                </div>
            </div>
            <span className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">{formatCurrency(quote.price)}</span>
        </button>
    );
}
