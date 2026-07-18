import { Package } from 'lucide-react';
import type { AdminOrder } from '@/types';
import { formatCurrency } from './helpers';

export default function OrderItemsTable({ order }: { order: AdminOrder }) {
    const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);

    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Productos ({order.items.length})
                </h2>
            </div>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        <th className="text-left px-6 py-3">
                            <span className="text-sm font-medium text-muted-foreground">Producto</span>
                        </th>
                        <th className="text-right px-6 py-3">
                            <span className="text-sm font-medium text-muted-foreground">Precio</span>
                        </th>
                        <th className="text-right px-6 py-3">
                            <span className="text-sm font-medium text-muted-foreground">Cant.</span>
                        </th>
                        <th className="text-right px-6 py-3">
                            <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item) => (
                        <tr key={item.id} className="border-b border-border">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    {item.image ? (
                                        <img src={item.image} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                            <Package className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                    )}
                                    <span className="text-sm text-foreground">{item.product_name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-sm text-muted-foreground">{formatCurrency(item.unit_price)}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-sm text-muted-foreground">{item.quantity}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-sm font-medium text-foreground">{formatCurrency(item.subtotal)}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="px-6 py-4 flex flex-col gap-2 border-t border-border">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envio</span>
                    <span className="text-foreground">{formatCurrency(order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">{formatCurrency(order.total_amount)}</span>
                </div>
                {order.refunded_amount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-destructive">Reembolsado</span>
                        <span className="text-destructive">-{formatCurrency(order.refunded_amount)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
