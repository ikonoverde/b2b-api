import { Head, Link, usePage } from '@inertiajs/react';
import type { CSSProperties, PropsWithChildren } from 'react';
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
                className="relative flex min-h-screen flex-col bg-[var(--iko-stone-paper)] text-[var(--iko-stone-ink)] font-sans antialiased"
                style={
                    {
                        fontFeatureSettings: '"ss01", "cv11"',
                    } as CSSProperties
                }
            >
                <SiteHeader />
                <div className="flex-1 px-6 sm:px-10 lg:px-16">
                    <div className="mx-auto max-w-[72rem]">{children}</div>
                </div>
                <SiteFooter />
            </div>
        </>
    );
}

function SiteHeader() {
    const { auth } = usePage<PageProps>().props;
    const linkClass =
        'rounded-sm text-[var(--iko-stone-ink)] transition-colors hover:text-[var(--iko-accent)] focus-visible:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]';

    return (
        <header className="border-b border-[var(--iko-stone-hairline)]">
            <div className="mx-auto flex max-w-[72rem] items-baseline justify-between px-6 py-6 sm:px-10 lg:px-16">
                <Link href="/" className="group flex items-baseline" aria-label="Ikonoverde — Inicio">
                    <Wordmark />
                </Link>

                <nav className="flex items-center gap-7 text-[13px]">
                    <Link href="/catalog" className={linkClass}>
                        Catálogo
                    </Link>
                    {auth.user ? (
                        <Link href="/dashboard" className={linkClass}>
                            Mi cuenta
                        </Link>
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
