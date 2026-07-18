import { Link } from '@inertiajs/react';
import type { PropsWithChildren, ReactNode } from 'react';
import PublicShell from '@/Layouts/PublicShell';
import { formatDateMonthYear } from '@/utils/date';

/**
 * Specimen-sheet chrome for the storefront's written documents — /terms, /privacy,
 * /about, /faq. Per DESIGN.md: serif display title, mono updated-at, hairline-divided
 * body, no rounded card / shadow / icon medallion.
 *
 * The typography primitives below are exported so document pages read as markup rather
 * than as class-name soup. They carry the same treatment the markdown renderer used to
 * apply, so the pages look identical to their database-backed predecessors.
 */

interface RelatedLink {
    href: string;
    label: string;
}

interface DocumentSheetProps extends PropsWithChildren {
    title: string;
    eyebrow: string;
    /** ISO 8601 timestamp of the document's last substantive revision. */
    updatedAt: string;
    related?: RelatedLink[];
}

export default function DocumentSheet({
    title,
    eyebrow,
    updatedAt,
    related = [],
    children,
}: DocumentSheetProps) {
    return (
        <PublicShell title={title}>
            <article>
                <header className="pt-16 pb-12 sm:pt-24 sm:pb-16">
                    <p className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                        Ikonoverde · {eyebrow}
                    </p>

                    <h1 className="mt-6 max-w-[28ch] font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.04] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                        {title}
                    </h1>

                    <p className="mt-8 font-spec text-[11px] tabular-nums tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                        Última actualización · {formatDateMonthYear(updatedAt)}
                    </p>
                </header>

                <div className="border-t border-[var(--iko-stone-hairline)] pt-12 pb-16">
                    <div className="font-sans text-[var(--iko-stone-ink)]">{children}</div>
                </div>

                {related.length > 0 && (
                    <footer className="border-t border-[var(--iko-stone-hairline)] pt-10 pb-4">
                        <p className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                            Documentos relacionados
                        </p>
                        <ul className="mt-6 grid gap-px bg-[var(--iko-stone-hairline)] sm:grid-cols-2">
                            {related.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="group flex items-baseline justify-between gap-4 bg-[var(--iko-stone-paper)] py-5 pr-4 text-[15px] transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset"
                                    >
                                        <span className="font-display text-[1.125rem] leading-tight text-[var(--iko-stone-ink)]">
                                            {item.label}
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="font-spec text-[12px] tracking-[0.04em] text-[var(--iko-accent)] uppercase transition-transform group-hover:translate-x-0.5"
                                        >
                                            Ver →
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </footer>
                )}
            </article>
        </PublicShell>
    );
}

/* ─────────────────────────────────────────────────────────
 * Typography primitives — the materials a document is built from.
 * ───────────────────────────────────────────────────────── */

/** Top-level section break: hairline rule above, display serif heading. */
export function Section({ title, children }: PropsWithChildren<{ title: ReactNode }>) {
    return (
        <section className="mt-14 border-t border-[var(--iko-stone-hairline)] pt-10 first:mt-0 first:border-t-0 first:pt-0">
            <h2 className="mb-6 font-display text-[clamp(1.5rem,2.5vw,1.875rem)] leading-[1.15] tracking-[-0.01em] text-[var(--iko-stone-ink)]">
                {title}
            </h2>
            {children}
        </section>
    );
}

export function P({ children }: PropsWithChildren) {
    return (
        <p className="mb-5 max-w-[65ch] text-[16px] leading-[1.65] text-[var(--iko-stone-ink)]/85">
            {children}
        </p>
    );
}

export function List({ children }: PropsWithChildren) {
    return <ul className="mb-6 max-w-[65ch] list-none space-y-2 pl-0">{children}</ul>;
}

export function Item({ children }: PropsWithChildren) {
    return (
        <li className="relative pl-6 text-[15.5px] leading-[1.65] text-[var(--iko-stone-ink)]/85 before:absolute before:top-[0.5em] before:left-0 before:h-px before:w-3 before:bg-[var(--iko-accent)]">
            {children}
        </li>
    );
}

export function Strong({ children }: PropsWithChildren) {
    return <strong className="font-medium text-[var(--iko-stone-ink)]">{children}</strong>;
}

/**
 * Shared props for every document page: contact details a human maintains in
 * Ajustes rather than in this file. Any of them may be blank, so each document
 * omits the corresponding line rather than printing an empty label.
 */
export interface DocumentContactProps {
    contactEmail: string | null;
    contactPhone: string | null;
    contactAddress: string | null;
}

/**
 * The contact block that closes every document, rendered from settings.
 * `extra` carries per-document lines that are not contact details (the FAQ's live chat).
 */
export function ContactList({
    contactEmail,
    contactPhone,
    contactAddress,
    extra,
}: DocumentContactProps & { extra?: ReactNode }) {
    return (
        <List>
            {contactEmail && <Item>Correo electrónico: {contactEmail}</Item>}
            {contactPhone && <Item>Teléfono: {contactPhone}</Item>}
            {contactAddress && <Item>Dirección: {contactAddress}</Item>}
            {extra}
        </List>
    );
}

export function DocLink({ href, children }: PropsWithChildren<{ href: string }>) {
    return (
        <Link
            href={href}
            className="rounded-sm text-[var(--iko-accent)] underline decoration-[var(--iko-stone-mid)] underline-offset-4 transition-colors hover:decoration-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
        >
            {children}
        </Link>
    );
}
