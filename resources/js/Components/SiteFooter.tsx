import { Link } from '@inertiajs/react';
import Wordmark from '@/Components/Wordmark';

interface SiteFooterProps {
    className?: string;
}

const FOOTER_FACTS = [
    { label: 'Sin mínimo', value: 'Desde 1 unidad' },
    { label: 'Precios visibles', value: 'Sin iniciar sesión' },
    { label: 'Mismo precio', value: 'Para todos' },
] as const;

const footerLinkClass =
    'rounded-sm text-[var(--iko-stone-whisper)] transition-colors hover:text-[var(--iko-stone-ink)] focus-visible:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]';

export default function SiteFooter({ className = '' }: SiteFooterProps) {
    return (
        <footer className={`${className} border-t border-[var(--iko-stone-hairline)]`}>
            <div className="mx-auto max-w-[72rem] px-6 py-12 sm:px-10 sm:py-14 lg:px-16">
                <div className="grid gap-11 lg:grid-cols-[1.15fr_0.65fr_1fr] lg:gap-16">
                    <div className="max-w-[34rem]">
                        <Link
                            href="/"
                            className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                            aria-label="Ikonoverde, inicio"
                        >
                            <Wordmark size="sm" />
                        </Link>
                        <p className="mt-5 max-w-[44ch] text-[15px] leading-[1.65] text-[var(--iko-stone-ink)]/75">
                            Cuidado corporal profesional, precios visibles y compra sin mínimo desde el primer producto.
                        </p>
                        <Link
                            href="/catalog"
                            prefetch
                            className="mt-7 inline-flex items-center bg-[var(--iko-accent)] px-6 py-3 text-[13px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                        >
                            Comprar ahora
                        </Link>
                    </div>

                    <nav aria-label="Navegación del pie" className="flex flex-col gap-4 text-[13px]">
                        <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                            Comprar
                        </span>
                        <Link href="/catalog" prefetch className={footerLinkClass}>
                            Catálogo
                        </Link>
                        <Link href="/blog" prefetch className={footerLinkClass}>
                            Blog
                        </Link>
                        <Link href="/faq" className={footerLinkClass}>
                            Preguntas frecuentes
                        </Link>
                    </nav>

                    <section aria-labelledby="footer-terms-heading">
                        <h2
                            id="footer-terms-heading"
                            className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase"
                        >
                            Condiciones
                        </h2>
                        <dl className="mt-4 divide-y divide-[var(--iko-stone-hairline)] border-t border-[var(--iko-stone-hairline)]">
                            {FOOTER_FACTS.map((fact) => (
                                <div key={fact.label} className="grid grid-cols-[9.5rem_1fr] gap-5 py-3.5">
                                    <dt className="font-spec text-[11px] leading-5 tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                                        {fact.label}
                                    </dt>
                                    <dd className="text-[14px] leading-5 text-[var(--iko-stone-ink)]">{fact.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-[var(--iko-stone-hairline)] pt-6 sm:flex-row sm:items-baseline sm:justify-between">
                    <span className="font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                        © {new Date().getFullYear()} Ikonoverde
                    </span>
                    <nav aria-label="Legal" className="flex items-center gap-6 text-[13px]">
                        <Link href="/terms" className={footerLinkClass}>
                            Términos
                        </Link>
                        <Link href="/privacy" className={footerLinkClass}>
                            Privacidad
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
