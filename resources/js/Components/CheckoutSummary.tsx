import { formatCurrency } from '@/utils/currency';
import type { CartItem } from '@/types';

interface CheckoutSummaryProps {
    items: CartItem[];
    subtotal: number;
    shippingCost: number | null;
    total: number | null;
}

export default function CheckoutSummary({ items, subtotal, shippingCost, total }: CheckoutSummaryProps) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 border border-[#E5E5E5] sticky top-20">
            <h2 className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">
                Resumen ({items.length} productos)
            </h2>
            <div className="flex flex-col gap-2">
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm font-[Outfit]">
                        <span className="text-[#999999]">
                            {item.name} x{item.quantity}
                        </span>
                        <span className="font-medium text-[#1A1A1A]">{formatCurrency(item.subtotal)}</span>
                    </div>
                ))}
                <div className="border-t border-[#E5E5E5] pt-2 mt-1">
                    <div className="flex justify-between text-sm font-[Outfit]">
                        <span className="text-[#999999]">Subtotal</span>
                        <span className="font-medium text-[#1A1A1A]">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-[Outfit]">
                        <span className="text-[#999999]">Envío</span>
                        <span className="font-medium text-[#1A1A1A]">
                            {shippingCost !== null ? formatCurrency(shippingCost) : '—'}
                        </span>
                    </div>
                    <div className="mt-2 flex justify-between">
                        <span className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">Total</span>
                        <span className="text-lg font-bold text-[#8B6F47] font-[Outfit]">
                            {total !== null ? formatCurrency(total) : '—'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
