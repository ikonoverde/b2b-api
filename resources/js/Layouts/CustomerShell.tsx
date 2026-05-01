import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import Wordmark from '@/Components/Wordmark';
import MiniCart from '@/Components/MiniCart';
import type { PageProps } from '@/types';

interface CustomerShellProps {
    title: string;
    children: ReactNode;
}

/**
 * Shared chrome for all auth-protected app surfaces.
 *
 * Stone-paper bar with the wordmark + minimal nav + mini-cart + account.
 * Replaces the legacy CustomerLayout (sage-green chrome — every named
 * anti-reference in PRODUCT.md). Solid stone-paper background, hairline
 * border, no shadows, no backdrop blur.
 */
export default function CustomerShell({ title, children }: CustomerShellProps) {
    const { auth, miniCart } = usePage<PageProps>().props;
    const user = auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const { post, processing } = useForm({});

    const handleLogout = (): void => {
        post('/logout');
    };

    return (
        <>
            <Head title={title} />
            <div
                data-iko=""
                className="relative flex min-h-screen flex-col bg-[var(--iko-stone-paper)] font-sans text-[var(--iko-stone-ink)] antialiased"
            >
                <header className="sticky top-0 z-40 border-b border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)]">
                    <div className="mx-auto flex max-w-[72rem] items-center justify-between gap-6 px-6 py-5 sm:px-10 lg:px-16">
                        <Link href="/dashboard" aria-label="Ikonoverde — Inicio" className="shrink-0">
                            <Wordmark size="md" />
                        </Link>

                        <nav className="hidden items-center gap-7 text-[13px] md:flex">
                            <NavLink href="/catalog">Catálogo</NavLink>
                            <NavLink href="/account/orders">Pedidos</NavLink>
                        </nav>

                        <div className="flex items-center gap-1">
                            {user && (
                                <>
                                    <MiniCart
                                        miniCart={miniCart ?? { items: [], subtotal: 0, totalCount: 0 }}
                                    />
                                    <Link
                                        href="/account"
                                        className="ml-2 hidden h-9 items-center gap-2.5 border border-[var(--iko-stone-hairline)] px-3 text-[13px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] md:inline-flex"
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
                                        className="hidden h-9 w-9 items-center justify-center text-[var(--iko-stone-whisper)] transition-colors hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] md:inline-flex"
                                        title="Cerrar sesión"
                                        aria-label="Cerrar sesión"
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </button>
                                </>
                            )}

                            <button
                                type="button"
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="inline-flex h-9 w-9 items-center justify-center text-[var(--iko-stone-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] md:hidden"
                                aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
                                aria-expanded={mobileOpen}
                            >
                                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {mobileOpen && (
                        <div className="border-t border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] md:hidden">
                            <nav className="mx-auto flex max-w-[72rem] flex-col px-6 sm:px-10">
                                <MobileLink href="/catalog" onSelect={() => setMobileOpen(false)}>
                                    Catálogo
                                </MobileLink>
                                <MobileLink href="/account/orders" onSelect={() => setMobileOpen(false)}>
                                    Pedidos
                                </MobileLink>
                                <MobileLink href="/account" onSelect={() => setMobileOpen(false)}>
                                    Mi cuenta
                                </MobileLink>
                                {user && (
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={processing}
                                        className="flex items-center justify-between border-t border-[var(--iko-stone-hairline)] py-4 text-left text-[14px] text-[var(--iko-stone-whisper)]"
                                    >
                                        <span>Cerrar sesión</span>
                                        <LogOut className="h-4 w-4" />
                                    </button>
                                )}
                            </nav>
                        </div>
                    )}
                </header>

                <main className="flex-1">
                    <div className="mx-auto max-w-[72rem] px-6 py-10 sm:px-10 sm:py-14 lg:px-16">
                        {children}
                    </div>
                </main>

                <footer className="mt-16 border-t border-[var(--iko-stone-hairline)]">
                    <div className="mx-auto flex max-w-[72rem] flex-col gap-3 px-6 py-10 sm:flex-row sm:items-baseline sm:justify-between sm:px-10 lg:px-16">
                        <span className="font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                            © {new Date().getFullYear()} Ikonoverde · Cuidado corporal profesional
                        </span>
                        <div className="flex items-center gap-6 text-[13px]">
                            <Link
                                href="/terms"
                                className="text-[var(--iko-stone-whisper)] transition-colors hover:text-[var(--iko-stone-ink)]"
                            >
                                Términos
                            </Link>
                            <Link
                                href="/privacy"
                                className="text-[var(--iko-stone-whisper)] transition-colors hover:text-[var(--iko-stone-ink)]"
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

function NavLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link
            href={href}
            className="rounded-sm text-[var(--iko-stone-ink)] transition-colors hover:text-[var(--iko-accent)] focus-visible:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
        >
            {children}
        </Link>
    );
}

function MobileLink({
    href,
    onSelect,
    children,
}: {
    href: string;
    onSelect: () => void;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            onClick={onSelect}
            className="flex items-center justify-between border-b border-[var(--iko-stone-hairline)] py-4 text-[14px] text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)]"
        >
            {children}
            <span aria-hidden="true" className="text-[var(--iko-stone-whisper)]">
                →
            </span>
        </Link>
    );
}
