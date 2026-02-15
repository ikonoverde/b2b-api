import { Link, usePage, useForm } from '@inertiajs/react';
import {
    LayoutGrid,
    ChartBar,
    Users,
    ShoppingCart,
    Package,
    Truck,
    FileText,
    Settings,
    LifeBuoy,
    Plus,
    Leaf,
    LogOut,
} from 'lucide-react';
import type { PageProps } from '@/types';

interface SidebarProps {
    active?: string;
}

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    id: string;
}

const mainNav: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid, id: 'dashboard' },
    { name: 'Analiticas', href: '/admin/analytics', icon: ChartBar, id: 'analytics' },
    { name: 'Usuarios', href: '/admin/users', icon: Users, id: 'users' },
];

const managementNav: NavItem[] = [
    { name: 'Pedidos', href: '/admin/orders', icon: ShoppingCart, id: 'orders', badge: 12 },
    { name: 'Productos', href: '/admin/products', icon: Package, id: 'products' },
    { name: 'Envios', href: '/admin/shipments', icon: Truck, id: 'shipments' },
    { name: 'Facturas', href: '/admin/invoices', icon: FileText, id: 'invoices' },
];

const systemNav: NavItem[] = [
    { name: 'Configuracion', href: '/admin/settings', icon: Settings, id: 'settings' },
    { name: 'Ayuda', href: '/admin/help', icon: LifeBuoy, id: 'help' },
];

export default function Sidebar({ active }: SidebarProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const { post, processing } = useForm({});

    const handleLogout = () => post('/admin/logout');

    return (
        <aside className="w-[280px] min-h-screen bg-[#F5F3F0] flex flex-col py-6">
            {/* Logo Section */}
            <div className="flex items-center gap-3 px-6 pb-4">
                <div className="w-10 h-10 bg-[#4A5D4A] rounded-lg flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                        Ikonoverde
                    </span>
                    <span className="text-[11px] text-[#999999] font-[Outfit]">
                        B2B Platform
                    </span>
                </div>
            </div>

            {/* Principal Section */}
            <div className="flex flex-col gap-1 px-4 mt-4">
                <span className="text-[11px] font-medium text-[#999999] tracking-wider px-4 mb-1 font-[Outfit]">
                    PRINCIPAL
                </span>
                {mainNav.map((item) => (
                    <NavLink
                        key={item.id}
                        item={item}
                        isActive={active === item.id}
                    />
                ))}
            </div>

            {/* Gestion Section */}
            <div className="flex flex-col gap-1 px-4 mt-4">
                <span className="text-[11px] font-medium text-[#999999] tracking-wider px-4 mb-1 font-[Outfit]">
                    GESTION
                </span>
                {managementNav.map((item) => (
                    <NavLink
                        key={item.id}
                        item={item}
                        isActive={active === item.id}
                    />
                ))}
            </div>

            {/* Sistema Section */}
            <div className="flex flex-col gap-1 px-4 mt-4">
                <span className="text-[11px] font-medium text-[#999999] tracking-wider px-4 mb-1 font-[Outfit]">
                    SISTEMA
                </span>
                {systemNav.map((item) => (
                    <NavLink
                        key={item.id}
                        item={item}
                        isActive={active === item.id}
                    />
                ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* CTA Button */}
            <div className="px-4 mb-4">
                <Link
                    href="/admin/products/create"
                    className="flex items-center justify-center gap-3 w-full h-12 bg-[#D4A853] rounded-lg text-white font-medium text-sm font-[Outfit] hover:bg-[#c49a4a] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Producto
                </Link>
            </div>

            {/* User Section */}
            {user && (
                <div className="flex items-center gap-3 px-6 pt-4 border-t border-[#E5E5E5]">
                    <div className="w-10 h-10 bg-[#4A5D4A] rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white font-[Outfit]">
                            {user.initials}
                        </span>
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1">
                        <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                            {user.name}
                        </span>
                        <span className="text-xs text-[#999999] font-[Outfit]">
                            {user.email}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={processing}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                            processing
                                ? 'opacity-50 cursor-not-allowed'
                                : 'opacity-60 hover:opacity-100 hover:scale-105 cursor-pointer'
                        }`}
                        title="Cerrar sesión"
                    >
                        <LogOut className="w-5 h-5 text-[#4A5D4A]" />
                    </button>
                </div>
            )}
        </aside>
    );
}

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors font-[Outfit] ${
                isActive
                    ? 'bg-white text-[#1A1A1A]'
                    : 'text-[#666666] hover:bg-white/50'
            }`}
        >
            <div className="flex items-center gap-3">
                <Icon
                    className={`w-5 h-5 ${
                        isActive ? 'text-[#4A5D4A]' : 'text-[#666666]'
                    }`}
                />
                <span
                    className={`text-sm ${
                        isActive ? 'font-medium' : 'font-normal'
                    }`}
                >
                    {item.name}
                </span>
            </div>
            {item.badge && (
                <span className="w-7 h-[22px] bg-[#4A5D4A] rounded-full flex items-center justify-center text-white text-[11px] font-medium">
                    {item.badge}
                </span>
            )}
        </Link>
    );
}
