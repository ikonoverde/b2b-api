import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Leaf, Menu, ShoppingCart, User, X, LogOut } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { PageProps } from '@/types';
import MiniCart from '@/Components/MiniCart';

interface CustomerLayoutProps {
    children: ReactNode;
    title: string;
}

export default function CustomerLayout({ children, title }: CustomerLayoutProps) {
    const { auth, miniCart } = usePage<PageProps>().props;
    const cartItemCount = miniCart?.totalCount ?? 0;
    const user = auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { post, processing } = useForm({});

    const handleLogout = () => post('/logout');

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-[#FAF6F1] flex flex-col">
                {/* Header */}
                <header className="bg-[#5E7052] px-6 lg:px-8 py-3 sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <Leaf className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-[Outfit] font-bold text-sm tracking-wider leading-none">
                                    IKONO VERDE
                                </span>
                                <span className="text-[#A8B5A0] font-[Outfit] text-[9px] tracking-widest uppercase leading-none">
                                    PROFESIONAL
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/catalog"
                                className="text-white/80 hover:text-white font-[Outfit] text-sm font-medium transition-colors"
                            >
                                Catálogo
                            </Link>
                            {user && (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-white/80 hover:text-white font-[Outfit] text-sm font-medium transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/account/orders"
                                        className="text-white/80 hover:text-white font-[Outfit] text-sm font-medium transition-colors"
                                    >
                                        Pedidos
                                    </Link>
                                </>
                            )}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            {user ? (
                                <>
                                    {/* Cart - Desktop: mini cart dropdown, Mobile: link to /cart */}
                                    <div className="hidden md:block">
                                        <MiniCart
                                            miniCart={miniCart ?? { items: [], subtotal: 0, totalCount: 0 }}
                                        />
                                    </div>
                                    <Link
                                        href="/cart"
                                        className="md:hidden relative p-2 text-white/80 hover:text-white transition-colors"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        {cartItemCount > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#D4A853] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                                                {cartItemCount}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Account */}
                                    <Link
                                        href="/account"
                                        className="hidden md:flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-medium text-white font-[Outfit]">
                                                {user.initials}
                                            </span>
                                        </div>
                                    </Link>

                                    {/* Logout (desktop) */}
                                    <button
                                        onClick={handleLogout}
                                        disabled={processing}
                                        className="hidden md:flex p-2 text-white/60 hover:text-white transition-colors"
                                        title="Cerrar sesión"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-white/80 hover:text-white font-[Outfit] text-sm font-medium transition-colors"
                                    >
                                        Ingresar
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-white text-[#5E7052] px-4 py-1.5 rounded-lg font-[Outfit] font-semibold text-sm hover:bg-white/90 transition-colors"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-white/10 mt-3 pt-3 pb-2">
                            <nav className="flex flex-col gap-1">
                                <Link
                                    href="/catalog"
                                    className="text-white/80 hover:text-white font-[Outfit] text-sm font-medium py-2 px-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    Catálogo
                                </Link>
                                {user && (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            className="text-white/80 hover:text-white font-[Outfit] text-sm font-medium py-2 px-2 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/account/orders"
                                            className="text-white/80 hover:text-white font-[Outfit] text-sm font-medium py-2 px-2 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            Pedidos
                                        </Link>
                                        <Link
                                            href="/account"
                                            className="text-white/80 hover:text-white font-[Outfit] text-sm font-medium py-2 px-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                                        >
                                            <User className="w-4 h-4" />
                                            Mi Cuenta
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            disabled={processing}
                                            className="text-white/60 hover:text-white font-[Outfit] text-sm font-medium py-2 px-2 rounded-lg hover:bg-white/10 transition-colors text-left flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Cerrar Sesión
                                        </button>
                                    </>
                                )}
                            </nav>
                        </div>
                    )}
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-[#E5E5E5] py-6 px-6 lg:px-8 mt-auto">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <span className="text-[#999999] font-[Outfit] text-sm">
                            &copy; {new Date().getFullYear()} Ikono Verde. Todos los derechos reservados.
                        </span>
                        <Link
                            href="/catalog"
                            className="text-[#5E7052] font-[Outfit] text-sm font-medium hover:underline"
                        >
                            Ver Catálogo
                        </Link>
                    </div>
                </footer>
            </div>
        </>
    );
}
