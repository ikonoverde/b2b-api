import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import CustomerShell from '@/Layouts/CustomerShell';

export type AccountSection =
    | 'overview'
    | 'orders'
    | 'addresses'
    | 'payment-methods'
    | 'notifications'
    | 'profile';

interface AccountShellProps {
    title: string;
    eyebrow: string;
    headline: string;
    sub?: string;
    section: AccountSection;
    children: ReactNode;
}

interface NavEntry {
    section: AccountSection;
    label: string;
    href: string;
}

const ACCOUNT_NAV: NavEntry[] = [
    { section: 'overview', label: 'Resumen', href: '/account' },
    { section: 'orders', label: 'Pedidos', href: '/account/orders' },
    { section: 'addresses', label: 'Direcciones', href: '/account/addresses' },
    { section: 'payment-methods', label: 'Métodos de pago', href: '/account/payment-methods' },
    { section: 'notifications', label: 'Notificaciones', href: '/account/notifications' },
    { section: 'profile', label: 'Perfil', href: '/account/profile' },
];

/**
 * Section-level chrome for /account/* surfaces.
 *
 * Renders a numbered horizontal nav (specimen-sheet style) under the page
 * header. Active item gets the Iodine Teal index; inactive items render in
 * stone-whisper. Scrolls horizontally on narrow viewports — no hamburger,
 * no sidebar.
 */
export default function AccountShell({
    title,
    eyebrow,
    headline,
    sub,
    section,
    children,
}: AccountShellProps) {
    return (
        <CustomerShell title={title}>
            <header className="flex flex-col gap-3 pb-2">
                <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase">
                    {eyebrow}
                </span>
                <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                    {headline}
                </h1>
                {sub && (
                    <p className="max-w-[58ch] text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75">
                        {sub}
                    </p>
                )}
            </header>

            <nav
                aria-label="Navegación de cuenta"
                className="-mx-6 mt-10 overflow-x-auto border-y border-[var(--iko-stone-hairline)] sm:-mx-10 lg:-mx-16"
            >
                <ol className="mx-auto flex max-w-[72rem] items-stretch px-6 sm:px-10 lg:px-16">
                    {ACCOUNT_NAV.map((entry, idx) => {
                        const isActive = entry.section === section;
                        return (
                            <li key={entry.section} className="shrink-0">
                                <Link
                                    href={entry.href}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`group flex items-baseline gap-2 py-4 pr-7 text-[13px] transition-colors ${
                                        isActive
                                            ? 'text-[var(--iko-stone-ink)]'
                                            : 'text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]'
                                    } focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]`}
                                >
                                    <span
                                        className={`font-spec text-[11px] tabular-nums tracking-[0.04em] ${
                                            isActive
                                                ? 'text-[var(--iko-accent)]'
                                                : 'text-[var(--iko-stone-mid)] group-hover:text-[var(--iko-stone-whisper)]'
                                        }`}
                                    >
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <span className="whitespace-nowrap">{entry.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ol>
            </nav>

            <div className="pt-12">{children}</div>
        </CustomerShell>
    );
}
