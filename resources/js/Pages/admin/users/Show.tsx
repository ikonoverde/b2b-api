import { Link, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    FileText,
    Calendar,
    CreditCard,
    Package,
    TrendingUp,
    Clock,
    Shield,
    UserCog,
    X,
    Check,
} from 'lucide-react';
import { useState, FormEvent } from 'react';
import type { PageProps } from '@/types';
import type { DetailedUser, UserOrder, UserActivity, User } from '@/types';

interface OrderData {
    data: UserOrder[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

interface Props extends PageProps {
    user: DetailedUser;
    orders: OrderData;
    activity: UserActivity;
    auth: {
        user: User;
    };
}

const roleLabels: Record<string, string> = {
    customer: 'Cliente',
    admin: 'Administrador',
    super_admin: 'Super Admin',
};

const availableRoles = [
    { value: 'customer', label: 'Cliente', description: 'Acceso básico al catálogo y compras' },
    { value: 'admin', label: 'Administrador', description: 'Gestión de productos, usuarios y pedidos' },
    { value: 'super_admin', label: 'Super Admin', description: 'Control total del sistema y gestión de roles' },
];

const paymentMethodLabels: Record<string, string> = {
    card: 'Tarjeta',
    paypal: 'PayPal',
};

const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};

const paymentStatusLabels: Record<string, string> = {
    pending: 'Pendiente',
    paid: 'Pagado',
    failed: 'Fallido',
    refunded: 'Reembolsado',
};

export default function UserShow() {
    const { user, orders, activity, auth } = usePage<Props>().props;
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        role: user.role,
    });

    const canAssignAdminRoles = auth.user?.role === 'super_admin';
    const isSelf = auth.user?.id === user.id;

    const handleRoleSubmit = (e: FormEvent) => {
        e.preventDefault();
        patch(`/admin/users/${user.id}/role`, {
            onSuccess: () => {
                setShowRoleModal(false);
            },
        });
    };

    const openRoleModal = () => {
        setData('role', user.role);
        setRoleDropdownOpen(false);
        setShowRoleModal(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            refunded: 'bg-purple-100 text-purple-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout title="Detalles del Usuario" active="users">
            <div className="flex flex-col gap-6 p-10 pr-12">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm font-[Outfit]">
                            <Link
                                href="/admin/users"
                                className="text-[#999999] hover:text-[#666666] transition-colors"
                            >
                                Usuarios
                            </Link>
                            <span className="text-[#999999]">/</span>
                            <span className="text-[#666666]">Detalles del Usuario</span>
                        </div>
                        <h1 className="text-[28px] font-semibold text-[#1A1A1A] font-[Outfit]">
                            {user.name}
                        </h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-8">
                    {/* Left Column - User Info */}
                    <div className="w-[400px] flex flex-col gap-6">
                        {/* Personal Information Card */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                                    Información Personal
                                </h2>
                            </div>
                            <div className="p-6 flex flex-col gap-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#E8EDE8] rounded-full flex items-center justify-center">
                                        <span className="text-lg font-semibold text-[#4A5D4A] font-[Outfit]">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                            {user.name}
                                        </span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.is_active 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {roleLabels[user.role] || user.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-[#999999]" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-[#999999] font-[Outfit]">Email</span>
                                            <span className="text-sm text-[#1A1A1A] font-[Outfit]">{user.email}</span>
                                        </div>
                                    </div>

                                    {user.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-[#999999]" />
                                            <div className="flex flex-col">
                                                <span className="text-xs text-[#999999] font-[Outfit]">Teléfono</span>
                                                <span className="text-sm text-[#1A1A1A] font-[Outfit]">{user.phone}</span>
                                            </div>
                                        </div>
                                    )}

                                    {user.rfc && (
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-[#999999]" />
                                            <div className="flex flex-col">
                                                <span className="text-xs text-[#999999] font-[Outfit]">RFC</span>
                                                <span className="text-sm text-[#1A1A1A] font-[Outfit]">{user.rfc}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-[#999999]" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-[#999999] font-[Outfit]">Fecha de Registro</span>
                                            <span className="text-sm text-[#1A1A1A] font-[Outfit]">
                                                {formatDate(user.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    {user.email_verified_at && (
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-green-500" />
                                            <div className="flex flex-col">
                                                <span className="text-xs text-[#999999] font-[Outfit]">Email Verificado</span>
                                                <span className="text-sm text-[#1A1A1A] font-[Outfit]">
                                                    {formatDate(user.email_verified_at)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Role Management Card */}
                        {!isSelf && (
                            <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                                <div className="px-6 py-5 border-b border-[#E5E5E5]">
                                    <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                                        Gestión de Rol
                                    </h2>
                                </div>
                                <div className="p-6 flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <UserCog className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                                Rol Actual
                                            </span>
                                            <p className="text-xs text-[#666666] font-[Outfit]">
                                                {roleLabels[user.role] || user.role}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={openRoleModal}
                                        disabled={!canAssignAdminRoles && (user.role === 'admin' || user.role === 'super_admin')}
                                        className="w-full px-4 py-2.5 bg-[#4A5D4A] rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cambiar Rol
                                    </button>

                                    {!canAssignAdminRoles && (user.role === 'admin' || user.role === 'super_admin') && (
                                        <p className="text-xs text-[#999999] font-[Outfit]">
                                            Solo los Super Admin pueden cambiar roles de administradores.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Payment Method Card */}
                        {(user.pm_type || user.pm_last_four) && (
                            <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                                <div className="px-6 py-5 border-b border-[#E5E5E5]">
                                    <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                                        Método de Pago
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-5 h-5 text-[#999999]" />
                                        <div className="flex flex-col">
                                            <span className="text-sm text-[#1A1A1A] font-[Outfit]">
                                                {paymentMethodLabels[user.pm_type || ''] || user.pm_type || 'Método de Pago'}
                                            </span>
                                            {user.pm_last_four && (
                                                <span className="text-xs text-[#999999] font-[Outfit]">
                                                    •••• {user.pm_last_four}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Orders and Activity */}
                    <div className="flex-1 flex flex-col gap-6">
                        {/* Activity Summary */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Package className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <span className="text-2xl font-semibold text-[#1A1A1A] font-[Outfit]">
                                            {activity.total_orders}
                                        </span>
                                        <p className="text-xs text-[#999999] font-[Outfit]">Pedidos</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <span className="text-2xl font-semibold text-[#1A1A1A] font-[Outfit]">
                                            {formatCurrency(activity.total_spent)}
                                        </span>
                                        <p className="text-xs text-[#999999] font-[Outfit]">Total Gastado</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <span className="text-2xl font-semibold text-[#1A1A1A] font-[Outfit]">
                                            {activity.account_age_days}
                                        </span>
                                        <p className="text-xs text-[#999999] font-[Outfit]">Días como Cliente</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-[#E5E5E5] p-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <span className="text-2xl font-semibold text-[#1A1A1A] font-[Outfit]">
                                            {activity.last_order_date ? formatDate(activity.last_order_date) : 'N/A'}
                                        </span>
                                        <p className="text-xs text-[#999999] font-[Outfit]">Último Pedido</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orders History */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                                    Historial de Pedidos
                                </h2>
                            </div>

                            {orders.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Package className="w-12 h-12 text-[#E5E5E5] mb-3" />
                                    <p className="text-sm text-[#666666] font-[Outfit]">No hay pedidos registrados</p>
                                </div>
                            ) : (
                                <>
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-[#E5E5E5]">
                                                <th className="text-left px-6 py-4">
                                                    <span className="text-sm font-medium text-[#666666]">Pedido</span>
                                                </th>
                                                <th className="text-left px-6 py-4">
                                                    <span className="text-sm font-medium text-[#666666]">Estado</span>
                                                </th>
                                                <th className="text-left px-6 py-4">
                                                    <span className="text-sm font-medium text-[#666666]">Pago</span>
                                                </th>
                                                <th className="text-left px-6 py-4">
                                                    <span className="text-sm font-medium text-[#666666]">Total</span>
                                                </th>
                                                <th className="text-left px-6 py-4">
                                                    <span className="text-sm font-medium text-[#666666]">Fecha</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.data.map((order) => (
                                                <tr 
                                                    key={order.id} 
                                                    className="border-b border-[#E5E5E5] hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4">
                                                        <Link 
                                                            href={`/admin/orders/${order.id}`}
                                                            className="text-sm text-[#1A1A1A] hover:underline font-medium font-[Outfit]"
                                                        >
                                                            #{order.id}
                                                        </Link>
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
                                                        <span className="text-sm text-[#1A1A1A] font-medium font-[Outfit]">
                                                            {formatCurrency(order.total_amount)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-[#666666] font-[Outfit]">
                                                            {formatDate(order.created_at)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {orders.last_page > 1 && (
                                        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]">
                                            <span className="text-sm text-[#666666] font-[Outfit]">
                                                Mostrando {orders.from} a {orders.to} de {orders.total} pedidos
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`?page=${orders.current_page - 1}`}
                                                    className={`p-2 rounded-lg border border-[#E5E5E5] ${
                                                        orders.current_page === 1 
                                                            ? 'opacity-50 cursor-not-allowed pointer-events-none'
                                                            : 'hover:bg-gray-50'
                                                    }`}
                                                    preserveScroll
                                                >
                                                    <ChevronLeft className="w-4 h-4 text-[#666666]" />
                                                </Link>
                                                <span className="text-sm text-[#1A1A1A] font-[Outfit]">
                                                    {orders.current_page} / {orders.last_page}
                                                </span>
                                                <Link
                                                    href={`?page=${orders.current_page + 1}`}
                                                    className={`p-2 rounded-lg border border-[#E5E5E5] ${
                                                        orders.current_page === orders.last_page
                                                            ? 'opacity-50 cursor-not-allowed pointer-events-none'
                                                            : 'hover:bg-gray-50'
                                                    }`}
                                                    preserveScroll
                                                >
                                                    <ChevronRight className="w-4 h-4 text-[#666666]" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Change Confirmation Modal */}
            {showRoleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[500px] flex flex-col">
                        <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between flex-shrink-0">
                            <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                                Cambiar Rol de Usuario
                            </h2>
                            <button
                                onClick={() => setShowRoleModal(false)}
                                className="p-1.5 text-[#999999] hover:text-[#666666] hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleRoleSubmit} className="p-6 flex flex-col gap-5">
                            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                                <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-amber-800 font-[Outfit]">
                                    El cambio de rol tomará efecto en el próximo inicio de sesión del usuario.
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                    Seleccionar Nuevo Rol
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                                        className="w-full h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors flex items-center justify-between"
                                    >
                                        <span className={data.role ? 'text-[#1A1A1A]' : 'text-[#999999]'}>
                                            {availableRoles.find(r => r.value === data.role)?.label || 'Seleccionar rol'}
                                        </span>
                                        <ChevronLeft className={`w-4 h-4 text-[#999999] transition-transform ${roleDropdownOpen ? 'rotate-90' : '-rotate-90'}`} />
                                    </button>

                                    {roleDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#E5E5E5] shadow-lg z-10 max-h-64 overflow-y-auto">
                                            {availableRoles.map((role) => {
                                                const isDisabled = !canAssignAdminRoles && (role.value === 'admin' || role.value === 'super_admin');
                                                return (
                                                    <button
                                                        key={role.value}
                                                        type="button"
                                                        onClick={() => {
                                                            if (!isDisabled) {
                                                                setData('role', role.value);
                                                                setRoleDropdownOpen(false);
                                                            }
                                                        }}
                                                        disabled={isDisabled}
                                                        className={`w-full px-4 py-3 text-left transition-colors ${
                                                            isDisabled
                                                                ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                                                : 'hover:bg-[#F5F3F0]'
                                                        }`}
                                                    >
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                                                {role.label}
                                                                {isDisabled && (
                                                                    <span className="ml-2 text-xs text-[#999999]">
                                                                        (Requiere Super Admin)
                                                                    </span>
                                                                )}
                                                            </span>
                                                            <span className="text-xs text-[#666666] font-[Outfit]">
                                                                {role.description}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                {errors.role && (
                                    <span className="text-xs text-red-500 font-[Outfit]">{errors.role}</span>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRoleModal(false)}
                                    className="px-5 py-2.5 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#1A1A1A] font-[Outfit] hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || data.role === user.role}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#4A5D4A] rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors disabled:opacity-50"
                                >
                                    {processing ? (
                                        <span>Actualizando...</span>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>Confirmar Cambio</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
