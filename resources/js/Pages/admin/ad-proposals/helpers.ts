export const platformLabels: Record<string, string> = {
    meta: 'Meta Ads',
    google: 'Google Ads',
};

export const statusLabels: Record<string, string> = {
    draft: 'Borrador',
    approved: 'Aprobada',
    rejected: 'Rechazada',
    launched: 'Lanzada',
};

export const budgetPeriodLabels: Record<string, string> = {
    daily: 'diario',
    weekly: 'semanal',
    monthly: 'mensual',
    campaign: 'por campaña',
};

export function formatBudget(
    amount: string | null,
    currency: string,
    period: string | null,
): string {
    if (amount === null) {
        return '—';
    }

    const formatted = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(Number(amount));

    return period ? `${formatted} ${budgetPeriodLabels[period] ?? period}` : formatted;
}

export function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
