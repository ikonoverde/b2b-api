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
            className={`flex items-center justify-between w-full px-3 py-3.5 text-left transition-colors ${
                isSelected ? 'bg-[#f4f7f2]' : 'hover:bg-[#fafafa]'
            }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'border-primary' : 'border-[#c4c4c4]'
                    }`}
                >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div>
                    <p className="text-[14px] font-medium text-stripe-text font-body">{quote.carrier}</p>
                    <p className="text-[12px] text-stripe-muted font-body">
                        {quote.service} · {quote.estimated_days} día{quote.estimated_days !== 1 ? 's' : ''} hábiles
                    </p>
                </div>
            </div>
            <span className="text-[14px] font-semibold text-stripe-text font-body">
                {formatCurrency(quote.price)}
            </span>
        </button>
    );
}
