import { Deferred, Link, usePage } from '@inertiajs/react';
import BannerCard, { type BannerData } from '@/Components/BannerCard';
import CustomerShell from '@/Layouts/CustomerShell';
import { formatCurrency } from '@/utils/currency';
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

export default function CustomerDashboard({
    featuredProducts,
    profile,
    banners,
}: CustomerDashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const userName = auth.user?.name ?? 'Bienvenido';
    const isReturning = profile.orders_count > 0;

    return (
        <CustomerShell title="Resumen">
            <header className="flex flex-col gap-3">
                <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase">
                    Cuenta · Resumen
                </span>
                <h1 className="font-display text-[clamp(2.25rem,4.5vw,3rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                    Hola, {userName}.
                </h1>
                <p className="max-w-[58ch] text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75">
                    {isReturning
                        ? 'Tu cuenta de mayorista está lista. Vuelve a pedir tus formatos habituales o explora el catálogo completo.'
                        : 'Tu cuenta está activa. Empieza por explorar el catálogo o realizar tu primer pedido.'}
                </p>
            </header>

            <ReorderBlock isReturning={isReturning} />

            <StatStrip profile={profile} />

            <Deferred data="banners" fallback={<BannersSkeleton />}>
                <BannersBlock banners={banners} />
            </Deferred>

            <FeaturedProducts products={featuredProducts} />
        </CustomerShell>
    );
}

function ReorderBlock({ isReturning }: { isReturning: boolean }) {
    return (
        <section
            aria-labelledby="reorder-heading"
            className="mt-14 grid grid-cols-1 gap-8 border-y border-[var(--iko-stone-hairline)] py-10 md:grid-cols-[2fr_1fr] md:items-center md:gap-12"
        >
            <div className="flex flex-col gap-3">
                <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                    {isReturning ? 'Pedido recurrente' : 'Empezar'}
                </span>
                <h2
                    id="reorder-heading"
                    className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] tracking-[-0.01em] text-[var(--iko-stone-ink)]"
                >
                    {isReturning
                        ? 'Reordena tus formatos habituales en un paso.'
                        : 'Tu primer pedido te toma menos de un minuto.'}
                </h2>
            </div>
            <div className="flex flex-col items-start gap-4 md:items-end">
                <Link
                    href="/catalog"
                    className="inline-flex h-12 items-center bg-[var(--iko-accent)] px-7 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                >
                    {isReturning ? 'Hacer un pedido' : 'Explorar catálogo'}
                </Link>
                {isReturning && (
                    <Link
                        href="/account/orders"
                        className="inline-flex items-baseline gap-2 text-[13px] text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:underline"
                    >
                        Ver pedidos anteriores
                        <span aria-hidden="true">→</span>
                    </Link>
                )}
            </div>
        </section>
    );
}

const STAT_LABELS = {
    orders: 'Pedidos realizados',
    spent: 'Total comprado',
    discount: 'Descuento mayorista',
} as const;

function StatStrip({ profile }: { profile: Profile }) {
    return (
        <section
            aria-label="Resumen de cuenta"
            className="mt-12 grid grid-cols-1 border-b border-[var(--iko-stone-hairline)] sm:grid-cols-3 sm:divide-x sm:divide-[var(--iko-stone-hairline)] sm:border-y"
        >
            <StatItem
                label={STAT_LABELS.orders}
                value={String(profile.orders_count).padStart(2, '0')}
                hint={profile.orders_count === 1 ? 'pedido' : 'pedidos'}
            />
            <StatItem
                label={STAT_LABELS.spent}
                value={formatCurrency(profile.total_spent)}
            />
            <StatItem
                label={STAT_LABELS.discount}
                value={`${profile.discount_percentage}%`}
                hint={profile.discount_percentage === 0 ? 'sin descuentos activos' : 'aplicado al total'}
            />
        </section>
    );
}

function StatItem({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <div className="flex flex-col gap-2 border-b border-[var(--iko-stone-hairline)] py-7 sm:border-b-0 sm:px-8 sm:first:pl-0 sm:last:pr-0">
            <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                {label}
            </span>
            <span className="font-spec text-[1.75rem] tabular-nums text-[var(--iko-stone-ink)]">
                {value}
            </span>
            {hint && (
                <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                    {hint}
                </span>
            )}
        </div>
    );
}

function BannersBlock({ banners }: { banners?: BannerData[] }) {
    if (!banners || banners.length === 0) {
        return null;
    }

    return (
        <section aria-labelledby="banners-heading" className="mt-20">
            <SectionHeader index="01" eyebrow="Avisos" title="Novedades" headingId="banners-heading" />
            <div
                className={`mt-8 grid gap-px bg-[var(--iko-stone-hairline)] ${
                    banners.length > 1 ? 'sm:grid-cols-2' : ''
                }`}
            >
                {banners.map((banner) => (
                    <BannerCard key={banner.id} banner={banner} className="h-full" />
                ))}
            </div>
        </section>
    );
}

function BannersSkeleton() {
    return (
        <section className="mt-20">
            <div className="border-b border-[var(--iko-stone-hairline)] pb-4">
                <div className="h-6 w-48 animate-pulse bg-[var(--iko-stone-mid)]/40" />
            </div>
            <div className="mt-8 grid gap-px bg-[var(--iko-stone-hairline)] sm:grid-cols-2">
                {[0, 1].map((i) => (
                    <div
                        key={i}
                        className="h-44 animate-pulse bg-[var(--iko-stone-paper)]"
                    />
                ))}
            </div>
        </section>
    );
}

function FeaturedProducts({ products }: { products: DashboardProduct[] }) {
    if (products.length === 0) {
        return null;
    }

    return (
        <section aria-labelledby="featured-heading" className="mt-20">
            <SectionHeader
                index="02"
                eyebrow="Catálogo"
                title="Productos destacados"
                headingId="featured-heading"
                action={{ href: '/catalog', label: 'Ver todo' }}
            />

            <ol className="mt-10 border-t border-[var(--iko-stone-hairline)]">
                {products.map((product, idx) => (
                    <li key={product.id}>
                        <Link
                            href={`/products/${product.slug}`}
                            className="group grid grid-cols-[3rem_4rem_1fr_auto] items-center gap-4 border-b border-[var(--iko-stone-hairline)] py-5 transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset sm:grid-cols-[3rem_5rem_1fr_auto] sm:gap-6"
                        >
                            <span className="font-spec text-[11px] tabular-nums text-[var(--iko-accent)]">
                                {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="h-14 w-14 shrink-0 overflow-hidden bg-[var(--iko-stone-mid)]/40 sm:h-16 sm:w-16">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt=""
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : null}
                            </span>
                            <span className="flex min-w-0 flex-col gap-1">
                                <span className="font-display text-[1.125rem] leading-tight text-[var(--iko-stone-ink)] truncate">
                                    {product.name}
                                </span>
                                {product.category && (
                                    <span className="font-spec text-[11px] tracking-[0.06em] text-[var(--iko-stone-whisper)] uppercase">
                                        {product.category}
                                    </span>
                                )}
                            </span>
                            <span className="font-spec text-[13px] tabular-nums text-[var(--iko-stone-whisper)] group-hover:text-[var(--iko-accent)]">
                                {formatCurrency(product.price)}
                            </span>
                        </Link>
                    </li>
                ))}
            </ol>
        </section>
    );
}

function SectionHeader({
    index,
    eyebrow,
    title,
    headingId,
    action,
}: {
    index: string;
    eyebrow: string;
    title: string;
    headingId?: string;
    action?: { href: string; label: string };
}) {
    return (
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-[var(--iko-stone-hairline)] pb-4">
            <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-accent)]">
                {index}
            </span>
            <h2
                id={headingId}
                className="font-display text-[1.875rem] leading-tight text-[var(--iko-stone-ink)]"
            >
                {title}
            </h2>
            <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent)] uppercase">
                {eyebrow}
            </span>
            {action && (
                <Link
                    href={action.href}
                    className="ml-auto inline-flex items-baseline gap-2 text-[13px] text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)]"
                >
                    {action.label}
                    <span aria-hidden="true">→</span>
                </Link>
            )}
        </div>
    );
}

