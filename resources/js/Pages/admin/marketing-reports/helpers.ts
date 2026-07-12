import type { MetricProvenance } from '@/types';

/**
 * The vocabulary both report pages read from. It lives in one file because the whole point of the
 * schema behind these pages is that "nobody looked" and "looked, saw nothing" are different facts.
 * Two pages each deciding for themselves how to render a null is how that distinction gets lost.
 */

export const provenanceLabels: Record<MetricProvenance, string> = {
    observed: 'Observado',
    estimated: 'Estimado',
    unknown: 'Sin dato',
};

export const provenanceDescriptions: Record<MetricProvenance, string> = {
    observed: 'Una herramienta devolvió este valor en esta corrida.',
    estimated: 'Un juicio del agente, no una medición. No se puede restar de una observación.',
    unknown: 'Nadie pudo verlo: la cuenta no respondió o la herramienta no cargó. No es cero.',
};

/**
 * Pill styles carry a border and a label, never color alone. The buyer-facing accessibility rule in
 * PRODUCT.md applies here too: this audience is older, and a colorblind admin reading an estimate as
 * an observation would act on a number nobody measured.
 */
export const provenancePillClasses: Record<MetricProvenance, string> = {
    observed: 'border-[#C8D3C8] bg-[#EEF2EE] text-[#3D4D3D]',
    estimated: 'border-[#E4D3B4] bg-[#FAF3E6] text-[#7A6234]',
    unknown: 'border-[#E5E5E5] bg-[#F5F3F0] text-[#8A8A8A]',
};

/**
 * Labels for the keys projected onto the reports table's own columns. Any other key renders verbatim
 * in mono — an agent may record a metric this UI has never heard of, and inventing a friendly name
 * for it would be a worse lie than showing the key.
 */
export const metricLabels: Record<string, string> = {
    'ga4.sessions': 'Sesiones',
    'ga4.total_users': 'Usuarios',
    'ga4.screen_page_views': 'Vistas de página',
    'ga4.purchase_events': 'Compras (GA4)',
    'meta.Purchase.total': 'Compras (Meta)',
    'fb.fans': 'Seguidores Facebook',
    'ig.followers': 'Seguidores Instagram',
};

export function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    });
}

export function formatDateTime(value: string): string {
    return new Date(value).toLocaleString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatWindow(start: string | null, end: string | null): string | null {
    if (!start && !end) {
        return null;
    }

    if (start && end) {
        return `${formatDate(start)} — ${formatDate(end)}`;
    }

    return formatDate((start ?? end) as string);
}

export function formatNumber(value: number): string {
    return new Intl.NumberFormat('es-MX').format(value);
}

/**
 * A delta exists only when both endpoints were observed. A null endpoint is not a zero to subtract
 * from: the difference between "30 sessions" and "the account did not answer" is not "-30".
 */
export function delta(current: number | null, previous: number | null): number | null {
    if (current === null || previous === null) {
        return null;
    }

    return current - previous;
}

export function formatDelta(value: number): string {
    if (value === 0) {
        return 'sin cambio';
    }

    return `${value > 0 ? '+' : '−'}${formatNumber(Math.abs(value))}`;
}
