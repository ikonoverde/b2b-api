import { Link, router, usePage } from '@inertiajs/react';
import {
    Building2,
    ChevronRight,
    CreditCard,
    Eye,
    EyeOff,
    Headphones,
    KeyRound,
    LogOut,
    MapPin,
    Package,
    Percent,
    Users,
    X,
} from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import type { PageProps, CustomerProfile } from '@/types';
import { useState } from 'react';

interface AccountProps {
    profile: CustomerProfile;
}

interface PasswordFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export default function Account({ profile }: AccountProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user!;
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState<PasswordFormData>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof PasswordFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    function logout() {
        router.post('/logout');
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof PasswordFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
        // Clear success message when user starts typing
        if (successMessage) {
            setSuccessMessage('');
        }
    }

    async function handleSubmitPasswordChange(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const response = await fetch('/api/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || 'Contraseña cambiada exitosamente.');
                setFormData({
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
                setTimeout(() => {
                    setShowPasswordModal(false);
                    setSuccessMessage('');
                }, 2000);
            } else if (response.status === 422) {
                setErrors(data.errors || {});
            } else {
                setErrors({ current_password: data.message || 'Error al cambiar la contraseña.' });
            }
        } catch {
            setErrors({ current_password: 'Error de conexión. Por favor intente nuevamente.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    function closeModal() {
        setShowPasswordModal(false);
        setErrors({});
        setSuccessMessage('');
        setFormData({
            current_password: '',
            password: '',
            password_confirmation: '',
        });
    }

    const menuItems = [
        { icon: CreditCard, label: 'Datos de Facturación' },
        { icon: MapPin, label: 'Direcciones de Envío' },
        { icon: Users, label: 'Usuarios Autorizados' },
        { icon: Headphones, label: 'Soporte Comercial' },
        { icon: CreditCard, label: 'Métodos de Pago', href: '/account/payment-methods' },
        { icon: KeyRound, label: 'Cambiar Contraseña', onClick: () => setShowPasswordModal(true) },
    ];

    return (
        <CustomerLayout title="Mi Cuenta">
            <div className="px-6 py-8 max-w-2xl mx-auto">
                {/* Profile Header */}
                <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#5E7052]">
                        <span className="text-2xl font-bold text-white font-[Outfit]">{user.initials}</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        <span className="text-lg font-bold text-[#1A1A1A] font-[Outfit]">{user.name}</span>
                        <span className="text-sm text-[#999999] font-[Outfit]">{user.email}</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-3 mb-8">
                    <div className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl bg-white p-4 border border-[#E5E5E5]">
                        <Package className="h-5 w-5 text-[#5E7052]" />
                        <span className="text-xl font-bold text-[#5E7052] font-[Outfit]">{profile.orders_count}</span>
                        <span className="text-xs font-medium text-[#999999] font-[Outfit]">Pedidos</span>
                    </div>
                    <div className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl bg-white p-4 border border-[#E5E5E5]">
                        <Building2 className="h-5 w-5 text-[#8B6F47]" />
                        <span className="text-xl font-bold text-[#8B6F47] font-[Outfit]">{profile.total_spent}</span>
                        <span className="text-xs font-medium text-[#999999] font-[Outfit]">Compras</span>
                    </div>
                    <div className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl bg-white p-4 border border-[#E5E5E5]">
                        <Percent className="h-5 w-5 text-[#5E7052]" />
                        <span className="text-xl font-bold text-[#5E7052] font-[Outfit]">{profile.discount_percentage ?? 0}%</span>
                        <span className="text-xs font-medium text-[#999999] font-[Outfit]">Descuento</span>
                    </div>
                </div>

                {/* Menu */}
                <div className="mb-8">
                    <h2 className="mb-3 text-sm font-bold text-[#1A1A1A] font-[Outfit]">Configuración</h2>
                    <div className="flex flex-col gap-2">
                        {menuItems.map((item) => (
                            item.href ? (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 border border-[#E5E5E5] hover:bg-gray-50 transition-colors"
                                >
                                    <item.icon className="h-5 w-5 text-[#5E7052]" />
                                    <span className="flex-1 text-left text-sm font-medium text-[#1A1A1A] font-[Outfit]">{item.label}</span>
                                    <ChevronRight className="h-4 w-4 text-[#999999]" />
                                </Link>
                            ) : (
                                <button
                                    key={item.label}
                                    onClick={item.onClick}
                                    className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 border border-[#E5E5E5] hover:bg-gray-50 transition-colors"
                                >
                                    <item.icon className="h-5 w-5 text-[#5E7052]" />
                                    <span className="flex-1 text-left text-sm font-medium text-[#1A1A1A] font-[Outfit]">{item.label}</span>
                                    <ChevronRight className="h-4 w-4 text-[#999999]" />
                                </button>
                            )
                        ))}
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-3.5 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors font-[Outfit]"
                >
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                </button>

                {/* Password Change Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#1A1A1A] font-[Outfit]">Cambiar Contraseña</h2>
                                <button
                                    onClick={closeModal}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    type="button"
                                >
                                    <X className="h-5 w-5 text-[#999999]" />
                                </button>
                            </div>

                            {successMessage && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                                    <p className="text-sm text-green-700 font-[Outfit]">{successMessage}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 font-[Outfit]">
                                        Contraseña Actual
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            name="current_password"
                                            value={formData.current_password}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-xl border ${errors.current_password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#E5E5E5] focus:border-[#5E7052] focus:ring-[#5E7052]/20'} px-4 py-3 text-sm font-[Outfit] focus:outline-none focus:ring-2 transition-colors`}
                                            placeholder="Ingrese su contraseña actual"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
                                        >
                                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.current_password && (
                                        <p className="mt-1.5 text-xs text-red-600 font-[Outfit]">{errors.current_password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 font-[Outfit]">
                                        Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-xl border ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#E5E5E5] focus:border-[#5E7052] focus:ring-[#5E7052]/20'} px-4 py-3 text-sm font-[Outfit] focus:outline-none focus:ring-2 transition-colors`}
                                            placeholder="Ingrese su nueva contraseña"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
                                        >
                                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1.5 text-xs text-red-600 font-[Outfit]">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 font-[Outfit]">
                                        Confirmar Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="password_confirmation"
                                            value={formData.password_confirmation}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-xl border ${errors.password_confirmation ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#E5E5E5] focus:border-[#5E7052] focus:ring-[#5E7052]/20'} px-4 py-3 text-sm font-[Outfit] focus:outline-none focus:ring-2 transition-colors`}
                                            placeholder="Confirme su nueva contraseña"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className="mt-1.5 text-xs text-red-600 font-[Outfit]">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm font-medium text-[#666666] hover:bg-gray-50 transition-colors font-[Outfit]"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 rounded-xl bg-[#5E7052] px-4 py-3 text-sm font-bold text-white hover:bg-[#4A5A40] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-[Outfit]"
                                    >
                                        {isSubmitting ? 'Guardando...' : 'Cambiar Contraseña'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
