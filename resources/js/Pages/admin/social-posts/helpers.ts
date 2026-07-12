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
    pending: 'border-[#C8D3C8] bg-[#EEF2EE] text-[#3D4D3D]',
    publishing: 'border-[#E4D3B4] bg-[#FAF3E6] text-[#7A6234]',
    published: 'border-[#C8D3C8] bg-[#4A5D4A] text-white',
    rejected: 'border-[#E5E5E5] bg-[#F5F3F0] text-[#8A8A8A]',
    failed: 'border-[#E8C4C4] bg-[#FBEFEF] text-[#8B4444]',
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
