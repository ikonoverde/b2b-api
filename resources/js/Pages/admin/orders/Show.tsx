import { Link, usePage, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Package,
    User,
    MapPin,
    Truck,
    DollarSign,
    Printer,
    AlertTriangle,
    Loader2,
} from 'lucide-react';
import { useState, FormEvent } from 'react';
import type { PageProps, AdminOrder } from '@/types';
import {
    statusLabels,
    paymentStatusLabels,
    getStatusColor,
    getPaymentStatusColor,
    formatDate,
    formatCurrency,
    allowedTransitions,
} from './helpers';
import StatusChangeModal from './StatusChangeModal';
import RefundModal from './RefundModal';
import OrderItemsTable from './OrderItemsTable';
import StatusHistoryTimeline from './StatusHistoryTimeline';
import NotesSection from './NotesSection';

interface Props extends PageProps {
    order: AdminOrder;
}

function OrderInfoCard({ order }: { order: AdminOrder }) {
    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Pedido #{order.id}
                </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estado</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {statusLabels[order.status] || order.status}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pago</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                        {paymentStatusLabels[order.payment_status] || order.payment_status}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-sm font-medium text-foreground">
                        {formatCurrency(order.total_amount)}
                    </span>
                </div>
                {order.refunded_amount > 0 && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Reembolsado</span>
                        <span className="text-sm font-medium text-destructive">
                            {formatCurrency(order.refunded_amount)}
                        </span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Fecha</span>
                    <span className="text-sm text-foreground">
                        {formatDate(order.created_at)}
                    </span>
                </div>
            </div>
        </div>
    );
}

function CustomerCard({ order }: { order: AdminOrder }) {
    if (!order.customer) {
        return null;
    }

    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Cliente</h2>
            </div>
            <div className="p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <Link
                            href={`/admin/users/${order.customer.id}`}
                            className="text-sm font-medium text-foreground hover:underline"
                        >
                            {order.customer.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShippingCard({ order }: { order: AdminOrder }) {
    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Envio</h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
                {order.shipping_method && (
                    <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-muted-foreground" />
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Metodo</span>
                            <span className="text-sm text-foreground">{order.shipping_method.name}</span>
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Costo de Envio</span>
                        <span className="text-sm text-foreground">{formatCurrency(order.shipping_cost)}</span>
                    </div>
                </div>
                {order.shipping_address && (
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Direccion</span>
                            <span className="text-sm text-foreground">
                                {order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                            </span>
                        </div>
                    </div>
                )}
                {order.tracking_number && (
                    <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-muted-foreground" />
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Rastreo</span>
                            <span className="text-sm text-foreground">
                                {order.shipping_carrier} - {order.tracking_number}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusManagementCard({ order, onOpenStatusModal }: { order: AdminOrder; onOpenStatusModal: () => void }) {
    const transitions = allowedTransitions[order.status] || [];

    if (transitions.length === 0) {
        return null;
    }

    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Gestion de Estado</h2>
            </div>
            <div className="p-6">
                <button
                    onClick={onOpenStatusModal}
                    className="w-full px-4 py-2.5 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors"
                >
                    Cambiar Estado
                </button>
            </div>
        </div>
    );
}

function ShippingLabelCard({ order }: { order: AdminOrder }) {
    if (order.shipping_quote_source !== 'skydropx') {
        return null;
    }

    const [retrying, setRetrying] = useState(false);

    const handleRetry = () => {
        setRetrying(true);
        router.post(`/admin/orders/${order.id}/retry-label`, {}, {
            preserveScroll: true,
            onFinish: () => setRetrying(false),
        });
    };

    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Guía de Envío</h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
                {order.label_url ? (
                    <>
                        <div className="flex items-center gap-3">
                            <Printer className="w-5 h-5 text-primary" />
                            <span className="text-sm text-primary font-medium">Guía generada</span>
                        </div>
                        {order.skydropx_shipment_id && (
                            <div className="text-xs text-muted-foreground">
                                ID Envío: {order.skydropx_shipment_id}
                            </div>
                        )}
                        <a
                            href={order.label_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-4 py-2.5 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors text-center flex items-center justify-center gap-2"
                        >
                            <Printer className="w-4 h-4" />
                            Imprimir Guía
                        </a>
                    </>
                ) : order.label_error ? (
                    <>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                            <p className="text-sm text-destructive">{order.label_error}</p>
                        </div>
                        <button
                            onClick={handleRetry}
                            disabled={retrying}
                            className="w-full px-4 py-2.5 bg-muted-foreground rounded-lg text-sm font-medium text-white hover:bg-muted-foreground/90 transition-colors disabled:opacity-50"
                        >
                            {retrying ? 'Reintentando...' : 'Reintentar Generación'}
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                        <span className="text-sm text-muted-foreground">Generando guía de envío...</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function TrackingForm({ order }: { order: AdminOrder }) {
    const { data, setData, patch, processing, errors } = useForm({
        tracking_number: order.tracking_number || '',
        shipping_carrier: order.shipping_carrier || '',
    });

    if (order.status !== 'processing') {
        return null;
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        patch(`/admin/orders/${order.id}/tracking`);
    };

    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Rastreo de Envio</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Paqueteria</label>
                    <input
                        type="text"
                        value={data.shipping_carrier}
                        onChange={(e) => setData('shipping_carrier', e.target.value)}
                        placeholder="DHL, FedEx, Estafeta..."
                        className="h-10 px-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors"
                    />
                    {errors.shipping_carrier && (
                        <span className="text-xs text-destructive">{errors.shipping_carrier}</span>
                    )}
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Numero de Rastreo</label>
                    <input
                        type="text"
                        value={data.tracking_number}
                        onChange={(e) => setData('tracking_number', e.target.value)}
                        placeholder="Ingresa el numero de rastreo"
                        className="h-10 px-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors"
                    />
                    {errors.tracking_number && (
                        <span className="text-xs text-destructive">{errors.tracking_number}</span>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full px-4 py-2.5 bg-accent-foreground rounded-lg text-sm font-medium text-white hover:bg-accent-foreground/90 transition-colors disabled:opacity-50"
                >
                    {processing ? 'Enviando...' : 'Marcar como Enviado'}
                </button>
            </form>
        </div>
    );
}

function RefundSection({ order, onOpenRefundModal }: { order: AdminOrder; onOpenRefundModal: () => void }) {
    if (!order.payment_intent_id || order.payment_status !== 'completed') {
        return null;
    }

    const remaining = order.total_amount - order.refunded_amount;
    if (remaining <= 0) {
        return null;
    }

    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Reembolso</h2>
            </div>
            <div className="p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Disponible para reembolso</span>
                    <span className="font-medium text-foreground">{formatCurrency(remaining)}</span>
                </div>
                <button
                    onClick={onOpenRefundModal}
                    className="w-full px-4 py-2.5 bg-destructive rounded-lg text-sm font-medium text-white hover:bg-destructive/90 transition-colors"
                >
                    Procesar Reembolso
                </button>
            </div>
        </div>
    );
}

export default function OrderShow() {
    const { order } = usePage<Props>().props;
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);

    return (
        <AppLayout title={`Pedido #${order.id}`} active="orders">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm">
                            <Link
                                href="/admin/orders"
                                className="text-muted-foreground hover:text-muted-foreground transition-colors"
                            >
                                Pedidos
                            </Link>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-muted-foreground">Pedido #{order.id}</span>
                        </div>
                        <h1 className="text-[28px] font-semibold text-foreground">
                            Pedido #{order.id}
                        </h1>
                    </div>
                </div>

                <div className="flex gap-8">
                    <div className="w-[400px] flex flex-col gap-6">
                        <OrderInfoCard order={order} />
                        <CustomerCard order={order} />
                        <ShippingCard order={order} />
                        <ShippingLabelCard order={order} />
                        <StatusManagementCard order={order} onOpenStatusModal={() => setShowStatusModal(true)} />
                        <TrackingForm order={order} />
                        <RefundSection order={order} onOpenRefundModal={() => setShowRefundModal(true)} />
                    </div>

                    <div className="flex-1 flex flex-col gap-6">
                        <OrderItemsTable order={order} />
                        <StatusHistoryTimeline order={order} />
                        <NotesSection order={order} />
                    </div>
                </div>
            </div>

            {showStatusModal && (
                <StatusChangeModal
                    order={order}
                    onClose={() => setShowStatusModal(false)}
                />
            )}

            {showRefundModal && (
                <RefundModal
                    order={order}
                    onClose={() => setShowRefundModal(false)}
                />
            )}
        </AppLayout>
    );
}
