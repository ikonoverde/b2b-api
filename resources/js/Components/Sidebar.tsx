import { Link, useForm, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    ChartBar,
    Users,
    ShoppingCart,
    Package,
    Folder,
    Truck,
    Building2,
    FileText,
    Settings,
    Leaf,
    LogOut,
    Star,
    Image,
    PenLine,
    Newspaper,
    Gift,
    MessageSquareText,
    Megaphone,
    ClipboardList,
    Send,
    Compass,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { PageProps } from '@/types';

interface AdminSidebarProps {
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
    { name: 'Dashboard', href: '/admin', icon: LayoutGrid, id: 'dashboard' },
    { name: 'Analiticas', href: '/admin/analytics', icon: ChartBar, id: 'analytics' },
    { name: 'Usuarios', href: '/admin/users', icon: Users, id: 'users' },
];

const managementNav: NavItem[] = [
    { name: 'Pedidos', href: '/admin/orders', icon: ShoppingCart, id: 'orders' },
    { name: 'Productos', href: '/admin/products', icon: Package, id: 'products' },
    { name: 'Categorías', href: '/admin/categories', icon: Folder, id: 'categories' },
    { name: 'Envios', href: '/admin/shipments', icon: Truck, id: 'shipments' },
    { name: 'Negocios', href: '/admin/businesses', icon: Building2, id: 'businesses' },
    { name: 'Chat', href: '/admin/chat', icon: MessageSquareText, id: 'chat' },
    { name: 'Muestras gratis', href: '/admin/sample-requests', icon: Gift, id: 'sample-requests' },
    { name: 'Propuestas de anuncios', href: '/admin/ad-proposals', icon: Megaphone, id: 'ad-proposals' },
    { name: 'Reportes de marketing', href: '/admin/marketing-reports', icon: ClipboardList, id: 'marketing-reports' },
    { name: 'Plan de crecimiento', href: '/admin/growth-plan', icon: Compass, id: 'growth-plan' },
    { name: 'Publicaciones sociales', href: '/admin/social-posts', icon: Send, id: 'social-posts' },
    { name: 'Facturas', href: '/admin/invoices', icon: FileText, id: 'invoices' },
];

const contentNav: NavItem[] = [
    { name: 'Destacados', href: '/admin/featured-products', icon: Star, id: 'featured-products' },
    { name: 'Banners', href: '/admin/banners', icon: Image, id: 'banners' },
    { name: 'Páginas', href: '/admin/static-pages', icon: PenLine, id: 'static-pages' },
    { name: 'Blog', href: '/admin/blog-posts', icon: Newspaper, id: 'blog-posts' },
];

const systemNav: NavItem[] = [
    { name: 'Configuracion', href: '/admin/settings', icon: Settings, id: 'settings' },
];

const navSections: { label: string; items: NavItem[] }[] = [
    { label: 'Principal', items: mainNav },
    { label: 'Gestion', items: managementNav },
    { label: 'Contenido', items: contentNav },
    { label: 'Sistema', items: systemNav },
];

export default function AdminSidebar({ active }: AdminSidebarProps) {
    const { auth, adminNavigation } = usePage<PageProps>().props;
    const user = auth.user;
    const ordersCount = adminNavigation?.ordersCount ?? 0;
    const { post, processing } = useForm({});

    const handleLogout = () => post('/admin/logout');

    const sections = navSections.map((section) => ({
        ...section,
        items: section.items.map((item) =>
            item.id === 'orders' ? { ...item, badge: ordersCount } : item,
        ),
    }));

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-sidebar-primary">
                        <Leaf className="size-6 text-sidebar-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-sidebar-foreground">
                            Ikonoverde
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            Admin
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {sections.map((section) => (
                    <SidebarGroup key={section.label}>
                        <SidebarGroupLabel className="tracking-wider uppercase">
                            {section.label}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {section.items.map((item) => (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={active === item.id}
                                            className="data-active:[&>svg]:text-sidebar-primary"
                                        >
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        {typeof item.badge === 'number' && (
                                            <SidebarMenuBadge className="rounded-full bg-sidebar-primary px-2 text-sidebar-primary-foreground">
                                                {item.badge}
                                            </SidebarMenuBadge>
                                        )}
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {user && (
                <SidebarFooter className="border-t border-sidebar-border">
                    <div className="flex items-center gap-3 px-2 py-1">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary">
                            <span className="text-sm font-medium text-sidebar-primary-foreground">
                                {user.initials}
                            </span>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="truncate text-sm font-medium text-sidebar-foreground">
                                {user.name}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                                {user.email}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            disabled={processing}
                            className={`rounded-lg p-2 transition-all duration-200 ${
                                processing
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer opacity-60 hover:scale-105 hover:opacity-100'
                            }`}
                            title="Cerrar sesión"
                        >
                            <LogOut className="size-5 text-sidebar-primary" />
                        </button>
                    </div>
                </SidebarFooter>
            )}
        </Sidebar>
    );
}
