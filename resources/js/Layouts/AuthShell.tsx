import { Head, Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Wordmark from '@/Components/Wordmark';

/**
 * Shared chrome for all guest-group auth surfaces.
 *
 * Stone-paper surface, the Home-style header (mark + wordmark + minimal nav),
 * a single centered form column, and the Home footer. No split-screen brand
 * panel, no decorative leaves, no sage green anywhere.
 */
interface AuthShellProps extends PropsWithChildren {
    title: string;
    eyebrow: string;
    headline: string;
    sub: string;
}

export default function AuthShell({
    title,
    eyebrow,
    headline,
    sub,
    children,
}: AuthShellProps) {
    return (
        <>
            <Head title={title} />
            <div
                data-iko=""
                className="relative min-h-screen bg-[var(--iko-stone-paper)] text-[var(--iko-stone-ink)] font-sans antialiased flex flex-col"
            >
                <header className="border-b border-[var(--iko-stone-hairline)]">
                    <div className="mx-auto flex max-w-[72rem] items-baseline justify-between px-6 py-6 sm:px-10 lg:px-16">
                        <Link href="/" aria-label="Ikonoverde — Inicio">
                            <Wordmark size="md" />
                        </Link>
                        <nav className="flex items-center gap-7 text-[13px]">
                            <Link
                                href="/catalog"
                                className="text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] rounded-sm transition-colors"
                            >
                                Catálogo
                            </Link>
                        </nav>
                    </div>
                </header>

                <main className="flex-1 flex flex-col items-center px-6 py-16 sm:px-10 sm:py-24 lg:px-16">
                    <div className="w-full max-w-[26rem] flex flex-col gap-12">
                        <div className="flex flex-col gap-2">
                            <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase">
                                {eyebrow}
                            </span>
                            <h1 className="font-display text-[clamp(2rem,4vw,2.5rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                                {headline}
                            </h1>
                            <p className="mt-2 text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75">
                                {sub}
                            </p>
                        </div>

                        {children}
                    </div>
                </main>

                <footer className="border-t border-[var(--iko-stone-hairline)]">
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
            </div>
        </>
    );
}
