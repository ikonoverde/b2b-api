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

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

function SummaryContent({ items, totalAmount, shippingCost }: Omit<OrderSummaryProps, 'showCard'>) {
    const subtotal = totalAmount - shippingCost;

    return (
        <div className="flex flex-col gap-2">
            {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm font-[Outfit]">
                    <span className="text-[#999999]">
                        {item.product_name} x{item.quantity}
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
                    <span className="font-medium text-[#1A1A1A]">{formatCurrency(shippingCost)}</span>
                </div>
                <div className="mt-2 flex justify-between">
                    <span className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">Total</span>
                    <span className="text-lg font-bold text-[#8B6F47] font-[Outfit]">
                        {formatCurrency(totalAmount)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function OrderSummary({ items, totalAmount, shippingCost, showCard = true }: OrderSummaryProps) {
    if (!showCard) {
        return <SummaryContent items={items} totalAmount={totalAmount} shippingCost={shippingCost} />;
    }

    return (
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 border border-[#E5E5E5] sticky top-20">
            <h2 className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">
                Resumen ({items.length} productos)
            </h2>
            <SummaryContent items={items} totalAmount={totalAmount} shippingCost={shippingCost} />
        </div>
    );
}
