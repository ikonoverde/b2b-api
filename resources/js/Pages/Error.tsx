import { Link } from '@inertiajs/react';
import PublicShell from '@/Layouts/PublicShell';

/**
 * Error surface — 4xx / 5xx fallbacks rendered through Inertia.
 * Specimen-sheet treatment: mono error tag, oversized serif status code with
 * accent underline, sans description, primary accent CTA back to the catalog.
 */

interface ErrorProps {
    status: number;
}

const TITLE: Record<number, string> = {
    403: 'Acceso restringido',
    404: 'Página no encontrada',
    500: 'Error del servidor',
    503: 'Servicio en mantenimiento',
};

const DESCRIPTION: Record<number, string> = {
    403: 'Esta sección no está disponible para tu cuenta. Si crees que es un error, contáctanos.',
    404: 'La dirección que buscas no existe o se ha movido. Continúa en el catálogo o vuelve al inicio.',
    500: 'Algo salió mal en nuestros servidores. Estamos trabajando para resolverlo — intenta de nuevo en unos minutos.',
    503: 'Estamos realizando tareas de mantenimiento. Vuelve a intentarlo en unos minutos.',
};

export default function Error({ status }: ErrorProps) {
    const title = TITLE[status] ?? 'Algo no salió como esperábamos';
    const description = DESCRIPTION[status] ?? 'Intenta de nuevo o regresa al inicio.';

    return (
        <PublicShell title={`${status} · ${title}`}>
            <section className="flex min-h-[calc(100vh-220px)] flex-col justify-center pt-16 pb-24 sm:pt-24">
                <p className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                    Error · {status}
                </p>

                <h1 className="mt-8 font-display text-[clamp(6rem,18vw,14rem)] font-normal leading-[0.9] tracking-[-0.03em] text-[var(--iko-stone-ink)]">
                    <span className="relative inline-block whitespace-nowrap">
                        {status}
                        <span
                            aria-hidden="true"
                            className="absolute right-0 bottom-[0.06em] left-0 h-[0.06em] bg-[var(--iko-accent)]"
                        />
                    </span>
                </h1>

                <h2 className="mt-12 max-w-[24ch] font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-normal leading-[1.1] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                    {title}
                </h2>

                <p className="mt-6 max-w-[52ch] text-[16px] leading-[1.6] text-[var(--iko-stone-ink)]/80">
                    {description}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link
                        href="/"
                        className="inline-flex items-center bg-[var(--iko-accent)] px-7 py-3.5 text-[14px] font-medium text-[var(--iko-accent-on)] tracking-[0.01em] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors"
                    >
                        Volver al inicio
                    </Link>
                    <Link
                        href="/catalog"
                        className="group inline-flex items-baseline gap-2 rounded-sm text-[14px] font-medium text-[var(--iko-stone-ink)] hover:text-[var(--iko-accent)] focus-visible:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] transition-colors"
                    >
                        Ir al catálogo
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                            →
                        </span>
                    </Link>
                </div>
            </section>
        </PublicShell>
    );
}
