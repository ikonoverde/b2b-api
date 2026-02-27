import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import {
    Package,
    ChevronRight,
    ShoppingBag,
    Loader2,
} from 'lucide-react';

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
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const statusLabels: Record<string, string> = {
    payment_pending: 'Pago Pendiente',
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};

const statusColors: Record<string, string> = {
    payment_pending: 'bg-orange-100 text-orange-800',
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(amount);
};

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
                            {formatDate(order.created_at)}
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
                    <span className="inline-flex items-center gap-1 text-sm text-[#5E7052] font-medium font-[Outfit]">
                        Ver detalles
                        <ChevronRight className="w-4 h-4" />
                    </span>
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

function Pagination({
    meta,
    onPageChange,
}: {
    meta: PaginatedOrders['meta'];
    onPageChange: (page: number) => void;
}) {
    if (meta.last_page <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(meta.current_page - 1)}
                disabled={meta.current_page === 1}
                className="px-4 py-2 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E5] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-[Outfit]"
            >
                Anterior
            </button>

            <span className="text-sm text-[#666666] font-[Outfit]">
                Página {meta.current_page} de {meta.last_page}
            </span>

            <button
                onClick={() => onPageChange(meta.current_page + 1)}
                disabled={meta.current_page === meta.last_page}
                className="px-4 py-2 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E5] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-[Outfit]"
            >
                Siguiente
            </button>
        </div>
    );
}

export default function OrdersIndex() {
    const [orders, setOrders] = useState<PaginatedOrders | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchOrders = async (page: number = 1) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/orders?page=${page}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar los pedidos');
            }

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <CustomerLayout title="Mis Pedidos">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit] mb-6">
                    Mis Pedidos
                </h1>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-[#5E7052] animate-spin" />
                        <span className="ml-2 text-[#666666] font-[Outfit]">Cargando...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-600 font-[Outfit]">{error}</p>
                        <button
                            onClick={() => fetchOrders(currentPage)}
                            className="mt-4 text-[#5E7052] hover:underline font-[Outfit]"
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                ) : orders?.data.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        <div className="space-y-4">
                            {orders?.data.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </div>

                        {orders?.meta && (
                            <Pagination
                                meta={orders.meta}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </CustomerLayout>
    );
}
