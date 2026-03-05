import { Link, usePage, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import {
    Package,
    Truck,
    MapPin,
    ArrowLeft,
    FileText,
    RefreshCw,
    ChevronRight,
    CheckCircle2,
    Clock,
    XCircle,
    Send,
} from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '@/utils/currency';
import { formatDateTimeLong } from '@/utils/date';
import { statusLabels, statusColors } from '@/utils/order';
import type { PageProps } from '@/types';

interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    image: string | null;
    product?: {
        slug: string;
    };
}

interface StatusHistory {
    id: number;
    from_status: string | null;
    to_status: string;
    note: string | null;
    admin_name: string | null;
    created_at: string;
}

interface Order {
    id: number;
    status: string;
    payment_status: string;
    total_amount: number;
    shipping_cost: number;
    shipping_address: Record<string, string> | null;
    tracking_number: string | null;
    shipping_carrier: string | null;
    tracking_url: string | null;
    items: OrderItem[];
    status_histories: StatusHistory[];
    created_at: string;
}

interface Props extends PageProps {
    order: Order;
}

const statusIcons: Record<string, React.ReactNode> = {
    payment_pending: <Clock className="w-5 h-5" />,
    pending: <Clock className="w-5 h-5" />,
    processing: <RefreshCw className="w-5 h-5" />,
    shipped: <Send className="w-5 h-5" />,
    delivered: <CheckCircle2 className="w-5 h-5" />,
    cancelled: <XCircle className="w-5 h-5" />,
};


function getCarrierTrackingUrl(carrier: string | null, trackingNumber: string | null): string | null {
    if (!carrier || !trackingNumber) return null;

    const carrierLower = carrier.toLowerCase();

    if (carrierLower.includes('dhl')) {
        return `https://www.dhl.com/mx-es/home/tracking/tracking-parcel.html?submit=1&tracking-id=${trackingNumber}`;
    }
    if (carrierLower.includes('fedex')) {
        return `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`;
    }
    if (carrierLower.includes('ups')) {
        return `https://www.ups.com/track?tracknum=${trackingNumber}`;
    }
    if (carrierLower.includes('estafeta')) {
        return `https://www.estafeta.com/rastrear-pedido?gui=${trackingNumber}`;
    }
    if (carrierLower.includes('redpack')) {
        return `https://www.redpack.com.mx/es/rastreo/?guia=${trackingNumber}`;
    }
    if (carrierLower.includes('paquetexpress')) {
        return `https://www.paquetexpress.com.mx/rastreo/?guia=${trackingNumber}`;
    }

    return null;
}

function OrderHeader({ order }: { order: Order }) {
    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-[#1A1A1A] font-[Outfit]">
                            Pedido #{order.id}
                        </h1>
                        <p className="text-sm text-[#999999] font-[Outfit] mt-1">
                            Realizado el {formatDateTimeLong(order.created_at)}
                        </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status] || order.status}
                    </span>
                </div>
            </div>
        </div>
    );
}

function OrderItems({ items }: { items: OrderItem[] }) {
    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Productos ({items.length})
                </h2>
            </div>
            <div className="divide-y divide-[#E5E5E5]">
                {items.map((item) => (
                    <div key={item.id} className="p-6 flex items-center gap-4">
                        {item.product ? (
                            <Link
                                href={`/products/${item.product.slug}`}
                                className="w-20 h-20 bg-[#F5F5F5] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
                            >
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.product_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Package className="w-8 h-8 text-[#999999]" />
                                )}
                            </Link>
                        ) : (
                            <div className="w-20 h-20 bg-[#F5F5F5] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.product_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Package className="w-8 h-8 text-[#999999]" />
                                )}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            {item.product ? (
                                <Link
                                    href={`/products/${item.product.slug}`}
                                    className="text-sm font-medium text-[#1A1A1A] font-[Outfit] truncate hover:text-[#5E7052] hover:underline block"
                                >
                                    {item.product_name}
                                </Link>
                            ) : (
                                <p className="text-sm font-medium text-[#1A1A1A] font-[Outfit] truncate">
                                    {item.product_name}
                                </p>
                            )}
                            <p className="text-sm text-[#999999] font-[Outfit] mt-1">
                                Cantidad: {item.quantity}
                            </p>
                            <p className="text-sm font-medium text-[#1A1A1A] font-[Outfit] mt-1">
                                {formatCurrency(item.unit_price)} c/u
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-base font-semibold text-[#1A1A1A] font-[Outfit]">
                                {formatCurrency(item.subtotal)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="px-6 py-4 bg-[#F9F9F9] border-t border-[#E5E5E5]">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm font-[Outfit]">
                        <span className="text-[#999999]">Subtotal</span>
                        <span className="text-[#1A1A1A]">
                            {formatCurrency(items.reduce((sum, item) => sum + item.subtotal, 0))}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm font-[Outfit]">
                        <span className="text-[#999999]">Envío</span>
                        <span className="text-[#1A1A1A]">Por calcular</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold font-[Outfit] pt-2 border-t border-[#E5E5E5]">
                        <span className="text-[#1A1A1A]">Total</span>
                        <span className="text-[#1A1A1A]">
                            {formatCurrency(items.reduce((sum, item) => sum + item.subtotal, 0))}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusTimeline({ statusHistories, currentStatus }: { statusHistories: StatusHistory[]; currentStatus: string }) {
    const statusOrder = ['payment_pending', 'pending', 'processing', 'shipped', 'delivered'];

    const getTimelineSteps = () => {
        const currentIndex = statusOrder.indexOf(currentStatus);
        const isCancelled = currentStatus === 'cancelled';

        return statusOrder.map((status, index) => {
            const historyEntry = statusHistories.find(h => h.to_status === status);
            const isCompleted = !isCancelled && index <= currentIndex;
            const isCurrent = !isCancelled && index === currentIndex;

            return {
                status,
                label: statusLabels[status],
                icon: statusIcons[status],
                isCompleted,
                isCurrent,
                date: historyEntry ? formatDateTimeLong(historyEntry.created_at) : null,
            };
        });
    };

    const steps = getTimelineSteps();

    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Estado del Pedido
                </h2>
            </div>
            <div className="p-6">
                {currentStatus === 'cancelled' ? (
                    <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl">
                        <XCircle className="w-8 h-8 text-red-600" />
                        <div>
                            <p className="font-medium text-red-800 font-[Outfit]">
                                Pedido Cancelado
                            </p>
                            <p className="text-sm text-red-600 font-[Outfit]">
                                Este pedido ha sido cancelado
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <div key={step.status} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            step.isCompleted
                                                ? 'bg-[#5E7052] text-white'
                                                : step.isCurrent
                                                    ? 'bg-[#D4E5D0] text-[#5E7052]'
                                                    : 'bg-gray-100 text-gray-400'
                                        }`}
                                    >
                                        {step.icon}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`w-0.5 h-full min-h-[24px] mt-2 ${
                                                step.isCompleted ? 'bg-[#5E7052]' : 'bg-gray-200'
                                            }`}
                                        />
                                    )}
                                </div>
                                <div className="flex-1 pb-6">
                                    <p
                                        className={`font-medium font-[Outfit] ${
                                            step.isCompleted || step.isCurrent
                                                ? 'text-[#1A1A1A]'
                                                : 'text-gray-400'
                                        }`}
                                    >
                                        {step.label}
                                    </p>
                                    {step.date && (
                                        <p className="text-sm text-[#999999] font-[Outfit] mt-1">
                                            {step.date}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ShippingInfo({ order }: { order: Order }) {
    const trackingUrl = order.tracking_url || getCarrierTrackingUrl(order.shipping_carrier, order.tracking_number);

    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Información de Envío
                </h2>
            </div>
            <div className="p-6 space-y-4">
                {order.shipping_address && (
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#999999] mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                Dirección de entrega
                            </p>
                            <p className="text-sm text-[#666666] font-[Outfit] mt-1">
                                {order.shipping_address.street}, {order.shipping_address.city},{' '}
                                {order.shipping_address.state} {order.shipping_address.zip}
                            </p>
                        </div>
                    </div>
                )}

                {order.tracking_number ? (
                    <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-[#999999] mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                Número de rastreo
                            </p>
                            <p className="text-sm text-[#666666] font-[Outfit] mt-1">
                                {order.shipping_carrier} - {order.tracking_number}
                            </p>
                            {trackingUrl && (
                                <a
                                    href={trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-[#5E7052] hover:underline font-[Outfit] mt-2"
                                >
                                    Rastrear envío
                                    <ChevronRight className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-[#999999] mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                Información de rastreo
                            </p>
                            <p className="text-sm text-[#999999] font-[Outfit] mt-1">
                                La información de rastreo estará disponible una vez que el pedido sea enviado.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ActionButtons({ orderId }: { orderId: number }) {
    const [reordering, setReordering] = useState(false);

    const handleReorder = (): void => {
        setReordering(true);

        router.post(`/orders/${orderId}/reorder`, {}, {
            preserveScroll: true,
            onFinish: () => setReordering(false),
        });
    };

    const handleDownloadInvoice = () => {
        window.open(`/orders/${orderId}/invoice`, '_blank');
    };

    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Acciones
                </h2>
            </div>
            <div className="p-6 space-y-3">
                <button
                    onClick={handleReorder}
                    disabled={reordering}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#5E7052] rounded-xl text-sm font-medium text-white font-[Outfit] hover:bg-[#4d5e43] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RefreshCw className={`w-4 h-4 ${reordering ? 'animate-spin' : ''}`} />
                    {reordering ? 'Procesando...' : 'Volver a ordenar'}
                </button>

                <button
                    onClick={handleDownloadInvoice}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm font-medium text-[#1A1A1A] font-[Outfit] hover:bg-gray-50 transition-colors"
                >
                    <FileText className="w-4 h-4" />
                    Descargar factura
                </button>
            </div>
        </div>
    );
}

export default function OrderShow() {
    const { order, flash } = usePage<Props>().props;

    return (
        <CustomerLayout title={`Pedido #${order.id}`}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Link
                    href="/orders"
                    className="inline-flex items-center gap-2 text-sm text-[#666666] hover:text-[#1A1A1A] font-[Outfit] mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a mis pedidos
                </Link>

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

                <div className="space-y-6">
                    <OrderHeader order={order} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <OrderItems items={order.items} />
                            <StatusTimeline
                                statusHistories={order.status_histories}
                                currentStatus={order.status}
                            />
                        </div>

                        <div className="space-y-6">
                            <ShippingInfo order={order} />
                            <ActionButtons orderId={order.id} />
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
