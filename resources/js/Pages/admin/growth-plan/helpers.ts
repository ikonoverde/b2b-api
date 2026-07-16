import type { GrowthBoardColumn, GrowthClosedBy, GrowthStatus, GrowthTaskAgent } from '@/types';

export const agentLabels: Record<GrowthTaskAgent, string> = {
    content: 'Contenido',
    keywords: 'SEO',
    'paid-acquisition': 'Pauta',
    'social-media': 'Redes',
    generic: 'Agente genérico',
    human: 'Persona',
};

/**
 * The split that carries the information. An agent-shaped task waits for nobody; a `human` task cannot
 * be done by any agent however capable, because the blocker is a body, a credential, or a signature.
 * Handing a human task to an agent does not fail cleanly — it comes back with something adjacent and
 * plausible.
 */
export const agentDescriptions: Record<GrowthTaskAgent, string> = {
    content: 'Blog, plan editorial, copy de tienda.',
    keywords: 'Investigación de búsqueda y clusters de contenido.',
    'paid-acquisition': 'Pauta, creativos, propuestas de campaña.',
    'social-media': 'Facebook e Instagram orgánicos, comunidad.',
    generic: 'Un agente puede hacerlo, pero ninguno de los especialistas es el indicado.',
    human: 'Ningún agente puede hacerlo. Requiere una persona: una foto real, una credencial, una firma.',
};

export const agentChipClasses: Record<GrowthTaskAgent, string> = {
    content: 'border-[#C8D3C8] bg-[#EEF2EE] text-[#3D4D3D]',
    keywords: 'border-[#C8D3C8] bg-[#EEF2EE] text-[#3D4D3D]',
    'paid-acquisition': 'border-[#C8D3C8] bg-[#EEF2EE] text-[#3D4D3D]',
    'social-media': 'border-[#C8D3C8] bg-[#EEF2EE] text-[#3D4D3D]',
    generic: 'border-[#E5E5E5] bg-[#F5F3F0] text-[#666666]',
    // A person has to pick this one up. It should not look like the ones that run themselves.
    human: 'border-[#E4D3B4] bg-[#FAF3E6] text-[#7A6234]',
};

export const statusLabels: Record<GrowthStatus, string> = {
    open: 'Abierta',
    done: 'Hecha',
    dropped: 'Descartada',
};

export const statusPillClasses: Record<GrowthStatus, string> = {
    open: 'border-[#E5E5E5] bg-white text-[#666666]',
    done: 'border-[#C8D3C8] bg-[#4A5D4A] text-white',
    dropped: 'border-[#E5E5E5] bg-[#F5F3F0] text-[#8A8A8A]',
};

/**
 * Who closed it, kept separate on purpose. A task closed by a report was measured; a task closed by a
 * person was asserted. Both are legitimate and they are not the same claim.
 */
export const closedByLabels: Record<GrowthClosedBy, string> = {
    report: 'Cerrada por el reporte',
    human: 'Cerrada por una persona',
};

export const closedByDescriptions: Record<GrowthClosedBy, string> = {
    report: 'Un reporte observó que el trabajo se hizo, y la evidencia quedó registrada.',
    human: 'Alguien confirmó que el trabajo se hizo. No hay una medición detrás.',
};

export const boardColumnLabels: Record<GrowthBoardColumn, string> = {
    todo: 'Por hacer',
    in_progress: 'En curso',
    review: 'En revisión',
    done: 'Hechas',
};

/**
 * What dropping a card on each column actually does. The board changes real state — En revisión leaves
 * la tarea abierta a la espera de una decisión, y Hechas la cierra a nombre de la persona que soltó la
 * tarjeta.
 */
export const boardColumnDescriptions: Record<GrowthBoardColumn, string> = {
    todo: 'Trabajo abierto que nadie ha tomado.',
    in_progress: 'Trabajo abierto que alguien ya tomó.',
    review: 'Alguien cree que ya está hecha. Sigue abierta hasta que una persona confirme el cierre.',
    done: 'Cerradas. Soltar una tarjeta aquí la cierra a tu nombre.',
};

export const paidGateLabels: Record<'open' | 'closed', string> = {
    open: 'Pauta permitida',
    closed: 'Sin pauta',
};

export function formatDate(value: string | null): string {
    if (value === null) {
        return 'Sin fecha';
    }

    return new Date(`${value}T00:00:00`).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
