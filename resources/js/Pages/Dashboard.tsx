import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Search,
    Bell,
    Settings,
    ChevronDown,
    TrendingUp,
    ShoppingCart,
    Users,
    Star,
    Check,
    UserPlus,
    AlertTriangle,
    X,
} from 'lucide-react';
import type { PageProps, Stat, Activity } from '@/types';

interface DashboardProps extends PageProps {
    stats: Stat[];
    recentActivity: Activity[];
}

export default function Dashboard({ stats, recentActivity }: DashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

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
                        <button className="w-11 h-11 bg-white rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <Bell className="w-5 h-5 text-[#666666]" />
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
                    {stats.map((stat, index) => (
                        <StatCard key={index} stat={stat} />
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="flex gap-6 flex-1">
                    {/* Chart Section */}
                    <div className="flex-1 bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                                    Tendencia de Ventas
                                </h2>
                                <p className="text-[13px] text-[#999999] font-[Outfit]">
                                    Ultimos 6 meses
                                </p>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center bg-[#F5F5F5] rounded-lg p-1">
                                <button className="px-4 py-2 bg-[#4A5D4A] rounded-md text-[13px] font-medium text-white font-[Outfit]">
                                    Semana
                                </button>
                                <button className="px-4 py-2 text-[13px] font-medium text-[#666666] font-[Outfit] hover:bg-white/50 rounded-md transition-colors">
                                    Mes
                                </button>
                                <button className="px-4 py-2 text-[13px] font-medium text-[#666666] font-[Outfit] hover:bg-white/50 rounded-md transition-colors">
                                    Ano
                                </button>
                            </div>
                        </div>

                        {/* Chart Placeholder */}
                        <div className="flex-1 bg-[#FAFAFA] rounded-xl flex flex-col items-center justify-center gap-3 min-h-[200px]">
                            <TrendingUp className="w-12 h-12 text-[#999999]" />
                            <span className="text-sm text-[#999999] font-[Outfit]">
                                Grafico de Ventas
                            </span>
                        </div>
                    </div>

                    {/* Activity Panel */}
                    <div className="w-[360px] bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                                Actividad Reciente
                            </h2>
                            <button className="text-[13px] text-[#999999] font-[Outfit] hover:text-[#666666] transition-colors">
                                Ver todo
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {recentActivity.map((activity) => (
                                <ActivityItem
                                    key={activity.id}
                                    activity={activity}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ stat }: { stat: Stat }) {
    const isFeatured = stat.featured;

    return (
        <div
            className={`h-[200px] rounded-2xl p-6 flex flex-col gap-4 ${
                isFeatured
                    ? 'bg-[#4A5D4A]'
                    : 'bg-white border border-[#E5E5E5]'
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isFeatured ? 'bg-white' : ''
                    }`}
                    style={
                        !isFeatured
                            ? { backgroundColor: stat.iconBg }
                            : undefined
                    }
                >
                    {stat.icon === '$' ? (
                        <span
                            className={`text-2xl font-semibold font-[Outfit] ${
                                isFeatured
                                    ? 'text-[#4A5D4A]'
                                    : ''
                            }`}
                            style={
                                !isFeatured
                                    ? { color: stat.iconColor }
                                    : undefined
                            }
                        >
                            $
                        </span>
                    ) : stat.icon === 'cart' ? (
                        <ShoppingCart
                            className="w-6 h-6"
                            style={{ color: stat.iconColor }}
                        />
                    ) : stat.icon === 'users' ? (
                        <Users
                            className="w-6 h-6"
                            style={{ color: stat.iconColor }}
                        />
                    ) : (
                        <Star
                            className="w-6 h-6"
                            style={{ color: stat.iconColor }}
                        />
                    )}
                </div>

                {/* Badge */}
                <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl ${
                        isFeatured
                            ? 'bg-white/20'
                            : 'bg-[#E8F5E9]'
                    }`}
                >
                    <TrendingUp
                        className={`w-3.5 h-3.5 ${
                            isFeatured ? 'text-white' : 'text-[#4CAF50]'
                        }`}
                    />
                    <span
                        className={`text-xs font-medium font-[Outfit] ${
                            isFeatured ? 'text-white' : 'text-[#4CAF50]'
                        }`}
                    >
                        {stat.change}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
                <span
                    className={`text-sm font-[Outfit] ${
                        isFeatured
                            ? 'text-white/70'
                            : 'text-[#666666]'
                    }`}
                >
                    {stat.label}
                </span>
                <span
                    className={`text-[40px] font-semibold font-[Inter] leading-tight ${
                        isFeatured ? 'text-white' : 'text-[#1A1A1A]'
                    }`}
                >
                    {stat.value}
                </span>
            </div>

            {/* Footer */}
            <span
                className={`text-xs font-[Outfit] ${
                    isFeatured ? 'text-white/50' : 'text-[#999999]'
                }`}
            >
                {stat.footer}
            </span>
        </div>
    );
}

function ActivityItem({ activity }: { activity: Activity }) {
    const iconConfig = {
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

    const config = iconConfig[activity.type];
    const Icon = config.Icon;

    return (
        <div className="flex items-center gap-3">
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: config.bg }}
            >
                <Icon className="w-5 h-5" style={{ color: config.color }} />
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                    {activity.title}
                </span>
                <span className="text-xs text-[#999999] font-[Outfit]">
                    {activity.time}
                </span>
            </div>
        </div>
    );
}
