import { Deferred, Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ClipboardList, CreditCard, Package, Percent, ShoppingCart } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import BannerCard from '@/Components/BannerCard';
import type { BannerData } from '@/Components/BannerCard';
import CustomerLayout from '@/Layouts/CustomerLayout';
import type { PageProps } from '@/types';

interface DashboardProduct {
    id: number;
    slug: string;
    name: string;
    category: string;
    price: number;
    image: string | null;
}

interface Profile {
    orders_count: number;
    total_spent: number;
    discount_percentage: number;
}

interface CustomerDashboardProps {
    featuredProducts: DashboardProduct[];
    profile: Profile;
    banners: BannerData[];
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export default function CustomerDashboard({ featuredProducts, profile, banners }: CustomerDashboardProps) {
    const { auth } = usePage<PageProps>().props;

    return (
        <CustomerLayout title="Dashboard">
            <div className="px-6 py-8">
                {/* Welcome */}
                <div className="mb-6">
                    <span className="text-sm font-medium text-[#999999] font-[Outfit]">Bienvenido de vuelta</span>
                    <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit]">{auth.user?.name}</h1>
                </div>

                {/* Banners Carousel */}
                <Deferred data="banners" fallback={<BannerCarouselSkeleton />}>
                    <BannerCarouselSection banners={banners} />
                </Deferred>

                {/* Stats */}
                <div className="flex gap-4 mb-8">
                    <div className="flex flex-1 items-center gap-4 rounded-2xl bg-white p-5 border border-[#E5E5E5]">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4E5D0]">
                            <Package className="h-6 w-6 text-[#5E7052]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-[#5E7052] font-[Outfit]">{profile.orders_count}</span>
                            <span className="text-xs font-medium text-[#999999] font-[Outfit]">Pedidos</span>
                        </div>
                    </div>
                    <div className="flex flex-1 items-center gap-4 rounded-2xl bg-white p-5 border border-[#E5E5E5]">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8DDD4]">
                            <CreditCard className="h-6 w-6 text-[#8B6F47]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-[#8B6F47] font-[Outfit]">{formatCurrency(profile.total_spent)}</span>
                            <span className="text-xs font-medium text-[#999999] font-[Outfit]">Compras</span>
                        </div>
                    </div>
                    <div className="flex flex-1 items-center gap-4 rounded-2xl bg-white p-5 border border-[#E5E5E5]">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4E5D0]">
                            <Percent className="h-6 w-6 text-[#5E7052]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-[#5E7052] font-[Outfit]">{profile.discount_percentage}%</span>
                            <span className="text-xs font-medium text-[#999999] font-[Outfit]">Descuento</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-[#1A1A1A] font-[Outfit] mb-3">Acciones Rápidas</h2>
                    <div className="flex gap-4">
                        <Link
                            href="/catalog"
                            className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-[#5E7052] p-5 hover:bg-[#4d5e43] transition-colors"
                        >
                            <ShoppingCart className="h-7 w-7 text-white" />
                            <span className="text-sm font-semibold text-white font-[Outfit]">Nuevo Pedido</span>
                        </Link>
                        <Link
                            href="/orders"
                            className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-white p-5 border border-[#E5E5E5] hover:bg-gray-50 transition-colors"
                        >
                            <ClipboardList className="h-7 w-7 text-[#5E7052]" />
                            <span className="text-sm font-semibold text-[#5E7052] font-[Outfit]">Mis Pedidos</span>
                        </Link>
                    </div>
                </div>

                {/* Featured Products */}
                {featuredProducts.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-[#1A1A1A] font-[Outfit]">Productos Destacados</h2>
                            <Link
                                href="/catalog"
                                className="text-sm font-semibold text-[#8B6F47] hover:underline font-[Outfit]"
                            >
                                Ver todo
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {featuredProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                                >
                                    <div className="h-32 lg:h-40 bg-[#F5F3F0]">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-10 h-10 bg-[#E8E8E8] rounded-full" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 flex flex-col gap-1">
                                        <span className="font-[Outfit] font-semibold text-[#1A1A1A] text-sm leading-snug line-clamp-2">
                                            {product.name}
                                        </span>
                                        <span className="font-[Outfit] font-bold text-[#8B6F47] text-sm">
                                            {formatCurrency(product.price)}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}

function BannerCarouselSection({ banners }: { banners?: BannerData[] }) {
    if (!banners || banners.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <BannerCarousel banners={banners} />
        </div>
    );
}

function BannerCarouselSkeleton() {
    return (
        <div className="mb-8">
            <div className="h-44 md:h-52 rounded-2xl bg-[#F5F3F0] animate-pulse" />
        </div>
    );
}

const AUTOPLAY_INTERVAL = 5000;

function BannerCarousel({ banners }: { banners: BannerData[] }) {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, AUTOPLAY_INTERVAL);
    }, [banners.length]);

    useEffect(() => {
        if (banners.length <= 1) {
            return;
        }
        resetTimer();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [banners.length, resetTimer]);

    const goTo = (index: number): void => {
        setCurrent(index);
        resetTimer();
    };

    const goNext = (): void => goTo((current + 1) % banners.length);
    const goPrev = (): void => goTo((current - 1 + banners.length) % banners.length);

    const banner = banners[current];

    return (
        <div className="relative group">
            <BannerCard banner={banner} className="h-44 md:h-52" />

            {banners.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={goPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft className="w-4 h-4 text-[#1A1A1A]" />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight className="w-4 h-4 text-[#1A1A1A]" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {banners.map((b, i) => (
                            <button
                                key={b.id}
                                type="button"
                                onClick={() => goTo(i)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    i === current ? 'bg-white' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
