import { Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Search,
    Filter,
    X,
} from 'lucide-react';
import { useState, FormEvent } from 'react';
import type { PageProps, AdminOrderListItem, OrderFilters } from '@/types';
import {
    statusLabels,
    paymentStatusLabels,
    getStatusColor,
    getPaymentStatusColor,
    formatDateShort,
    formatCurrency,
} from './helpers';

interface OrdersData {
    data: AdminOrderListItem[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

interface Props extends PageProps {
    orders: OrdersData;
    filters: OrderFilters;
}

function SortableHeader({ field, label, currentFilters }: { field: string; label: string; currentFilters: OrderFilters }) {
    const isActive = currentFilters.sort_by === field;

    const handleSort = () => {
        const newOrder = isActive && currentFilters.sort_order === 'desc' ? 'asc' : 'desc';
        router.get('/admin/orders', {
            ...currentFilters,
            sort_by: field,
            sort_order: newOrder,
        }, { preserveState: true });
    };

    return (
        <th
            className="text-left px-6 py-4 cursor-pointer hover:bg-muted"
            onClick={handleSort}
        >
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <ArrowUpDown className={`w-4 h-4 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`} />
            </div>
        </th>
    );
}

function FilterBar({ filters }: { filters: OrderFilters }) {
    const [localFilters, setLocalFilters] = useState(filters);
    const [showFilters, setShowFilters] = useState(false);

    const hasActiveFilters = filters.status || filters.payment_status || filters.date_from || filters.date_to || filters.customer || filters.amount_min || filters.amount_max;

    const applyFilters = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/orders', {
            ...localFilters,
            sort_by: filters.sort_by,
            sort_order: filters.sort_order,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        const cleared = {
            status: '',
            payment_status: '',
            date_from: '',
            date_to: '',
            customer: '',
            amount_min: '',
            amount_max: '',
            sort_by: filters.sort_by,
            sort_order: filters.sort_order,
        };
        setLocalFilters(cleared);
        router.get('/admin/orders', cleared, { preserveState: true });
    };

    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4">
                <form onSubmit={applyFilters} className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente..."
                            value={localFilters.customer}
                            onChange={(e) => setLocalFilters({ ...localFilters, customer: e.target.value })}
                            className="w-full h-10 pl-10 pr-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        className="h-10 px-4 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors"
                    >
                        Buscar
                    </button>
                </form>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 h-10 px-4 rounded-lg border text-sm font-medium transition-colors ${
                            hasActiveFilters
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-border text-muted-foreground hover:bg-muted'
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        Filtros
                        {hasActiveFilters && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                    </button>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 h-10 px-3 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {showFilters && (
                <form onSubmit={applyFilters} className="px-6 pb-4 flex flex-wrap gap-4 border-t border-border pt-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Estado</label>
                        <select
                            value={localFilters.status}
                            onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
                            className="h-9 px-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary"
                        >
                            <option value="">Todos</option>
                            {Object.entries(statusLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Pago</label>
                        <select
                            value={localFilters.payment_status}
                            onChange={(e) => setLocalFilters({ ...localFilters, payment_status: e.target.value })}
                            className="h-9 px-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary"
                        >
                            <option value="">Todos</option>
                            {Object.entries(paymentStatusLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Desde</label>
                        <input
                            type="date"
                            value={localFilters.date_from}
                            onChange={(e) => setLocalFilters({ ...localFilters, date_from: e.target.value })}
                            className="h-9 px-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Hasta</label>
                        <input
                            type="date"
                            value={localFilters.date_to}
                            onChange={(e) => setLocalFilters({ ...localFilters, date_to: e.target.value })}
                            className="h-9 px-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Monto Mín</label>
                        <input
                            type="number"
                            step="0.01"
                            value={localFilters.amount_min}
                            onChange={(e) => setLocalFilters({ ...localFilters, amount_min: e.target.value })}
                            className="h-9 w-28 px-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary"
                            placeholder="$0.00"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Monto Máx</label>
                        <input
                            type="number"
                            step="0.01"
                            value={localFilters.amount_max}
                            onChange={(e) => setLocalFilters({ ...localFilters, amount_max: e.target.value })}
                            className="h-9 w-28 px-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary"
                            placeholder="$0.00"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="h-9 px-4 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors"
                        >
                            Aplicar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

function OrderRow({ order }: { order: AdminOrderListItem }) {
    return (
        <tr className="border-b border-border hover:bg-muted">
            <td className="px-6 py-4">
                <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-sm text-foreground hover:underline font-medium"
                >
                    #{order.id}
                </Link>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="text-sm text-foreground">{order.user?.name}</span>
                    <span className="text-xs text-muted-foreground">{order.user?.email}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm font-medium text-foreground">
                    {formatCurrency(order.total_amount)}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {statusLabels[order.status] || order.status}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                    {paymentStatusLabels[order.payment_status] || order.payment_status}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground">
                    {formatDateShort(order.created_at)}
                </span>
            </td>
        </tr>
    );
}

function Pagination({ orders }: { orders: OrdersData }) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
                Mostrando {orders.from} a {orders.to} de {orders.total} pedidos
            </span>
            <div className="flex items-center gap-2">
                <Link
                    href={`?page=${orders.current_page - 1}`}
                    className={`p-2 rounded-lg border border-border ${
                        orders.current_page === 1
                            ? 'opacity-50 cursor-not-allowed pointer-events-none'
                            : 'hover:bg-muted'
                    }`}
                    preserveScroll
                >
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </Link>
                <span className="text-sm text-foreground">
                    {orders.current_page} / {orders.last_page}
                </span>
                <Link
                    href={`?page=${orders.current_page + 1}`}
                    className={`p-2 rounded-lg border border-border ${
                        orders.current_page === orders.last_page
                            ? 'opacity-50 cursor-not-allowed pointer-events-none'
                            : 'hover:bg-muted'
                    }`}
                    preserveScroll
                >
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
            </div>
        </div>
    );
}

export default function OrdersIndex() {
    const { orders, filters } = usePage<Props>().props;

    return (
        <AppLayout title="Pedidos" active="orders">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[28px] font-semibold text-foreground">
                            Pedidos
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Gestiona los pedidos del sistema
                        </p>
                    </div>
                </div>

                <FilterBar filters={filters} />

                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <SortableHeader field="created_at" label="ID" currentFilters={filters} />
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-muted-foreground">Cliente</span>
                                </th>
                                <SortableHeader field="total_amount" label="Total" currentFilters={filters} />
                                <SortableHeader field="status" label="Estado" currentFilters={filters} />
                                <SortableHeader field="payment_status" label="Pago" currentFilters={filters} />
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-muted-foreground">Fecha</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.map((order) => (
                                <OrderRow key={order.id} order={order} />
                            ))}
                        </tbody>
                    </table>

                    {orders.data.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-sm text-muted-foreground">No hay pedidos registrados</p>
                        </div>
                    )}

                    {orders.last_page > 1 && (
                        <Pagination orders={orders} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
