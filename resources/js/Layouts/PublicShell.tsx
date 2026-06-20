import { Head, Link, usePage } from '@inertiajs/react';
import type { CSSProperties, PropsWithChildren } from 'react';
import SiteFooter from '@/Components/SiteFooter';
import Wordmark from '@/Components/Wordmark';
import type { PageProps } from '@/types';

/**
 * Public shell for marketing-grade, logged-out-or-logged-in surfaces.
 *
 * Owns the specimen-sheet chrome (DESIGN.md §1):
 *   • Stone-paper surface, single mineral accent ≤10% of the screen.
 *   • Display serif (Fraunces) + neutral sans (Inter) + mono spec (JetBrains Mono).
 *   • Verde-In-Wordmark Rule: green appears only inside the literal "verde".
 *   • Flat by default — no resting shadows, no rounded card grids.
 *
 * Children render inside the canonical `max-w-[72rem]` container with the
 * project's standard horizontal padding. Content controls its own vertical
 * rhythm; the shell only sets edges.
 */
interface PublicShellProps extends PropsWithChildren {
    title: string;
}

export default function PublicShell({ title, children }: PublicShellProps) {
    return (
        <>
            <Head title={title} />
            <div
                data-iko=""
                className="relative flex min-h-screen flex-col overflow-x-clip bg-[var(--iko-stone-paper)] text-[var(--iko-stone-ink)] font-sans antialiased"
                style={
                    {
                        fontFeatureSettings: '"ss01", "cv11"',
                    } as CSSProperties
                }
            >
                <SiteHeader />
                <MeridaPromotionBanner />
                <div className="flex-1 px-6 sm:px-10 lg:px-16">
                    <div className="mx-auto max-w-[72rem]">{children}</div>
                </div>
                <SiteFooter className="mt-32" />
            </div>
        </>
    );
}

function MeridaPromotionBanner() {
    const { visitor } = usePage<PageProps>().props;

    if (!visitor?.showMeridaPromo) {
        return null;
    }

    return (
        <section className="border-b border-[var(--iko-accent-line)] bg-[var(--iko-accent-mist)]">
            <div className="mx-auto flex max-w-[72rem] flex-col gap-3 px-6 py-4 text-[var(--iko-stone-ink)] sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
                <div className="max-w-[54rem]">
                    <p className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent-ink)] uppercase">
                        Mérida · Yucatán
                    </p>
                    <p className="mt-1 text-[14px] leading-[1.55] text-[var(--iko-stone-ink)]/80">
                        Está visitando desde nuestra ciudad base. Consulte promociones locales disponibles para su
                        pedido.
                    </p>
                </div>
                <Link
                    href="/catalog"
                    className="w-fit rounded-sm text-[13px] font-medium text-[var(--iko-accent-ink)] underline underline-offset-4 transition-colors hover:text-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-accent-mist)]"
                >
                    Ver catálogo
                </Link>
            </div>
        </section>
    );
}

function SiteHeader() {
    const { auth } = usePage<PageProps>().props;
    const linkClass =
        'rounded-sm text-[var(--iko-stone-ink)] transition-colors hover:text-[var(--iko-accent)] focus-visible:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]';

    return (
        <header className="border-b border-[var(--iko-stone-hairline)]">
            <div className="mx-auto flex max-w-[72rem] items-baseline justify-between px-6 py-6 sm:px-10 lg:px-16">
                <Link href="/" className="group flex items-baseline" aria-label="Ikonoverde, inicio">
                    <Wordmark />
                </Link>

                <nav className="flex items-center gap-7 text-[13px]">
                    <Link href="/catalog" className={linkClass}>
                        Catálogo
                    </Link>
                    <Link href="/blog" className={linkClass}>
                        Blog
                    </Link>
                    {auth.user ? (
                        <>
                            {auth.canAccessAdmin && (
                                <Link href="/admin" className={linkClass}>
                                    Admin
                                </Link>
                            )}
                            <Link href="/dashboard" className={linkClass}>
                                Mi cuenta
                            </Link>
                        </>
                    ) : (
                        <Link href="/login" className={linkClass}>
                            Ingresar
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
