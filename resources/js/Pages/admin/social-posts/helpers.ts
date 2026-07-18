import type { SocialPlatform, SocialPostStatus } from '@/types';

export const platformLabels: Record<SocialPlatform, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
};

export const statusLabels: Record<SocialPostStatus, string> = {
    pending: 'En revisión',
    publishing: 'Sin confirmar',
    published: 'Publicado',
    rejected: 'Descartado',
    failed: 'Falló',
};

/**
 * What each status actually means for the reader, in the one place both pages read it from.
 *
 * The distinction that matters is between the three ways a post is not public. "Descartado" means a
 * human said no. "Falló" means Meta said no. "Sin confirmar" means nobody knows: we sent the request
 * and never recorded the answer, so the post may well be live. Only that last one requires somebody
 * to go and look, and it is the only one where retrying can post twice.
 */
export const statusDescriptions: Record<SocialPostStatus, string> = {
    pending: 'Nadie lo ha enviado a Meta. Sigue siendo una propuesta.',
    publishing:
        'Se envió a Meta y no quedó registrada la respuesta. Puede estar publicado o no. Revisa la cuenta antes de volver a intentarlo: reintentar puede publicarlo dos veces.',
    published: 'Meta lo aceptó. Ya es público y no se puede deshacer desde aquí.',
    rejected: 'Una persona lo descartó. No se envió nada a Meta.',
    failed: 'Meta lo rechazó. No hay nada público.',
};

export const statusPillClasses: Record<SocialPostStatus, string> = {
    pending: 'border-muted bg-muted text-primary',
    publishing: 'border-border bg-muted text-muted-foreground',
    published: 'border-muted bg-primary text-white',
    rejected: 'border-border bg-muted text-muted-foreground',
    failed: 'border-destructive/20 bg-destructive/10 text-destructive',
};

export function formatDateTime(value: string | null): string {
    if (value === null) {
        return 'Sin fecha';
    }

    return new Date(value).toLocaleString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function truncate(value: string, length = 120): string {
    if (value.length <= length) {
        return value;
    }

    return `${value.slice(0, length).trimEnd()}…`;
}
