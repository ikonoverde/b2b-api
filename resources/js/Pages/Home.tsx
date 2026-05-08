import { Link } from '@inertiajs/react';
import type { BannerData } from '@/Components/BannerCard';
import PublicShell from '@/Layouts/PublicShell';
import type { PageProps } from '@/types';
import { formatCurrency } from '@/utils/currency';

/**
 * Public home for Ikonoverde.
 *
 * Renders for both anonymous and authenticated visitors. Chrome (header,
 * footer, stone-paper surface, fonts) is owned by PublicShell, which adapts
 * the nav for the current auth state.
 */

interface FeaturedProduct {
    id: number;
    slug: string;
    name: string;
    category: string | null;
    image_url: string | null;
    price: number;
}

export interface HomeProps extends PageProps {
    featuredProducts: FeaturedProduct[];
    banners: BannerData[];
}

export default function Home({ featuredProducts, banners }: HomeProps) {
    return (
        <PublicShell title="Ikonoverde — Cuidado corporal profesional">
            <Hero />
            <ValuePropStrip />
            <FeaturedList products={featuredProducts} />
            <BannersBlock banners={banners} />
            <SecondaryHandoff />
        </PublicShell>
    );
}

/* ─────────────────────────────────────────────────────────
 * Hero — typographic only, no imagery.
 * Accent underline lands on "merecen" — the confidence beat.
 * ───────────────────────────────────────────────────────── */

function Hero() {
    return (
        <section className="pt-20 pb-24 sm:pt-28 sm:pb-32">
            <p className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                Ikonoverde · Aceite de masaje profesional
            </p>

            <h1 className="mt-6 max-w-[22ch] font-display text-[clamp(2.5rem,6vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                El aceite de masaje que tus manos{' '}
                <span className="relative whitespace-nowrap">
                    merecen
                    <span
                        aria-hidden="true"
                        className="absolute right-0 bottom-[0.08em] left-0 h-[0.08em] bg-[var(--iko-accent)]"
                    />
                </span>
                .
            </h1>

            <p className="mt-8 max-w-[52ch] text-[17px] leading-[1.55] text-[var(--iko-stone-ink)]/80">
                Formulado para spas, hoteles y uso personal. Una unidad o veinte, al mismo precio.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                    href="/catalog"
                    className="inline-flex items-center bg-[var(--iko-accent)] px-7 py-3.5 text-[14px] font-medium text-[var(--iko-accent-on)] tracking-[0.01em] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors"
                >
                    Ver el catálogo
                </Link>
                <Link
                    href="/register"
                    className="group inline-flex items-baseline gap-2 text-[14px] font-medium text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] focus-visible:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] rounded-sm transition-colors"
                >
                    Crear cuenta
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                        →
                    </span>
                </Link>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────────
 * Value-prop strip — mono labels + serif values, hairline-separated.
 * Each entry maps to a "no artificial gates" principle from PRODUCT.md.
 * ───────────────────────────────────────────────────────── */

const VALUE_PROPS = [
    { label: 'Pedido mínimo', value: '1 unidad' },
    { label: 'Precio', value: 'Igual para todos' },
    { label: 'Cuenta', value: 'Opcional' },
] as const;

function ValuePropStrip() {
    return (
        <section
            aria-label="Términos comerciales"
            className="grid grid-cols-1 border-y border-[var(--iko-stone-hairline)] py-10 sm:grid-cols-3 sm:divide-x sm:divide-[var(--iko-stone-hairline)]"
        >
            {VALUE_PROPS.map((item) => (
                <div key={item.label} className="flex flex-col gap-2 px-0 py-3 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                    <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                        {item.label}
                    </span>
                    <span className="font-display text-[1.5rem] leading-tight text-[var(--iko-stone-ink)]">
                        {item.value}
                    </span>
                </div>
            ))}
        </section>
    );
}

/* ─────────────────────────────────────────────────────────
 * Featured products — spec-sheet list, NOT a card grid.
 * Numbered rows: mono index · serif name · sans category · mono price.
 * Prices are public per PRODUCT.md — no login gate, no lock affordance.
 * ───────────────────────────────────────────────────────── */

function FeaturedList({ products }: { products: FeaturedProduct[] }) {
    if (products.length === 0) {
        return (
            <section className="py-20">
                <SectionHeader index="01" eyebrow="Catálogo" title="Productos destacados" />
                <p className="mt-10 max-w-[60ch] text-[15px] leading-[1.6] text-[var(--iko-stone-whisper)]">
                    Aún no hay productos destacados. El catálogo completo está disponible.{' '}
                    <Link
                        href="/catalog"
                        className="text-[var(--iko-accent)] underline-offset-4 hover:underline"
                    >
                        Ver catálogo →
                    </Link>
                </p>
            </section>
        );
    }

    return (
        <section aria-labelledby="featured-heading" className="py-20">
            <SectionHeader index="01" eyebrow="Catálogo" title="Productos destacados" headingId="featured-heading" />

            <ol className="mt-10 border-t border-[var(--iko-stone-hairline)]">
                {products.map((product, idx) => (
                    <li key={product.id}>
                        <Link
                            href={`/products/${product.slug}`}
                            className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-6 border-b border-[var(--iko-stone-hairline)] py-6 transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset sm:grid-cols-[3.5rem_5rem_1fr_auto]"
                        >
                            <span className="font-spec text-[12px] tabular-nums text-[var(--iko-accent)]">
                                {String(idx + 1).padStart(2, '0')}
                            </span>

                            <span className="hidden h-16 w-16 shrink-0 overflow-hidden bg-[var(--iko-stone-mid)]/40 sm:block">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt=""
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : null}
                            </span>

                            <span className="flex flex-col gap-1 min-w-0">
                                <span className="font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)] truncate">
                                    {product.name}
                                </span>
                                {product.category && (
                                    <span className="font-spec text-[11px] tracking-[0.06em] text-[var(--iko-stone-whisper)] uppercase">
                                        {product.category}
                                    </span>
                                )}
                            </span>

                            <span className="font-spec text-[15px] tabular-nums text-[var(--iko-stone-ink)]">
                                {formatCurrency(product.price)}
                            </span>
                        </Link>
                    </li>
                ))}
            </ol>
        </section>
    );
}

/* ─────────────────────────────────────────────────────────
 * Banners — only when present, restyled to system.
 * ───────────────────────────────────────────────────────── */

function BannersBlock({ banners }: { banners: BannerData[] }) {
    if (banners.length === 0) {
        return null;
    }

    return (
        <section aria-labelledby="banners-heading" className="py-20">
            <SectionHeader index="02" eyebrow="Avisos" title="Novedades" headingId="banners-heading" />

            <div
                className={`mt-10 grid gap-px bg-[var(--iko-stone-hairline)] ${
                    banners.length > 1 ? 'sm:grid-cols-2' : ''
                }`}
            >
                {banners.map((banner) => (
                    <BannerRow key={banner.id} banner={banner} />
                ))}
            </div>
        </section>
    );
}

function BannerRow({ banner }: { banner: BannerData }) {
    const inner = (
        <div className="flex h-full flex-col gap-3 bg-[var(--iko-stone-paper)] p-8">
            <span className="font-display text-[1.5rem] leading-tight text-[var(--iko-stone-ink)]">
                {banner.title}
            </span>
            {banner.subtitle && (
                <span className="text-[14px] leading-[1.55] text-[var(--iko-stone-ink)]/75">{banner.subtitle}</span>
            )}
            {banner.link_text && (
                <span className="mt-2 inline-flex items-baseline gap-2 font-spec text-[12px] tracking-[0.04em] text-[var(--iko-accent)] uppercase">
                    {banner.link_text}
                    <span aria-hidden="true">→</span>
                </span>
            )}
        </div>
    );

    const href = bannerHref(banner);
    if (href) {
        const external = banner.link_type === 'url';
        const linkClass =
            'block transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset';
        if (external) {
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {inner}
                </a>
            );
        }
        return (
            <Link href={href} className={linkClass}>
                {inner}
            </Link>
        );
    }
    return inner;
}

function bannerHref(banner: BannerData): string | null {
    if (!banner.link_type || !banner.link_value) {
        return null;
    }
    if (banner.link_type === 'url') {
        return banner.link_value;
    }
    if (banner.link_type === 'product') {
        return `/products/${banner.link_value}`;
    }
    return `/catalog?category_id=${banner.link_value}`;
}

/* ─────────────────────────────────────────────────────────
 * Footer hand-off — final reinforcement of the one-track buying premise.
 * ───────────────────────────────────────────────────────── */

function SecondaryHandoff() {
    return (
        <section className="border-t border-[var(--iko-stone-hairline)] py-16">
            <p className="text-[15px] leading-[1.55] text-[var(--iko-stone-whisper)]">
                Empieza por el catálogo. Una unidad o veinte, mismo trato.{' '}
                <Link
                    href="/catalog"
                    className="text-[var(--iko-stone-ink)] underline decoration-[var(--iko-stone-mid)] underline-offset-4 transition-colors hover:text-[var(--iko-accent)] hover:decoration-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] rounded-sm"
                >
                    Ver catálogo →
                </Link>
            </p>
        </section>
    );
}

/* ─────────────────────────────────────────────────────────
 * Section header — shared spec-sheet treatment.
 * ───────────────────────────────────────────────────────── */

function SectionHeader({
    index,
    eyebrow,
    title,
    headingId,
}: {
    index: string;
    eyebrow: string;
    title: string;
    headingId?: string;
}) {
    return (
        <div className="flex items-baseline gap-6 border-b border-[var(--iko-stone-hairline)] pb-4">
            <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-accent)]">
                {index}
            </span>
            <div className="flex flex-1 items-baseline justify-between gap-6">
                <h2 id={headingId} className="font-display text-[1.875rem] leading-tight text-[var(--iko-stone-ink)]">
                    {title}
                </h2>
                <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent)] uppercase">
                    {eyebrow}
                </span>
            </div>
        </div>
    );
}
