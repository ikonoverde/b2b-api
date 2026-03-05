import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import {
    Package,
    ChevronRight,
    RefreshCw,
    ShoppingBag,
} from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { formatDateLong } from '@/utils/date';
import { statusLabels, statusColors } from '@/utils/order';
import type { PageProps } from '@/types';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    image: string | null;
}

interface Order {
    id: number;
    status: string;
    payment_status: string;
    total_amount: number;
    shipping_cost: number;
    items: OrderItem[];
    created_at: string;
}

interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface OrdersIndexProps extends PageProps {
    orders: PaginatedOrders;
}


function ReorderButton({ orderId }: { orderId: number }) {
    const [processing, setProcessing] = useState(false);

    const handleReorder = (e: React.MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        setProcessing(true);

        router.post(`/orders/${orderId}/reorder`, {}, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <button
            type="button"
            onClick={handleReorder}
            disabled={processing}
            className="inline-flex items-center gap-1.5 text-sm text-[#5E7052] font-medium font-[Outfit] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <RefreshCw className={`w-3.5 h-3.5 ${processing ? 'animate-spin' : ''}`} />
            {processing ? 'Procesando...' : 'Reordenar'}
        </button>
    );
}

function OrderCard({ order }: { order: Order }) {
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Link
            href={`/orders/${order.id}`}
            className="block bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden hover:shadow-md transition-shadow"
        >
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm text-[#999999] font-[Outfit]">
                            Pedido #{order.id}
                        </p>
                        <p className="text-sm text-[#666666] font-[Outfit] mt-1">
                            {formatDateLong(order.created_at)}
                        </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status] || order.status}
                    </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                            <div
                                key={item.id}
                                className="w-12 h-12 rounded-lg bg-[#F5F5F5] border-2 border-white flex items-center justify-center overflow-hidden"
                                style={{ zIndex: order.items.length - index }}
                            >
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.product_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Package className="w-6 h-6 text-[#999999]" />
                                )}
                            </div>
                        ))}
                        {order.items.length > 3 && (
                            <div className="w-12 h-12 rounded-lg bg-[#E8EDE8] border-2 border-white flex items-center justify-center">
                                <span className="text-xs font-medium text-[#5E7052] font-[Outfit]">
                                    +{order.items.length - 3}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-[#666666] font-[Outfit]">
                            {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
                    <span className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                        {formatCurrency(order.total_amount)}
                    </span>
                    <div className="flex items-center gap-4">
                        <ReorderButton orderId={order.id} />
                        <span className="inline-flex items-center gap-1 text-sm text-[#5E7052] font-medium font-[Outfit]">
                            Ver detalles
                            <ChevronRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D4E5D0]">
                <ShoppingBag className="h-10 w-10 text-[#5E7052]" />
            </div>
            <div className="flex flex-col items-center gap-1">
                <h2 className="text-xl font-bold text-[#1A1A1A] font-[Outfit]">
                    No tienes pedidos
                </h2>
                <p className="text-center text-sm text-[#999999] font-[Outfit] max-w-sm">
                    Aún no has realizado ningún pedido. Explora nuestro catálogo y encuentra los productos que necesitas.
                </p>
            </div>
            <Link
                href="/catalog"
                className="mt-2 rounded-xl bg-[#5E7052] px-5 py-2.5 text-sm font-semibold text-white font-[Outfit] hover:bg-[#4d5e43] transition-colors"
            >
                Ver Catálogo
            </Link>
        </div>
    );
}

function Pagination({ orders }: { orders: PaginatedOrders }) {
    if (orders.last_page <= 1) {
        return null;
    }

    const handlePageChange = (page: number): void => {
        router.get('/orders', { page }, {
            preserveState: true,
            preserveScroll: false,
        });
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button
                onClick={() => handlePageChange(orders.current_page - 1)}
                disabled={orders.current_page === 1}
                className="px-4 py-2 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E5] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-[Outfit]"
            >
                Anterior
            </button>

            <span className="text-sm text-[#666666] font-[Outfit]">
                Página {orders.current_page} de {orders.last_page}
            </span>

            <button
                onClick={() => handlePageChange(orders.current_page + 1)}
                disabled={orders.current_page === orders.last_page}
                className="px-4 py-2 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E5] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-[Outfit]"
            >
                Siguiente
            </button>
        </div>
    );
}

export default function OrdersIndex() {
    const { orders, flash } = usePage<OrdersIndexProps>().props;

    return (
        <CustomerLayout title="Mis Pedidos">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit] mb-6">
                    Mis Pedidos
                </h1>

                {flash?.success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-sm text-green-700 font-[Outfit]">{flash.success}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-700 font-[Outfit]">{flash.error}</p>
                    </div>
                )}

                {orders.data.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        <div className="space-y-4">
                            {orders.data.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </div>

                        <Pagination orders={orders} />
                    </>
                )}
            </div>
        </CustomerLayout>
    );
}
