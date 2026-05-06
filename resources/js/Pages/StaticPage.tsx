import { Link } from '@inertiajs/react';
import type { ComponentPropsWithoutRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PublicShell from '@/Layouts/PublicShell';
import { formatDateMonthYear } from '@/utils/date';

/**
 * Static page surface — handles /terms, /privacy, /about, /faq.
 * Specimen-sheet treatment per DESIGN.md: serif display title, mono updated-at,
 * hairline-divided body, no rounded card / shadow / icon medallion.
 */

interface StaticPageData {
    slug: string;
    title: string;
    content: string;
    updated_at: string | null;
}

interface Props {
    page: StaticPageData;
}

const SLUG_LABEL: Record<string, string> = {
    terms: 'Documento legal',
    privacy: 'Documento legal',
    about: 'La marca',
    faq: 'Preguntas frecuentes',
};

const RELATED: Record<string, Array<{ href: string; label: string }>> = {
    terms: [
        { href: '/privacy', label: 'Política de privacidad' },
        { href: '/faq', label: 'Preguntas frecuentes' },
    ],
    privacy: [
        { href: '/terms', label: 'Términos y condiciones' },
        { href: '/faq', label: 'Preguntas frecuentes' },
    ],
    about: [
        { href: '/catalog', label: 'Catálogo' },
        { href: '/faq', label: 'Preguntas frecuentes' },
    ],
    faq: [
        { href: '/terms', label: 'Términos y condiciones' },
        { href: '/privacy', label: 'Política de privacidad' },
    ],
};

export default function StaticPage({ page }: Props) {
    const eyebrow = SLUG_LABEL[page.slug] ?? 'Documento';
    const related = RELATED[page.slug] ?? [];

    return (
        <PublicShell title={page.title}>
            <article>
                <header className="pt-16 pb-12 sm:pt-24 sm:pb-16">
                    <p className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                        Ikonoverde · {eyebrow}
                    </p>

                    <h1 className="mt-6 max-w-[28ch] font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.04] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                        {page.title}
                    </h1>

                    {page.updated_at && (
                        <p className="mt-8 font-spec text-[11px] tabular-nums tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                            Última actualización · {formatDateMonthYear(page.updated_at)}
                        </p>
                    )}
                </header>

                <div className="border-t border-[var(--iko-stone-hairline)] pt-12 pb-16">
                    <div className="font-sans text-[var(--iko-stone-ink)]">
                        <Markdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
                            {page.content}
                        </Markdown>
                    </div>
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
 * Markdown → specimen-sheet mapping.
 * Headings render as numbered/hairline section breaks; body uses the
 * sans/mono/serif materials and the stone-and-glass tokens directly.
 * ───────────────────────────────────────────────────────── */

const MARKDOWN_COMPONENTS = {
    h1: ({ children }: ComponentPropsWithoutRef<'h1'>) => (
        <h2 className="mt-14 mb-6 border-t border-[var(--iko-stone-hairline)] pt-10 font-display text-[clamp(1.5rem,2.5vw,2rem)] leading-[1.15] tracking-[-0.01em] text-[var(--iko-stone-ink)] first:mt-0 first:border-t-0 first:pt-0">
            {children}
        </h2>
    ),
    h2: ({ children }: ComponentPropsWithoutRef<'h2'>) => (
        <h2 className="mt-14 mb-6 border-t border-[var(--iko-stone-hairline)] pt-10 font-display text-[clamp(1.5rem,2.5vw,1.875rem)] leading-[1.15] tracking-[-0.01em] text-[var(--iko-stone-ink)] first:mt-0 first:border-t-0 first:pt-0">
            {children}
        </h2>
    ),
    h3: ({ children }: ComponentPropsWithoutRef<'h3'>) => (
        <h3 className="mt-10 mb-3 font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]">
            {children}
        </h3>
    ),
    h4: ({ children }: ComponentPropsWithoutRef<'h4'>) => (
        <h4 className="mt-8 mb-2 font-sans text-[14px] font-medium tracking-[0.04em] text-[var(--iko-stone-ink)] uppercase">
            {children}
        </h4>
    ),
    p: ({ children }: ComponentPropsWithoutRef<'p'>) => (
        <p className="mb-5 max-w-[65ch] text-[16px] leading-[1.65] text-[var(--iko-stone-ink)]/85">
            {children}
        </p>
    ),
    ul: ({ children }: ComponentPropsWithoutRef<'ul'>) => (
        <ul className="mb-6 max-w-[65ch] list-none space-y-2 pl-0">{children}</ul>
    ),
    ol: ({ children }: ComponentPropsWithoutRef<'ol'>) => (
        <ol className="mb-6 max-w-[65ch] list-none space-y-2 pl-0 [counter-reset:iko]">
            {children}
        </ol>
    ),
    li: ({ children, ...rest }: ComponentPropsWithoutRef<'li'> & { ordered?: boolean }) => {
        const { ordered: _ordered, ...domProps } = rest;
        return (
            <li
                {...domProps}
                className="relative pl-6 text-[15.5px] leading-[1.65] text-[var(--iko-stone-ink)]/85 before:absolute before:left-0 before:top-[0.5em] before:h-px before:w-3 before:bg-[var(--iko-accent)]"
            >
                {children}
            </li>
        );
    },
    a: ({ children, href, ...rest }: ComponentPropsWithoutRef<'a'>) => (
        <a
            {...rest}
            href={href}
            className="text-[var(--iko-accent)] underline decoration-[var(--iko-stone-mid)] underline-offset-4 transition-colors hover:decoration-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] rounded-sm"
        >
            {children}
        </a>
    ),
    strong: ({ children }: ComponentPropsWithoutRef<'strong'>) => (
        <strong className="font-medium text-[var(--iko-stone-ink)]">{children}</strong>
    ),
    em: ({ children }: ComponentPropsWithoutRef<'em'>) => (
        <em className="not-italic text-[var(--iko-stone-ink)]">{children}</em>
    ),
    code: ({ children }: ComponentPropsWithoutRef<'code'>) => (
        <code className="rounded-sm bg-[var(--iko-accent-soft)] px-1.5 py-0.5 font-spec text-[0.9em] text-[var(--iko-stone-ink)]">
            {children}
        </code>
    ),
    blockquote: ({ children }: ComponentPropsWithoutRef<'blockquote'>) => (
        <blockquote className="my-8 max-w-[60ch] border-l-0 pl-0">
            <div className="border-t border-[var(--iko-stone-hairline)] pt-6 font-display text-[1.25rem] leading-[1.45] text-[var(--iko-stone-ink)]">
                {children}
            </div>
        </blockquote>
    ),
    hr: () => <hr className="my-12 border-0 border-t border-[var(--iko-stone-hairline)]" />,
    table: ({ children }: ComponentPropsWithoutRef<'table'>) => (
        <div className="my-8 overflow-x-auto">
            <table className="w-full border-collapse text-left text-[14px]">{children}</table>
        </div>
    ),
    thead: ({ children }: ComponentPropsWithoutRef<'thead'>) => (
        <thead className="border-b border-[var(--iko-stone-ink)]">{children}</thead>
    ),
    th: ({ children }: ComponentPropsWithoutRef<'th'>) => (
        <th className="py-3 pr-6 font-spec text-[11px] tracking-[0.06em] text-[var(--iko-stone-whisper)] uppercase">
            {children}
        </th>
    ),
    td: ({ children }: ComponentPropsWithoutRef<'td'>) => (
        <td className="border-b border-[var(--iko-stone-hairline)] py-3 pr-6 text-[var(--iko-stone-ink)]">
            {children}
        </td>
    ),
};
