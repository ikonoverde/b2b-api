import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Search,
    Bell,
    Settings,
    ChevronDown,
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    Users,
    Star,
    Check,
    UserPlus,
    AlertTriangle,
    X,
    Package,
} from 'lucide-react';
import type { PageProps } from '@/types';

interface SalesMetrics {
    daily: {
        total: number;
        change: number;
        previous: number;
    };
    weekly: {
        total: number;
        change: number;
        previous: number;
    };
    monthly: {
        total: number;
        change: number;
        previous: number;
    };
}

interface OrderStatus {
    status: string;
    label: string;
    count: number;
}

interface TopProduct {
    id: number;
    name: string;
    units_sold: number;
    revenue: number;
}

interface NewUsersCount {
    this_month: number;
    last_month: number;
    change: number;
}

interface LowStockAlert {
    id: number;
    name: string;
    sku: string;
    stock: number;
    min_stock: number;
}

interface Activity {
    id: number;
    title: string;
    time: string;
    type: string;
    order_id: number;
    customer: string;
}

interface DashboardProps extends PageProps {
    salesMetrics: SalesMetrics;
    ordersByStatus: OrderStatus[];
    topProducts: TopProduct[];
    newUsersCount: NewUsersCount;
    lowStockAlerts: LowStockAlert[];
    recentActivity: Activity[];
}

type SalesPeriod = 'daily' | 'weekly' | 'monthly';

const statusColorMap: Record<string, string> = {
    delivered: 'bg-[#4CAF50]',
    shipped: 'bg-[#2196F3]',
    processing: 'bg-[#9C27B0]',
    pending: 'bg-[#FFC107]',
    payment_pending: 'bg-[#FF9800]',
    cancelled: 'bg-[#F44336]',
};

const periodLabels: Record<SalesPeriod, { current: string; previous: string }> = {
    daily: { current: 'Hoy', previous: 'ayer' },
    weekly: { current: 'Esta Semana', previous: 'semana ant.' },
    monthly: { current: 'Este Mes', previous: 'mes ant.' },
};

function formatCurrency(value: number): string {
    return value.toLocaleString('es-MX', { minimumFractionDigits: 2 });
}

function SalesStatsCard({ currentSales, salesPeriod }: {
    currentSales: SalesMetrics[SalesPeriod];
    salesPeriod: SalesPeriod;
}) {
    const labels = periodLabels[salesPeriod];
    const isPositive = currentSales.change >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
        <div className="h-[200px] rounded-2xl p-6 flex flex-col gap-4 bg-[#4A5D4A]">
            <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white">
                    <span className="text-2xl font-semibold font-[Outfit] text-[#4A5D4A]">
                        $
                    </span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/20`}>
                    <TrendIcon className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-medium font-[Outfit] text-white">
                        {isPositive ? '+' : ''}{currentSales.change}%
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-sm font-[Outfit] text-white/70">
                    Ingresos {labels.current}
                </span>
                <span className="text-[40px] font-semibold font-[Inter] leading-tight text-white">
                    ${formatCurrency(currentSales.total)}
                </span>
            </div>
            <span className="text-xs font-[Outfit] text-white/50">
                vs ${formatCurrency(currentSales.previous)} {labels.previous}
            </span>
        </div>
    );
}

function StatsCard({ icon, iconBg, badge, title, value, subtitle }: {
    icon: React.ReactNode;
    iconBg: string;
    badge: React.ReactNode;
    title: string;
    value: React.ReactNode;
    subtitle: string;
}) {
    return (
        <div className="h-[200px] rounded-2xl p-6 flex flex-col gap-4 bg-white border border-[#E5E5E5]">
            <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
                    {icon}
                </div>
                {badge}
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-sm font-[Outfit] text-[#666666]">
                    {title}
                </span>
                <span className="text-[40px] font-semibold font-[Inter] leading-tight text-[#1A1A1A]">
                    {value}
                </span>
            </div>
            <span className="text-xs font-[Outfit] text-[#999999]">
                {subtitle}
            </span>
        </div>
    );
}

function TrendBadge({ change }: { change: number }) {
    const isPositive = change >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#E8F5E9]`}>
            <TrendIcon className={`w-3.5 h-3.5 ${isPositive ? 'text-[#4CAF50]' : 'text-[#F44336]'}`} />
            <span className={`text-xs font-medium font-[Outfit] ${isPositive ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>
                {isPositive ? '+' : ''}{change}%
            </span>
        </div>
    );
}

function PeriodTabs({ salesPeriod, onChangePeriod }: {
    salesPeriod: SalesPeriod;
    onChangePeriod: (period: SalesPeriod) => void;
}) {
    const tabs: { key: SalesPeriod; label: string }[] = [
        { key: 'daily', label: 'Dia' },
        { key: 'weekly', label: 'Semana' },
        { key: 'monthly', label: 'Mes' },
    ];

    return (
        <div className="flex items-center bg-[#F5F5F5] rounded-lg p-1">
            {tabs.map(({ key, label }) => (
                <button
                    key={key}
                    onClick={() => onChangePeriod(key)}
                    className={`px-4 py-2 rounded-md text-[13px] font-medium font-[Outfit] transition-colors ${
                        salesPeriod === key
                            ? 'bg-[#4A5D4A] text-white'
                            : 'text-[#666666] hover:bg-white/50'
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

function SalesTrendSection({ currentSales, salesPeriod, onChangePeriod }: {
    currentSales: SalesMetrics[SalesPeriod];
    salesPeriod: SalesPeriod;
    onChangePeriod: (period: SalesPeriod) => void;
}) {
    const isPositive = currentSales.change >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                        Tendencia de Ventas
                    </h2>
                    <p className="text-[13px] text-[#999999] font-[Outfit]">
                        Comparacion de periodos
                    </p>
                </div>
                <PeriodTabs salesPeriod={salesPeriod} onChangePeriod={onChangePeriod} />
            </div>

            {/* Sales Metrics Display */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#FAFAFA] rounded-xl p-4 flex flex-col gap-2">
                    <span className="text-xs text-[#999999] font-[Outfit]">Periodo Actual</span>
                    <span className="text-2xl font-semibold text-[#1A1A1A] font-[Inter]">
                        ${formatCurrency(currentSales.total)}
                    </span>
                </div>
                <div className="bg-[#FAFAFA] rounded-xl p-4 flex flex-col gap-2">
                    <span className="text-xs text-[#999999] font-[Outfit]">Periodo Anterior</span>
                    <span className="text-2xl font-semibold text-[#666666] font-[Inter]">
                        ${formatCurrency(currentSales.previous)}
                    </span>
                </div>
                <div className="bg-[#FAFAFA] rounded-xl p-4 flex flex-col gap-2">
                    <span className="text-xs text-[#999999] font-[Outfit]">Cambio</span>
                    <div className="flex items-center gap-2">
                        <TrendIcon className={`w-5 h-5 ${isPositive ? 'text-[#4CAF50]' : 'text-[#F44336]'}`} />
                        <span className={`text-2xl font-semibold font-[Inter] ${isPositive ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>
                            {isPositive ? '+' : ''}{currentSales.change}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TopProductsList({ topProducts }: { topProducts: TopProduct[] }) {
    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Top 10 Productos
                </h2>
                <Package className="w-5 h-5 text-[#999999]" />
            </div>
            <div className="flex flex-col gap-3">
                {topProducts.length > 0 ? (
                    topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center gap-3 p-2 hover:bg-[#FAFAFA] rounded-lg transition-colors">
                            <span className="w-6 h-6 rounded-full bg-[#4A5D4A] text-white text-xs font-medium flex items-center justify-center font-[Outfit]">
                                {index + 1}
                            </span>
                            <div className="flex-1 flex flex-col gap-0.5">
                                <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit] truncate">
                                    {product.name}
                                </span>
                                <span className="text-xs text-[#999999] font-[Outfit]">
                                    {product.units_sold} vendidos
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-[#4A5D4A] font-[Outfit]">
                                ${formatCurrency(product.revenue)}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-[#999999] font-[Outfit]">
                        No hay datos de ventas aun
                    </div>
                )}
            </div>
        </div>
    );
}

function OrderStatusList({ ordersByStatus }: { ordersByStatus: OrderStatus[] }) {
    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Pedidos por Estado
                </h2>
                <ShoppingCart className="w-5 h-5 text-[#999999]" />
            </div>
            <div className="flex flex-col gap-3">
                {ordersByStatus.map((status) => (
                    <div key={status.status} className="flex items-center justify-between p-2 hover:bg-[#FAFAFA] rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${statusColorMap[status.status] || 'bg-[#999999]'}`} />
                            <span className="text-sm text-[#1A1A1A] font-[Outfit]">
                                {status.label}
                            </span>
                        </div>
                        <span className="text-sm font-semibold text-[#1A1A1A] font-[Outfit]">
                            {status.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function LowStockAlerts({ lowStockAlerts }: { lowStockAlerts: LowStockAlert[] }) {
    if (lowStockAlerts.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Alertas de Stock
                </h2>
                <AlertTriangle className="w-5 h-5 text-[#FFC107]" />
            </div>
            <div className="flex flex-col gap-3">
                {lowStockAlerts.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center gap-3 p-2 bg-[#FFF8E1] rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-[#FFC107]" />
                        <div className="flex-1 flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit] truncate">
                                {product.name}
                            </span>
                            <span className="text-xs text-[#666666] font-[Outfit]">
                                SKU: {product.sku} | Stock: {product.stock}/{product.min_stock}
                            </span>
                        </div>
                    </div>
                ))}
                {lowStockAlerts.length > 5 && (
                    <span className="text-xs text-[#999999] font-[Outfit] text-center">
                        +{lowStockAlerts.length - 5} mas alertas
                    </span>
                )}
            </div>
        </div>
    );
}

const iconConfig: Record<string, { bg: string; color: string; Icon: React.ComponentType<{ className?: string }> }> = {
    success: {
        bg: '#E8F5E9',
        color: '#4CAF50',
        Icon: Check,
    },
    info: {
        bg: '#E3F2FD',
        color: '#2196F3',
        Icon: UserPlus,
    },
    warning: {
        bg: '#FFF8E1',
        color: '#FFC107',
        Icon: AlertTriangle,
    },
    review: {
        bg: '#F3E5F5',
        color: '#9C27B0',
        Icon: Star,
    },
    error: {
        bg: '#FFEBEE',
        color: '#F44336',
        Icon: X,
    },
};

function ActivityItem({ activity }: { activity: Activity }) {
    const config = iconConfig[activity.type] || iconConfig.info;
    const Icon = config.Icon;

    return (
        <div className="flex items-center gap-3">
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: config.bg }}
            >
                <span style={{ color: config.color }}>
                    <Icon className="w-5 h-5" />
                </span>
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                    {activity.title}
                </span>
                <span className="text-xs text-[#999999] font-[Outfit]">
                    {activity.time} • {activity.customer}
                </span>
            </div>
        </div>
    );
}

function DashboardHeader({ userName, userInitials, alertCount }: {
    userName: string;
    userInitials: string;
    alertCount: number;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <h1 className="text-[28px] font-semibold text-[#1A1A1A] font-[Outfit]">
                    Dashboard
                </h1>
                <p className="text-sm text-[#666666] font-[Outfit]">
                    Bienvenido de nuevo, {userName}
                </p>
            </div>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="flex items-center gap-3 w-60 h-11 px-4 bg-white rounded-lg border border-[#E5E5E5]">
                    <Search className="w-[18px] h-[18px] text-[#999999]" />
                    <span className="text-sm text-[#999999] font-[Outfit]">
                        Buscar...
                    </span>
                </div>

                {/* Bell */}
                <button className="w-11 h-11 bg-white rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-gray-50 transition-colors relative">
                    <Bell className="w-5 h-5 text-[#666666]" />
                    {alertCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                            {alertCount}
                        </span>
                    )}
                </button>

                {/* Settings */}
                <button className="w-11 h-11 bg-white rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Settings className="w-5 h-5 text-[#666666]" />
                </button>

                {/* User Profile */}
                <button className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 bg-white rounded-full border border-[#E5E5E5] hover:bg-gray-50 transition-colors">
                    <div className="w-9 h-9 bg-[#4A5D4A] rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white font-[Outfit]">
                            {userInitials}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                        {userName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[#999999]" />
                </button>
            </div>
        </div>
    );
}

export default function Dashboard({
    salesMetrics,
    ordersByStatus,
    topProducts,
    newUsersCount,
    lowStockAlerts,
    recentActivity,
}: DashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const [salesPeriod, setSalesPeriod] = useState<SalesPeriod>('monthly');

    const currentSales = salesMetrics[salesPeriod];
    const totalOrders = ordersByStatus.reduce((sum, status) => sum + status.count, 0);
    const pendingOrders = ordersByStatus.find(s => s.status === 'pending')?.count || 0;

    return (
        <AppLayout title="Dashboard" active="dashboard">
            <div className="flex flex-col gap-8 p-10 pr-12">
                {/* Header */}
                <DashboardHeader
                    userName={user?.name?.split(' ')[0] || 'Admin'}
                    userInitials={user?.initials?.[0] || 'A'}
                    alertCount={lowStockAlerts.length}
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-6">
                    <SalesStatsCard currentSales={currentSales} salesPeriod={salesPeriod} />

                    <StatsCard
                        icon={<ShoppingCart className="w-6 h-6 text-[#D4A853]" />}
                        iconBg="bg-[#FEF3E2]"
                        badge={
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#E8F5E9]">
                                <span className="text-xs font-medium font-[Outfit] text-[#4CAF50]">
                                    {totalOrders} total
                                </span>
                            </div>
                        }
                        title="Pedidos Pendientes"
                        value={pendingOrders}
                        subtitle={`${ordersByStatus.find(s => s.status === 'processing')?.count || 0} en proceso`}
                    />

                    <StatsCard
                        icon={<Users className="w-6 h-6 text-[#4CAF50]" />}
                        iconBg="bg-[#E8F5E9]"
                        badge={<TrendBadge change={newUsersCount.change} />}
                        title="Nuevos Clientes"
                        value={newUsersCount.this_month}
                        subtitle={`${newUsersCount.last_month} el mes pasado`}
                    />

                    <StatsCard
                        icon={<AlertTriangle className="w-6 h-6 text-[#FFC107]" />}
                        iconBg="bg-[#FFF8E1]"
                        badge={
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FFF8E1]">
                                <span className="text-xs font-medium font-[Outfit] text-[#FFC107]">
                                    Alertas
                                </span>
                            </div>
                        }
                        title="Stock Bajo"
                        value={lowStockAlerts.length}
                        subtitle="productos requieren atencion"
                    />
                </div>

                {/* Bottom Section */}
                <div className="flex gap-6 flex-1">
                    {/* Main Content - 2/3 width */}
                    <div className="flex-[2] flex flex-col gap-6">
                        <SalesTrendSection
                            currentSales={currentSales}
                            salesPeriod={salesPeriod}
                            onChangePeriod={setSalesPeriod}
                        />

                        {/* Top Products & Order Status */}
                        <div className="grid grid-cols-2 gap-6">
                            <TopProductsList topProducts={topProducts} />
                            <OrderStatusList ordersByStatus={ordersByStatus} />
                        </div>
                    </div>

                    {/* Right Sidebar - 1/3 width */}
                    <div className="flex-1 flex flex-col gap-6">
                        {/* Activity Panel */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                                    Actividad Reciente
                                </h2>
                                <button className="text-[13px] text-[#999999] font-[Outfit] hover:text-[#666666] transition-colors">
                                    Ver todo
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((activity) => (
                                        <ActivityItem
                                            key={activity.id}
                                            activity={activity}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-[#999999] font-[Outfit]">
                                        No hay actividad reciente
                                    </div>
                                )}
                            </div>
                        </div>

                        <LowStockAlerts lowStockAlerts={lowStockAlerts} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
