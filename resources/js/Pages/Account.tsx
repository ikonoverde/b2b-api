import { router, usePage } from '@inertiajs/react';
import {
    Building2,
    ChevronRight,
    CreditCard,
    Headphones,
    LogOut,
    MapPin,
    Package,
    Percent,
    Users,
} from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import type { PageProps, CustomerProfile } from '@/types';

interface AccountProps {
    profile: CustomerProfile;
}

export default function Account({ profile }: AccountProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user!;

    function logout() {
        router.post('/logout');
    }

    const menuItems = [
        { icon: CreditCard, label: 'Datos de Facturación' },
        { icon: MapPin, label: 'Direcciones de Envío' },
        { icon: Users, label: 'Usuarios Autorizados' },
        { icon: Headphones, label: 'Soporte Comercial' },
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
                            <button
                                key={item.label}
                                className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 border border-[#E5E5E5] hover:bg-gray-50 transition-colors"
                            >
                                <item.icon className="h-5 w-5 text-[#5E7052]" />
                                <span className="flex-1 text-left text-sm font-medium text-[#1A1A1A] font-[Outfit]">{item.label}</span>
                                <ChevronRight className="h-4 w-4 text-[#999999]" />
                            </button>
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
            </div>
        </CustomerLayout>
    );
}
