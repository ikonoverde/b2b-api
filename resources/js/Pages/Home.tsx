import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { CSSProperties } from 'react';
import type { BannerData } from '@/Components/BannerCard';
import MiniCart from '@/Components/MiniCart';
import Wordmark from '@/Components/Wordmark';
import type { PageProps } from '@/types';

/**
 * Public home for Ikonoverde.
 *
 * Editorial / specimen-sheet aesthetic per DESIGN.md:
 *   • Stone-paper surface, single mineral accent ≤10% of the screen.
 *   • Display serif (Fraunces) + neutral sans (Inter) + mono spec (JetBrains Mono).
 *   • Verde-In-Wordmark Rule: green appears only inside the literal "verde" of the wordmark.
 *   • Flat by default — no resting shadows, no rounded card grids, no sage gradients.
 *
 */

interface FeaturedProduct {
    id: number;
    slug: string;
    name: string;
    category: string | null;
    image_url: string | null;
}

export interface HomeProps extends PageProps {
    featuredProducts: FeaturedProduct[];
    banners: BannerData[];
}

export default function Home({ featuredProducts, banners }: HomeProps) {
    return (
        <>
            <Head title="Ikonoverde — Cuidado corporal profesional" />
            <div
                data-iko=""
                className="relative min-h-screen bg-[var(--iko-stone-paper)] text-[var(--iko-stone-ink)] font-sans antialiased"
                style={
                    {
                        fontFeatureSettings: '"ss01", "cv11"',
                    } as CSSProperties
                }
            >
                <SiteHeader />

                <div className="px-6 sm:px-10 lg:px-16">
                    <div className="mx-auto max-w-[72rem]">
                        <Hero />
                        <ValuePropStrip />
                        <FeaturedList products={featuredProducts} />
                        <BannersBlock banners={banners} />
                        <SecondaryHandoff />
                    </div>
                </div>

                <SiteFooter />
            </div>
        </>
    );
}

/* ─────────────────────────────────────────────────────────
 * Header & Footer (intentionally NOT using PublicLayout —
 * that layout's sage-green header is an explicit anti-reference
 * in DESIGN.md and will be redesigned in a follow-up).
 * ───────────────────────────────────────────────────────── */

function SiteHeader() {
    const { auth, miniCart } = usePage<PageProps>().props;
    const user = auth.user;
    const { post, processing } = useForm({});

    const handleLogout = (): void => {
        post('/logout');
    };

    const navLinkClass =
        'rounded-sm text-[var(--iko-stone-ink)] transition-colors hover:text-[var(--iko-accent)] focus-visible:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]';

    return (
        <header className="border-b border-[var(--iko-stone-hairline)]">
            <div className="mx-auto flex max-w-[72rem] items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
                <Link href="/" className="group flex items-baseline shrink-0" aria-label="Ikonoverde — Inicio">
                    <Wordmark />
                </Link>

                <nav className="flex items-center gap-6 text-[13px]">
                    <Link href="/catalog" className={navLinkClass}>
                        Catálogo
                    </Link>

                    {user ? (
                        <>
                            <MiniCart miniCart={miniCart ?? { items: [], subtotal: 0, totalCount: 0 }} />
                            <Link
                                href="/account"
                                className={`hidden h-9 items-center gap-2.5 border border-[var(--iko-stone-hairline)] px-3 text-[13px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] sm:inline-flex`}
                            >
                                <span className="font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                                    {user.initials}
                                </span>
                                <span>Cuenta</span>
                            </Link>
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={processing}
                                className="hidden text-[13px] text-[var(--iko-stone-whisper)] transition-colors hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] sm:inline"
                                aria-label="Cerrar sesión"
                            >
                                Salir
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className={navLinkClass}>
                            Ingresar
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

function SiteFooter() {
    return (
        <footer className="mt-32 border-t border-[var(--iko-stone-hairline)]">
            <div className="mx-auto flex max-w-[72rem] flex-col gap-3 px-6 py-10 sm:flex-row sm:items-baseline sm:justify-between sm:px-10 lg:px-16">
                <span className="font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                    © {new Date().getFullYear()} Ikonoverde · Cuidado corporal profesional
                </span>
                <div className="flex items-center gap-6 text-[13px]">
                    <Link
                        href="/terms"
                        className="text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)] transition-colors"
                    >
                        Términos
                    </Link>
                    <Link
                        href="/privacy"
                        className="text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)] transition-colors"
                    >
                        Privacidad
                    </Link>
                </div>
            </div>
        </footer>
    );
}



/* ─────────────────────────────────────────────────────────
 * Hero — typographic only, no imagery.
 * One accent-colored underline mark on the word "reordenar".
 * ───────────────────────────────────────────────────────── */

function Hero() {
    return (
        <section className="pt-20 pb-24 sm:pt-28 sm:pb-32">
            <p className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                Ikonoverde · Cuidado corporal profesional
            </p>

            <h1 className="mt-6 max-w-[22ch] font-display text-[clamp(2.5rem,6vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                Aceite de masaje profesional, hecho para{' '}
                <span className="relative whitespace-nowrap">
                    reordenar
                    <span
                        aria-hidden="true"
                        className="absolute right-0 bottom-[0.08em] left-0 h-[0.08em] bg-[var(--iko-accent)]"
                    />
                </span>
                .
            </h1>

            <p className="mt-8 max-w-[52ch] text-[17px] leading-[1.55] text-[var(--iko-stone-ink)]/80">
                Formulado para spas, hoteles y centros de masaje. Disponible en formato mayorista o por unidad.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                    href="/register"
                    className="inline-flex items-center bg-[var(--iko-accent)] px-7 py-3.5 text-[14px] font-medium text-[var(--iko-accent-on)] tracking-[0.01em] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors"
                >
                    Crear cuenta mayorista
                </Link>
                <Link
                    href="/catalog"
                    className="group inline-flex items-baseline gap-2 text-[14px] font-medium text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] focus-visible:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] rounded-sm transition-colors"
                >
                    Ver catálogo
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                        →
                    </span>
                </Link>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────────
 * Value-prop strip — mono labels + serif/sans values,
 * separated by hairline rules. Not card medallions.
 *
 * NOTE: values below are placeholders pending business confirmation.
 * Replace before wider launch.
 * ───────────────────────────────────────────────────────── */

const VALUE_PROPS = [
    { label: 'Pedido mínimo', value: '1 unidad' },
    { label: 'Plazos B2B', value: 'A medida' },
    { label: 'Envío', value: 'Coordinado por pedido' },
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
 * Numbered rows: mono index · serif name · sans category · locked-price affordance.
 * ───────────────────────────────────────────────────────── */

function FeaturedList({ products }: { products: FeaturedProduct[] }) {
    if (products.length === 0) {
        return (
            <section className="py-20">
                <SectionHeader index="01" eyebrow="Catálogo" title="Productos destacados" />
                <p className="mt-10 max-w-[60ch] text-[15px] leading-[1.6] text-[var(--iko-stone-whisper)]">
                    Catálogo completo disponible al{' '}
                    <Link href="/login" className="text-[var(--iko-accent)] underline-offset-4 hover:underline">
                        iniciar sesión
                    </Link>
                    .
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

                            <span className="flex items-center gap-2 font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                                <LockGlyph />
                                <span className="hidden sm:inline">Iniciar sesión para ver el precio</span>
                                <span className="sm:hidden">Ver precio</span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ol>
        </section>
    );
}

function LockGlyph() {
    return (
        <svg
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            aria-hidden="true"
        >
            <rect x="2.5" y="5.5" width="7" height="5" rx="0.5" />
            <path d="M4 5.5V3.5a2 2 0 1 1 4 0v2" />
        </svg>
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
 * Footer hand-off — explicit secondary path for individual buyers.
 * ───────────────────────────────────────────────────────── */

function SecondaryHandoff() {
    return (
        <section className="border-t border-[var(--iko-stone-hairline)] py-16">
            <p className="text-[15px] leading-[1.55] text-[var(--iko-stone-whisper)]">
                ¿Compra individual?{' '}
                <Link
                    href="/catalog"
                    className="text-[var(--iko-stone-ink)] underline decoration-[var(--iko-stone-mid)] underline-offset-4 transition-colors hover:text-[var(--iko-accent)] hover:decoration-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] rounded-sm"
                >
                    Ir al catálogo
                </Link>
                .
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
