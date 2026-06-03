import { Link } from '@inertiajs/react';
import type { BannerData } from '@/Components/BannerCard';
import PublicShell from '@/Layouts/PublicShell';
import type { PageProps } from '@/types';
import { formatCurrency } from '@/utils/currency';

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

const VALUE_PROPS = [
    { label: 'SIN MÍNIMO', value: 'Desde 1 unidad' },
    { label: 'PRECIO CLARO', value: 'Visible para todos' },
    { label: 'CUENTA OPCIONAL', value: 'Compra sin registrarte' },
] as const;

export default function Home({ featuredProducts, banners }: HomeProps) {
    return (
        <PublicShell title="Ikonoverde | Cuidado corporal profesional">
            <Hero />
            <ValuePropStrip />
            <FeaturedList products={featuredProducts} />
            <BannersBlock banners={banners} />
            <SecondaryHandoff />
        </PublicShell>
    );
}

function Hero() {
    return (
        <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[var(--iko-stone-paper)]">
            <img
                src="/images/hero-hands-oil.webp"
                srcSet="/images/hero-hands-oil-mobile.webp 1280w, /images/hero-hands-oil.webp 2400w"
                sizes="100vw"
                alt="Aceite de masaje Ikonoverde vertido en la palma de una mano"
                fetchPriority="high"
                decoding="async"
                className="pointer-events-none block h-[38vh] w-full object-cover object-[60%_50%] sm:absolute sm:inset-0 sm:h-full"
            />

            <div className="relative mx-auto max-w-[72rem] px-6 sm:flex sm:min-h-[clamp(34rem,80vh,46rem)] sm:items-center sm:px-10 lg:px-16">
                <div className="border-y border-[var(--iko-accent-line)] bg-[var(--iko-stone-surface)] py-12 sm:max-w-[32rem] sm:border sm:px-10 lg:px-12 lg:py-14">
                    <p className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent-ink)] uppercase">
                        Ikonoverde · Cuidado corporal
                    </p>

                    <h1 className="mt-6 max-w-[17ch] font-display text-[clamp(2.25rem,4.4vw,3.5rem)] font-normal leading-[1.04] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                        Aceite de masaje{' '}
                        <span className="relative whitespace-nowrap">
                            profesional
                            <span
                                aria-hidden="true"
                                className="absolute right-0 bottom-[0.08em] left-0 h-[0.08em] bg-[var(--iko-accent)]"
                            />
                        </span>
                        .
                    </h1>

                    <p className="mt-7 max-w-[42ch] text-[16px] leading-[1.55] text-[var(--iko-stone-ink)]/80">
                        Formulado para spas, hoteles y uso personal. Sin pedido mínimo, sin cuenta obligatoria.
                    </p>

                    <div className="mt-7 flex max-w-max items-center gap-3 border border-[var(--iko-accent-line)] bg-[var(--iko-accent-mist)] px-4 py-2 font-spec text-[11px] text-[var(--iko-accent-ink)] tracking-[0.04em] uppercase">
                        <span aria-hidden="true" className="h-1.5 w-1.5 bg-[var(--iko-accent)]" />
                        Precio visible para todos
                    </div>

                    <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Link
                            href="/catalog"
                            className="inline-flex items-center bg-[var(--iko-accent)] px-7 py-3.5 text-[14px] font-medium text-[var(--iko-accent-on)] tracking-[0.01em] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                        >
                            Ver el catálogo
                        </Link>
                        <Link
                            href="/register"
                            className="group inline-flex items-baseline gap-2 rounded-sm text-[14px] font-medium text-[var(--iko-stone-ink)] transition-colors hover:text-[var(--iko-accent)] focus-visible:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                        >
                            Crear cuenta
                            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                                →
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ValuePropStrip() {
    return (
        <section
            aria-label="Términos comerciales"
            className="grid grid-cols-1 border-y border-[var(--iko-accent-line)] bg-[var(--iko-stone-surface)] py-10 sm:grid-cols-3 sm:divide-x sm:divide-[var(--iko-accent-line)]"
        >
            {VALUE_PROPS.map((item, idx) => (
                <div key={item.label} className="flex flex-col gap-2 px-8 py-3">
                    <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent-ink)] uppercase">
                        {String(idx + 1).padStart(2, '0')} · {item.label}
                    </span>
                    <span
                        className={`font-display text-[1.5rem] leading-tight ${
                            idx === 0 ? 'text-[var(--iko-accent-ink)]' : 'text-[var(--iko-stone-ink)]'
                        }`}
                    >
                        {item.value}
                    </span>
                </div>
            ))}
        </section>
    );
}

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

            <ol className="mt-10 border-t border-[var(--iko-accent-line)]">
                {products.map((product, idx) => (
                    <li key={product.id}>
                        <Link
                            href={`/products/${product.slug}`}
                            className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-6 border-b border-[var(--iko-stone-hairline)] py-6 transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset sm:grid-cols-[3.5rem_5rem_1fr_auto]"
                        >
                            <span className="font-spec text-[12px] tabular-nums text-[var(--iko-accent-ink)]">
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

                            <span className="flex min-w-0 flex-col gap-1">
                                <span className="truncate font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]">
                                    {product.name}
                                </span>
                                {product.category && (
                                    <span className="font-spec text-[11px] tracking-[0.06em] text-[var(--iko-stone-whisper)] uppercase">
                                        {product.category}
                                    </span>
                                )}
                            </span>

                            <span className="border border-[var(--iko-accent-line)] bg-[var(--iko-accent-mist)] px-3 py-1.5 font-spec text-[14px] tabular-nums text-[var(--iko-accent-ink)] transition-colors group-hover:border-[var(--iko-accent)]">
                                {formatCurrency(product.price)}
                            </span>
                        </Link>
                    </li>
                ))}
            </ol>
        </section>
    );
}

function BannersBlock({ banners }: { banners: BannerData[] }) {
    if (banners.length === 0) {
        return null;
    }

    return (
        <section aria-labelledby="banners-heading" className="py-20">
            <SectionHeader index="02" eyebrow="Avisos" title="Novedades" headingId="banners-heading" />

            <div
                className={`mt-10 grid gap-px bg-[var(--iko-accent-line)] ${
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
        <div className="flex h-full flex-col gap-3 bg-[var(--iko-accent-mist)] p-8 text-[var(--iko-accent-ink)]">
            <span className="font-display text-[1.5rem] leading-tight text-[var(--iko-accent-ink)]">
                {banner.title}
            </span>
            {banner.subtitle && (
                <span className="text-[14px] leading-[1.55] text-[var(--iko-accent-ink)]/80">{banner.subtitle}</span>
            )}
            {banner.link_text && (
                <span className="mt-2 inline-flex items-baseline gap-2 font-spec text-[12px] tracking-[0.04em] text-[var(--iko-accent-ink)] uppercase">
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

function SecondaryHandoff() {
    return (
        <section className="border border-[var(--iko-accent-line)] bg-[var(--iko-accent-mist)] px-6 py-10 sm:px-8">
            <p className="max-w-[68ch] text-[15px] leading-[1.6] text-[var(--iko-accent-ink)]">
                Cuidado corporal profesional hecho en México para spas, hoteles y salas de masaje.{' '}
                <Link
                    href="/catalog"
                    className="rounded-sm text-[var(--iko-accent-ink)] underline decoration-[var(--iko-accent-line)] underline-offset-4 transition-colors hover:text-[var(--iko-accent-hover)] hover:decoration-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-accent-mist)]"
                >
                    Explorar productos →
                </Link>
            </p>
        </section>
    );
}

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
        <div className="flex items-baseline gap-6 border-b border-[var(--iko-accent-line)] pb-4">
            <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-accent-ink)]">
                {index}
            </span>
            <div className="flex flex-1 items-baseline justify-between gap-6">
                <h2 id={headingId} className="font-display text-[1.875rem] leading-tight text-[var(--iko-stone-ink)]">
                    {title}
                </h2>
                <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent-ink)] uppercase">
                    {eyebrow}
                </span>
            </div>
        </div>
    );
}
