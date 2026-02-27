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
    const [salesPeriod, setSalesPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

    const currentSales = salesMetrics[salesPeriod];
    const totalOrders = ordersByStatus.reduce((sum, status) => sum + status.count, 0);
    const pendingOrders = ordersByStatus.find(s => s.status === 'pending')?.count || 0;

    return (
        <AppLayout title="Dashboard" active="dashboard">
            <div className="flex flex-col gap-8 p-10 pr-12">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[28px] font-semibold text-[#1A1A1A] font-[Outfit]">
                            Dashboard
                        </h1>
                        <p className="text-sm text-[#666666] font-[Outfit]">
                            Bienvenido de nuevo, {user?.name?.split(' ')[0] || 'Admin'}
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
                            {lowStockAlerts.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                                    {lowStockAlerts.length}
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
                                    {user?.initials?.[0] || 'A'}
                                </span>
                            </div>
                            <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                {user?.name?.split(' ')[0] || 'Admin'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-[#999999]" />
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-6">
                    {/* Main Sales Card - Featured */}
                    <div className="h-[200px] rounded-2xl p-6 flex flex-col gap-4 bg-[#4A5D4A]">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white">
                                <span className="text-2xl font-semibold font-[Outfit] text-[#4A5D4A]">
                                    $
                                </span>
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/20`}>
                                {currentSales.change >= 0 ? (
                                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                                ) : (
                                    <TrendingDown className="w-3.5 h-3.5 text-white" />
                                )}
                                <span className="text-xs font-medium font-[Outfit] text-white">
                                    {currentSales.change >= 0 ? '+' : ''}{currentSales.change}%
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-[Outfit] text-white/70">
                                Ingresos {salesPeriod === 'daily' ? 'Hoy' : salesPeriod === 'weekly' ? 'Esta Semana' : 'Este Mes'}
                            </span>
                            <span className="text-[40px] font-semibold font-[Inter] leading-tight text-white">
                                ${currentSales.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <span className="text-xs font-[Outfit] text-white/50">
                            vs ${currentSales.previous.toLocaleString('es-MX', { minimumFractionDigits: 2 })} {salesPeriod === 'daily' ? 'ayer' : salesPeriod === 'weekly' ? 'semana ant.' : 'mes ant.'}
                        </span>
                    </div>

                    {/* Orders Card */}
                    <div className="h-[200px] rounded-2xl p-6 flex flex-col gap-4 bg-white border border-[#E5E5E5]">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#FEF3E2]">
                                <ShoppingCart className="w-6 h-6 text-[#D4A853]" />
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#E8F5E9]">
                                <span className="text-xs font-medium font-[Outfit] text-[#4CAF50]">
                                    {totalOrders} total
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-[Outfit] text-[#666666]">
                                Pedidos Pendientes
                            </span>
                            <span className="text-[40px] font-semibold font-[Inter] leading-tight text-[#1A1A1A]">
                                {pendingOrders}
                            </span>
                        </div>
                        <span className="text-xs font-[Outfit] text-[#999999]">
                            {ordersByStatus.find(s => s.status === 'processing')?.count || 0} en proceso
                        </span>
                    </div>

                    {/* Users Card */}
                    <div className="h-[200px] rounded-2xl p-6 flex flex-col gap-4 bg-white border border-[#E5E5E5]">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#E8F5E9]">
                                <Users className="w-6 h-6 text-[#4CAF50]" />
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#E8F5E9]`}>
                                {newUsersCount.change >= 0 ? (
                                    <TrendingUp className="w-3.5 h-3.5 text-[#4CAF50]" />
                                ) : (
                                    <TrendingDown className="w-3.5 h-3.5 text-[#F44336]" />
                                )}
                                <span className={`text-xs font-medium font-[Outfit] ${newUsersCount.change >= 0 ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>
                                    {newUsersCount.change >= 0 ? '+' : ''}{newUsersCount.change}%
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-[Outfit] text-[#666666]">
                                Nuevos Clientes
                            </span>
                            <span className="text-[40px] font-semibold font-[Inter] leading-tight text-[#1A1A1A]">
                                {newUsersCount.this_month}
                            </span>
                        </div>
                        <span className="text-xs font-[Outfit] text-[#999999]">
                            {newUsersCount.last_month} el mes pasado
                        </span>
                    </div>

                    {/* Low Stock Card */}
                    <div className="h-[200px] rounded-2xl p-6 flex flex-col gap-4 bg-white border border-[#E5E5E5]">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#FFF8E1]">
                                <AlertTriangle className="w-6 h-6 text-[#FFC107]" />
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FFF8E1]">
                                <span className="text-xs font-medium font-[Outfit] text-[#FFC107]">
                                    Alertas
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-[Outfit] text-[#666666]">
                                Stock Bajo
                            </span>
                            <span className="text-[40px] font-semibold font-[Inter] leading-tight text-[#1A1A1A]">
                                {lowStockAlerts.length}
                            </span>
                        </div>
                        <span className="text-xs font-[Outfit] text-[#999999]">
                            productos requieren atencion
                        </span>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex gap-6 flex-1">
                    {/* Main Content - 2/3 width */}
                    <div className="flex-[2] flex flex-col gap-6">
                        {/* Sales Chart */}
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

                                {/* Period Tabs */}
                                <div className="flex items-center bg-[#F5F5F5] rounded-lg p-1">
                                    <button
                                        onClick={() => setSalesPeriod('daily')}
                                        className={`px-4 py-2 rounded-md text-[13px] font-medium font-[Outfit] transition-colors ${
                                            salesPeriod === 'daily'
                                                ? 'bg-[#4A5D4A] text-white'
                                                : 'text-[#666666] hover:bg-white/50'
                                        }`}
                                    >
                                        Dia
                                    </button>
                                    <button
                                        onClick={() => setSalesPeriod('weekly')}
                                        className={`px-4 py-2 rounded-md text-[13px] font-medium font-[Outfit] transition-colors ${
                                            salesPeriod === 'weekly'
                                                ? 'bg-[#4A5D4A] text-white'
                                                : 'text-[#666666] hover:bg-white/50'
                                        }`}
                                    >
                                        Semana
                                    </button>
                                    <button
                                        onClick={() => setSalesPeriod('monthly')}
                                        className={`px-4 py-2 rounded-md text-[13px] font-medium font-[Outfit] transition-colors ${
                                            salesPeriod === 'monthly'
                                                ? 'bg-[#4A5D4A] text-white'
                                                : 'text-[#666666] hover:bg-white/50'
                                        }`}
                                    >
                                        Mes
                                    </button>
                                </div>
                            </div>

                            {/* Sales Metrics Display */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-[#FAFAFA] rounded-xl p-4 flex flex-col gap-2">
                                    <span className="text-xs text-[#999999] font-[Outfit]">Periodo Actual</span>
                                    <span className="text-2xl font-semibold text-[#1A1A1A] font-[Inter]">
                                        ${currentSales.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="bg-[#FAFAFA] rounded-xl p-4 flex flex-col gap-2">
                                    <span className="text-xs text-[#999999] font-[Outfit]">Periodo Anterior</span>
                                    <span className="text-2xl font-semibold text-[#666666] font-[Inter]">
                                        ${currentSales.previous.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="bg-[#FAFAFA] rounded-xl p-4 flex flex-col gap-2">
                                    <span className="text-xs text-[#999999] font-[Outfit]">Cambio</span>
                                    <div className="flex items-center gap-2">
                                        {currentSales.change >= 0 ? (
                                            <TrendingUp className="w-5 h-5 text-[#4CAF50]" />
                                        ) : (
                                            <TrendingDown className="w-5 h-5 text-[#F44336]" />
                                        )}
                                        <span className={`text-2xl font-semibold font-[Inter] ${currentSales.change >= 0 ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>
                                            {currentSales.change >= 0 ? '+' : ''}{currentSales.change}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Products & Order Status */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Top Products */}
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
                                                    ${product.revenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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

                            {/* Order Status */}
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
                                                <div className={`w-3 h-3 rounded-full ${getStatusColor(status.status)}`} />
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

                        {/* Low Stock Alerts */}
                        {lowStockAlerts.length > 0 && (
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
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function getStatusColor(status: string): string {
    switch (status) {
        case 'delivered':
            return 'bg-[#4CAF50]';
        case 'shipped':
            return 'bg-[#2196F3]';
        case 'processing':
            return 'bg-[#9C27B0]';
        case 'pending':
            return 'bg-[#FFC107]';
        case 'payment_pending':
            return 'bg-[#FF9800]';
        case 'cancelled':
            return 'bg-[#F44336]';
        default:
            return 'bg-[#999999]';
    }
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
