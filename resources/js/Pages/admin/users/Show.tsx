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
    Power,
    AlertTriangle,
    Key,
    CheckCircle,
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
    payment_pending: 'Pago Pendiente',
    pending: 'Pagado',
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

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(amount);
};

const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
        pending: 'bg-muted text-muted-foreground',
        processing: 'bg-accent text-accent-foreground',
        shipped: 'bg-accent text-accent-foreground',
        delivered: 'bg-primary/10 text-primary',
        cancelled: 'bg-destructive/10 text-destructive',
    };
    return colors[status] || 'bg-muted text-foreground';
};

const getPaymentStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
        pending: 'bg-muted text-muted-foreground',
        paid: 'bg-primary/10 text-primary',
        failed: 'bg-destructive/10 text-destructive',
        refunded: 'bg-accent text-accent-foreground',
    };
    return colors[status] || 'bg-muted text-foreground';
};

function PasswordResetCard({
    user,
    onOpenPasswordResetModal,
}: {
    user: DetailedUser;
    onOpenPasswordResetModal: () => void;
}) {
    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Restablecer Contraseña
                </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Key className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <span className="text-sm font-medium text-foreground">
                            Enviar Email de Restablecimiento
                        </span>
                        <p className="text-xs text-muted-foreground">
                            El usuario recibirá un email con un enlace para crear una nueva contraseña.
                        </p>
                    </div>
                </div>

                <button
                    onClick={onOpenPasswordResetModal}
                    className="w-full px-4 py-2.5 bg-muted-foreground rounded-lg text-sm font-medium text-white hover:bg-muted-foreground/90 transition-colors"
                >
                    Enviar Email de Restablecimiento
                </button>
            </div>
        </div>
    );
}

function PersonalInfoCard({ user }: { user: DetailedUser }) {
    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Información Personal
                </h2>
            </div>
            <div className="p-6 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-foreground">
                            {user.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.is_active
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-destructive/10 text-destructive'
                            }`}>
                                {user.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground">
                                {roleLabels[user.role] || user.role}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Email</span>
                            <span className="text-sm text-foreground">{user.email}</span>
                        </div>
                    </div>

                    {user.phone && (
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Teléfono</span>
                                <span className="text-sm text-foreground">{user.phone}</span>
                            </div>
                        </div>
                    )}

                    {user.rfc && (
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">RFC</span>
                                <span className="text-sm text-foreground">{user.rfc}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Fecha de Registro</span>
                            <span className="text-sm text-foreground">
                                {formatDate(user.created_at)}
                            </span>
                        </div>
                    </div>

                    {user.email_verified_at && (
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-primary" />
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Email Verificado</span>
                                <span className="text-sm text-foreground">
                                    {formatDate(user.email_verified_at)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function RoleManagementCard({
    user,
    canAssignAdminRoles,
    onOpenRoleModal,
}: {
    user: DetailedUser;
    canAssignAdminRoles: boolean;
    onOpenRoleModal: () => void;
}) {
    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Gestión de Rol
                </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                        <UserCog className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                        <span className="text-sm font-medium text-foreground">
                            Rol Actual
                        </span>
                        <p className="text-xs text-muted-foreground">
                            {roleLabels[user.role] || user.role}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onOpenRoleModal}
                    disabled={!canAssignAdminRoles && (user.role === 'admin' || user.role === 'super_admin')}
                    className="w-full px-4 py-2.5 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cambiar Rol
                </button>

                {!canAssignAdminRoles && (user.role === 'admin' || user.role === 'super_admin') && (
                    <p className="text-xs text-muted-foreground">
                        Solo los Super Admin pueden cambiar roles de administradores.
                    </p>
                )}
            </div>
        </div>
    );
}

function AccountStatusCard({
    user,
    onOpenStatusModal,
}: {
    user: DetailedUser;
    onOpenStatusModal: (newStatus: boolean) => void;
}) {
    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Estado de la Cuenta
                </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        user.is_active ? 'bg-primary/10' : 'bg-destructive/10'
                    }`}>
                        <Power className={`w-5 h-5 ${
                            user.is_active ? 'text-primary' : 'text-destructive'
                        }`} />
                    </div>
                    <div className="flex-1">
                        <span className="text-sm font-medium text-foreground">
                            Cuenta {user.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                        <p className="text-xs text-muted-foreground">
                            {user.is_active
                                ? 'El usuario puede iniciar sesión y acceder al sistema.'
                                : 'El usuario no puede iniciar sesión ni acceder al sistema.'
                            }
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => onOpenStatusModal(!user.is_active)}
                    className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        user.is_active
                            ? 'bg-destructive text-white hover:bg-destructive/90'
                            : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                >
                    {user.is_active ? 'Desactivar Cuenta' : 'Activar Cuenta'}
                </button>
            </div>
        </div>
    );
}

function PaymentMethodCard({ user }: { user: DetailedUser }) {
    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Método de Pago
                </h2>
            </div>
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div className="flex flex-col">
                        <span className="text-sm text-foreground">
                            {paymentMethodLabels[user.pm_type || ''] || user.pm_type || 'Método de Pago'}
                        </span>
                        {user.pm_last_four && (
                            <span className="text-xs text-muted-foreground">
                                •••• {user.pm_last_four}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActivitySummaryGrid({ activity }: { activity: UserActivity }) {
    return (
        <div className="grid grid-cols-4 gap-4">
            <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                        <span className="text-2xl font-semibold text-foreground">
                            {activity.total_orders}
                        </span>
                        <p className="text-xs text-muted-foreground">Pedidos</p>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <span className="text-2xl font-semibold text-foreground">
                            {formatCurrency(activity.total_spent)}
                        </span>
                        <p className="text-xs text-muted-foreground">Total Gastado</p>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                        <span className="text-2xl font-semibold text-foreground">
                            {activity.account_age_days}
                        </span>
                        <p className="text-xs text-muted-foreground">Días como Cliente</p>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                        <span className="text-2xl font-semibold text-foreground">
                            {activity.last_order_date ? formatDate(activity.last_order_date) : 'N/A'}
                        </span>
                        <p className="text-xs text-muted-foreground">Último Pedido</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrdersTable({ orders }: { orders: OrderData }) {
    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Historial de Pedidos
                </h2>
            </div>

            {orders.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Package className="w-12 h-12 text-border mb-3" />
                    <p className="text-sm text-muted-foreground">No hay pedidos registrados</p>
                </div>
            ) : (
                <>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-muted-foreground">Pedido</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-muted-foreground">Estado</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-muted-foreground">Pago</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-muted-foreground">Total</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-muted-foreground">Fecha</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-b border-border hover:bg-muted"
                                >
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="text-sm text-foreground hover:underline font-medium"
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
                                        <span className="text-sm text-foreground font-medium">
                                            {formatCurrency(order.total_amount)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-muted-foreground">
                                            {formatDate(order.created_at)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {orders.last_page > 1 && (
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
                    )}
                </>
            )}
        </div>
    );
}

function RoleOption({
    role,
    canAssignAdminRoles,
    onSelect,
}: {
    role: { value: string; label: string; description: string };
    canAssignAdminRoles: boolean;
    onSelect: (value: string) => void;
}) {
    const isDisabled = !canAssignAdminRoles && (role.value === 'admin' || role.value === 'super_admin');
    return (
        <button
            key={role.value}
            type="button"
            onClick={() => { if (!isDisabled) { onSelect(role.value); } }}
            disabled={isDisabled}
            className={`w-full px-4 py-3 text-left transition-colors ${
                isDisabled
                    ? 'opacity-50 cursor-not-allowed bg-muted'
                    : 'hover:bg-muted'
            }`}
        >
            <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                    {role.label}
                    {isDisabled && (
                        <span className="ml-2 text-xs text-muted-foreground">
                            (Requiere Super Admin)
                        </span>
                    )}
                </span>
                <span className="text-xs text-muted-foreground">
                    {role.description}
                </span>
            </div>
        </button>
    );
}

function RoleChangeModal({
    user,
    data,
    errors,
    processing,
    canAssignAdminRoles,
    roleDropdownOpen,
    onSetData,
    onSetRoleDropdownOpen,
    onClose,
    onSubmit,
}: {
    user: DetailedUser;
    data: { role: string };
    errors: Partial<Record<'role', string>>;
    processing: boolean;
    canAssignAdminRoles: boolean;
    roleDropdownOpen: boolean;
    onSetData: (key: 'role', value: string) => void;
    onSetRoleDropdownOpen: (open: boolean) => void;
    onClose: () => void;
    onSubmit: (e: FormEvent) => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-card rounded-2xl shadow-xl w-full max-w-md max-h-[500px] flex flex-col">
                <div className="px-6 py-5 border-b border-border flex items-center justify-between flex-shrink-0">
                    <h2 className="text-lg font-semibold text-foreground">
                        Cambiar Rol de Usuario
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 flex flex-col gap-5">
                    <div className="flex items-start gap-3 p-4 bg-muted rounded-xl border border-border">
                        <Shield className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">
                            El cambio de rol tomará efecto en el próximo inicio de sesión del usuario.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-foreground">
                            Seleccionar Nuevo Rol
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => onSetRoleDropdownOpen(!roleDropdownOpen)}
                                className="w-full h-11 px-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors flex items-center justify-between"
                            >
                                <span className={data.role ? 'text-foreground' : 'text-muted-foreground'}>
                                    {availableRoles.find(r => r.value === data.role)?.label || 'Seleccionar rol'}
                                </span>
                                <ChevronLeft className={`w-4 h-4 text-muted-foreground transition-transform ${roleDropdownOpen ? 'rotate-90' : '-rotate-90'}`} />
                            </button>

                            {roleDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg border border-border shadow-lg z-10 max-h-64 overflow-y-auto">
                                    {availableRoles.map((role) => (
                                        <RoleOption
                                            key={role.value}
                                            role={role}
                                            canAssignAdminRoles={canAssignAdminRoles}
                                            onSelect={(value) => {
                                                onSetData('role', value);
                                                onSetRoleDropdownOpen(false);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.role && (
                            <span className="text-xs text-destructive">{errors.role}</span>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing || data.role === user.role}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors disabled:opacity-50"
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
    );
}

function StatusChangeModal({
    user,
    pendingStatus,
    statusProcessing,
    onClose,
    onSubmit,
}: {
    user: DetailedUser;
    pendingStatus: boolean;
    statusProcessing: boolean;
    onClose: () => void;
    onSubmit: (e: FormEvent) => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-card rounded-2xl shadow-xl w-full max-w-md">
                <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                        {pendingStatus ? 'Activar Cuenta' : 'Desactivar Cuenta'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 flex flex-col gap-5">
                    <div className={`flex items-start gap-3 p-4 rounded-xl border ${
                        pendingStatus
                            ? 'bg-primary/10 border-primary/20'
                            : 'bg-destructive/10 border-destructive/20'
                    }`}>
                        <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                            pendingStatus ? 'text-primary' : 'text-destructive'
                        }`} />
                        <p className={`text-sm ${
                            pendingStatus ? 'text-primary' : 'text-destructive'
                        }`}>
                            {pendingStatus
                                ? `¿Estás seguro de que deseas activar la cuenta de ${user.name}? El usuario podrá iniciar sesión y acceder al sistema inmediatamente.`
                                : `¿Estás seguro de que deseas desactivar la cuenta de ${user.name}? El usuario no podrá iniciar sesión ni acceder al sistema.`
                            }
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={statusProcessing}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                                pendingStatus
                                    ? 'bg-primary hover:bg-primary/90'
                                    : 'bg-destructive hover:bg-destructive/90'
                            }`}
                        >
                            {statusProcessing ? (
                                <span>Procesando...</span>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    <span>{pendingStatus ? 'Confirmar Activación' : 'Confirmar Desactivación'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function PasswordResetModal({
    user,
    processing,
    onClose,
    onSubmit,
}: {
    user: DetailedUser;
    processing: boolean;
    onClose: () => void;
    onSubmit: (e: FormEvent) => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-card rounded-2xl shadow-xl w-full max-w-md">
                <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                        Enviar Email de Restablecimiento
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 flex flex-col gap-5">
                    <div className="flex items-start gap-3 p-4 bg-muted rounded-xl border border-border">
                        <AlertTriangle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">
                            ¿Estás seguro de que deseas enviar un email de restablecimiento de contraseña a {user.name}? El usuario recibirá un enlace para crear una nueva contraseña.
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-5 py-2.5 bg-muted-foreground rounded-lg text-sm font-medium text-white hover:bg-muted-foreground/90 transition-colors disabled:opacity-50"
                        >
                            {processing ? (
                                <span>Enviando...</span>
                            ) : (
                                <>
                                    <Mail className="w-4 h-4" />
                                    <span>Confirmar Envío</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function UserShow() {
    const { user, orders, activity, auth } = usePage<Props>().props;
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);

    const { data, setData, patch, processing, errors } = useForm({
        role: user.role,
    });

    const { setData: setStatusData, patch: patchStatus, processing: statusProcessing } = useForm({
        is_active: user.is_active,
    });

    const { post: postPasswordReset, processing: passwordResetProcessing } = useForm({});
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);

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

    const openStatusModal = (newStatus: boolean) => {
        setPendingStatus(newStatus);
        setStatusData('is_active', newStatus);
        setShowStatusModal(true);
    };

    const handleStatusSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (pendingStatus !== null) {
            patchStatus(`/admin/users/${user.id}/toggle-active`, {
                onSuccess: () => {
                    setShowStatusModal(false);
                    setPendingStatus(null);
                },
            });
        }
    };

    const handlePasswordResetSubmit = (e: FormEvent) => {
        e.preventDefault();
        postPasswordReset(`/admin/users/${user.id}/send-password-reset`, {
            onSuccess: () => {
                setShowPasswordResetModal(false);
            },
        });
    };

    const openPasswordResetModal = () => {
        setShowPasswordResetModal(true);
    };

    return (
        <AppLayout title="Detalles del Usuario" active="users">
            <div className="flex flex-col gap-6 p-10 pr-12">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm">
                            <Link
                                href="/admin/users"
                                className="text-muted-foreground hover:text-muted-foreground transition-colors"
                            >
                                Usuarios
                            </Link>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-muted-foreground">Detalles del Usuario</span>
                        </div>
                        <h1 className="text-[28px] font-semibold text-foreground">
                            {user.name}
                        </h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-8">
                    {/* Left Column - User Info */}
                    <div className="w-[400px] flex flex-col gap-6">
                        <PersonalInfoCard user={user} />

                        {!isSelf && (
                            <RoleManagementCard
                                user={user}
                                canAssignAdminRoles={canAssignAdminRoles}
                                onOpenRoleModal={openRoleModal}
                            />
                        )}

                        {!isSelf && (
                            <AccountStatusCard
                                user={user}
                                onOpenStatusModal={openStatusModal}
                            />
                        )}

                        {!isSelf && (
                            <PasswordResetCard
                                user={user}
                                onOpenPasswordResetModal={openPasswordResetModal}
                            />
                        )}

                        {(user.pm_type || user.pm_last_four) && (
                            <PaymentMethodCard user={user} />
                        )}
                    </div>

                    {/* Right Column - Orders and Activity */}
                    <div className="flex-1 flex flex-col gap-6">
                        <ActivitySummaryGrid activity={activity} />
                        <OrdersTable orders={orders} />
                    </div>
                </div>
            </div>

            {showRoleModal && (
                <RoleChangeModal
                    user={user}
                    data={data}
                    errors={errors}
                    processing={processing}
                    canAssignAdminRoles={canAssignAdminRoles}
                    roleDropdownOpen={roleDropdownOpen}
                    onSetData={setData}
                    onSetRoleDropdownOpen={setRoleDropdownOpen}
                    onClose={() => setShowRoleModal(false)}
                    onSubmit={handleRoleSubmit}
                />
            )}

            {showStatusModal && pendingStatus !== null && (
                <StatusChangeModal
                    user={user}
                    pendingStatus={pendingStatus}
                    statusProcessing={statusProcessing}
                    onClose={() => setShowStatusModal(false)}
                    onSubmit={handleStatusSubmit}
                />
            )}

            {showPasswordResetModal && (
                <PasswordResetModal
                    user={user}
                    processing={passwordResetProcessing}
                    onClose={() => setShowPasswordResetModal(false)}
                    onSubmit={handlePasswordResetSubmit}
                />
            )}
        </AppLayout>
    );
}
