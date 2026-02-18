import { Head, Link } from '@inertiajs/react';
import { Percent, Truck, Headphones, UserPlus, LayoutGrid, Lock, type LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { PageProps } from '@/types';

type LucideIcon = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;

interface FeaturedProduct {
    id: number;
    name: string;
    category: string;
    image_url: string | null;
}

interface HomeProps extends PageProps {
    featuredProducts: FeaturedProduct[];
}

export default function Home({ auth, featuredProducts }: HomeProps) {
    return (
        <>
            <Head title="Inicio" />
            <div className="min-h-screen bg-[#FAF6F1]">
                {/* Header */}
                <header className="bg-[#5E7052] px-8 py-4">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-white font-[Outfit] font-bold text-xl tracking-wider">
                                IKONO VERDE
                            </span>
                            <span className="text-[#A8B5A0] font-[Outfit] text-xs tracking-widest uppercase">
                                PROFESIONAL
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 bg-white text-[#5E7052] px-5 py-2 rounded-lg font-[Outfit] font-semibold text-sm hover:bg-white/90 transition-colors"
                                >
                                    Mi Panel
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/admin/login"
                                        className="border border-white text-white px-5 py-2 rounded-lg font-[Outfit] font-medium text-sm hover:bg-white/10 transition-colors"
                                    >
                                        Ingresar
                                    </Link>
                                    <Link
                                        href="/admin/login"
                                        className="bg-white text-[#5E7052] px-5 py-2 rounded-lg font-[Outfit] font-semibold text-sm hover:bg-white/90 transition-colors"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero */}
                <section className="py-20 px-8 text-center">
                    <div className="max-w-3xl mx-auto flex flex-col gap-6">
                        <h1 className="font-[Outfit] font-bold text-5xl leading-tight">
                            <span className="text-[#5E7052]">Productos Mayoristas</span>
                            <br />
                            <span className="text-[#8B6F47]">para tu Negocio</span>
                        </h1>
                        <p className="text-[#666666] font-[Outfit] text-lg max-w-xl mx-auto">
                            Accede a precios exclusivos, pedidos recurrentes y soporte dedicado para
                            profesionales.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex items-center justify-center gap-4 pt-2">
                            <Link
                                href="/admin/login"
                                className="flex items-center gap-2 bg-[#5E7052] text-white px-8 py-3.5 rounded-xl font-[Outfit] font-semibold text-base hover:bg-[#4d5e43] transition-colors"
                            >
                                <UserPlus className="w-5 h-5" />
                                Crear Cuenta
                            </Link>
                            <Link
                                href="/admin/login"
                                className="flex items-center gap-2 border-2 border-[#5E7052] text-[#5E7052] px-8 py-3.5 rounded-xl font-[Outfit] font-semibold text-base hover:bg-[#5E7052]/10 transition-colors"
                            >
                                <LayoutGrid className="w-5 h-5" />
                                Ver Catálogo
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="px-8 pb-16">
                    <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
                        <BenefitCard
                            icon={Percent}
                            title="Precios"
                            subtitle="Mayoristas"
                            iconBg="#D4E5D0"
                            iconColor="#5E7052"
                        />
                        <BenefitCard
                            icon={Truck}
                            title="Envío"
                            subtitle="Gratis +$500k"
                            iconBg="#E8DDD4"
                            iconColor="#8B6F47"
                        />
                        <BenefitCard
                            icon={Headphones}
                            title="Soporte"
                            subtitle="Dedicado"
                            iconBg="#D4E5D0"
                            iconColor="#5E7052"
                        />
                    </div>
                </section>

                {/* Featured Products */}
                {featuredProducts.length > 0 && (
                    <section className="px-8 pb-20">
                        <div className="max-w-6xl mx-auto flex flex-col gap-6">
                            <h2 className="font-[Outfit] font-semibold text-xl text-[#1A1A1A]">
                                Productos Destacados
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {featuredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="border-t border-[#E5E5E5] py-8 px-8">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <span className="text-[#999999] font-[Outfit] text-sm">
                            © {new Date().getFullYear()} Ikono Verde. Todos los derechos reservados.
                        </span>
                        <Link
                            href="/admin/login"
                            className="text-[#5E7052] font-[Outfit] text-sm font-medium hover:underline"
                        >
                            Acceso Profesional
                        </Link>
                    </div>
                </footer>
            </div>
        </>
    );
}

function BenefitCard({
    icon: Icon,
    title,
    subtitle,
    iconBg,
    iconColor,
}: {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    iconBg: string;
    iconColor: string;
}) {
    return (
        <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 border border-[#E5E5E5]">
            <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: iconBg }}
            >
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
            </div>
            <div className="flex flex-col items-center gap-0.5">
                <span className="font-[Outfit] font-semibold text-[#1A1A1A] text-sm">{title}</span>
                <span className="font-[Outfit] text-[#666666] text-xs">{subtitle}</span>
            </div>
        </div>
    );
}

function ProductCard({ product }: { product: FeaturedProduct }) {
    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden flex flex-col">
            {/* Image */}
            <div className="h-40 bg-[#F5F3F0] relative">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-[#E8E8E8] rounded-full" />
                    </div>
                )}
                {/* Category badge */}
                <span className="absolute top-2 left-2 bg-white/90 text-[#666666] font-[Outfit] text-xs font-medium px-2 py-1 rounded-full">
                    {product.category}
                </span>
            </div>

            {/* Details */}
            <div className="p-4 flex flex-col gap-2">
                <span className="font-[Outfit] font-semibold text-[#1A1A1A] text-sm leading-snug line-clamp-2">
                    {product.name}
                </span>

                {/* Locked price */}
                <div className="flex items-center gap-1.5 text-[#999999]">
                    <Lock className="w-3.5 h-3.5" />
                    <span className="font-[Outfit] text-xs">Inicia sesión para ver el precio</span>
                </div>
            </div>
        </div>
    );
}
