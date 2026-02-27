import { Package } from 'lucide-react';
import type { AdminOrder } from '@/types';
import { formatCurrency } from './helpers';

export default function OrderItemsTable({ order }: { order: AdminOrder }) {
    const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);

    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Productos ({order.items.length})
                </h2>
            </div>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-[#E5E5E5]">
                        <th className="text-left px-6 py-3">
                            <span className="text-sm font-medium text-[#666666]">Producto</span>
                        </th>
                        <th className="text-right px-6 py-3">
                            <span className="text-sm font-medium text-[#666666]">Precio</span>
                        </th>
                        <th className="text-right px-6 py-3">
                            <span className="text-sm font-medium text-[#666666]">Cant.</span>
                        </th>
                        <th className="text-right px-6 py-3">
                            <span className="text-sm font-medium text-[#666666]">Subtotal</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item) => (
                        <tr key={item.id} className="border-b border-[#E5E5E5]">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    {item.image ? (
                                        <img src={item.image} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Package className="w-5 h-5 text-gray-400" />
                                        </div>
                                    )}
                                    <span className="text-sm text-[#1A1A1A] font-[Outfit]">{item.product_name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-sm text-[#666666] font-[Outfit]">{formatCurrency(item.unit_price)}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-sm text-[#666666] font-[Outfit]">{item.quantity}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">{formatCurrency(item.subtotal)}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="px-6 py-4 flex flex-col gap-2 border-t border-[#E5E5E5]">
                <div className="flex justify-between text-sm font-[Outfit]">
                    <span className="text-[#999999]">Subtotal</span>
                    <span className="text-[#1A1A1A]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-[Outfit]">
                    <span className="text-[#999999]">Envio</span>
                    <span className="text-[#1A1A1A]">{formatCurrency(order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold font-[Outfit] pt-2 border-t border-[#E5E5E5]">
                    <span className="text-[#1A1A1A]">Total</span>
                    <span className="text-[#1A1A1A]">{formatCurrency(order.total_amount)}</span>
                </div>
                {order.refunded_amount > 0 && (
                    <div className="flex justify-between text-sm font-[Outfit]">
                        <span className="text-red-600">Reembolsado</span>
                        <span className="text-red-600">-{formatCurrency(order.refunded_amount)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
