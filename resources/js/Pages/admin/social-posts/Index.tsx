import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ChevronLeft, ChevronRight, ExternalLink, Send } from 'lucide-react';
import type { SocialPostDraftListItem, SocialPostStatus, PageProps } from '@/types';
import { formatDateTime, platformLabels, statusLabels, truncate } from './helpers';
import { StatusPill } from './StatusPill';

interface PaginatedDrafts {
    data: SocialPostDraftListItem[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

interface Props extends PageProps {
    drafts: PaginatedDrafts;
    filters: { status: string };
    pendingCount: number;
}

const filters: Array<{ value: '' | SocialPostStatus; label: string }> = [
    { value: '', label: 'Todos' },
    { value: 'pending', label: statusLabels.pending },
    { value: 'published', label: statusLabels.published },
    { value: 'rejected', label: statusLabels.rejected },
    { value: 'failed', label: statusLabels.failed },
];

function buildUrl(status: string, page?: number): string {
    const params = new URLSearchParams();

    if (status !== '') {
        params.set('status', status);
    }

    if (page !== undefined) {
        params.set('page', String(page));
    }

    const query = params.toString();

    return query === '' ? '/admin/social-posts' : `/admin/social-posts?${query}`;
}

function DraftRow({ draft }: { draft: SocialPostDraftListItem }) {
    return (
        <tr className="border-b border-[#E5E5E5] last:border-b-0 hover:bg-gray-50">
            <td className="px-6 py-4">
                <Link href={`/admin/social-posts/${draft.id}`} className="flex items-start gap-3">
                    {draft.image_url ? (
                        <img
                            src={draft.image_url}
                            alt=""
                            className="h-12 w-12 shrink-0 rounded-lg border border-[#E5E5E5] object-cover"
                        />
                    ) : (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-[#E5E5E5] font-[Outfit] text-[10px] text-[#999999]">
                            Sin imagen
                        </span>
                    )}
                    <span className="flex flex-col gap-1">
                        <span className="font-[Outfit] text-sm text-[#1A1A1A] hover:underline">
                            {truncate(draft.caption)}
                        </span>
                        <span className="font-[Outfit] text-xs text-[#999999]">
                            {platformLabels[draft.platform]}
                        </span>
                    </span>
                </Link>
            </td>
            <td className="px-6 py-4">
                <StatusPill status={draft.status} />
            </td>
            <td className="px-6 py-4">
                <span className="font-[Outfit] text-sm text-[#666666]">{draft.reviewer ?? ''}</span>
            </td>
            <td className="px-6 py-4">
                <span className="font-[Outfit] text-sm text-[#666666]">
                    {formatDateTime(draft.created_at)}
                </span>
            </td>
            <td className="px-6 py-4">
                {draft.remote_permalink ? (
                    <a
                        href={draft.remote_permalink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-[Outfit] text-sm text-[#4A5D4A] hover:underline"
                    >
                        Ver publicación
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                ) : (
                    <span className="font-[Outfit] text-sm text-[#999999]">—</span>
                )}
            </td>
        </tr>
    );
}

/**
 * Pre-launch, an agent may have proposed nothing yet, and that is not a malfunction. Say what this
 * queue is for instead of reporting an absence.
 */
function EmptyState({ filtered }: { filtered: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <Send className="h-6 w-6 text-[#C9C5C0]" />
            <p className="font-[Outfit] text-sm font-medium text-[#1A1A1A]">
                {filtered ? 'Ningún borrador en este estado.' : 'Todavía no hay borradores.'}
            </p>
            <p className="max-w-md font-[Outfit] text-sm text-[#666666]">
                El agente de redes propone publicaciones aquí. Nada llega a Facebook o Instagram hasta
                que una persona lo aprueba en esta pantalla.
            </p>
        </div>
    );
}

function Pagination({ drafts, status }: { drafts: PaginatedDrafts; status: string }) {
    return (
        <div className="flex items-center justify-between border-t border-[#E5E5E5] px-6 py-4">
            <span className="font-[Outfit] text-sm text-[#666666]">
                Mostrando {drafts.from} a {drafts.to} de {drafts.total} borradores
            </span>
            <div className="flex items-center gap-2">
                <Link
                    href={buildUrl(status, drafts.current_page - 1)}
                    aria-label="Página anterior"
                    className={`rounded-lg border border-[#E5E5E5] p-2 ${
                        drafts.current_page === 1
                            ? 'pointer-events-none cursor-not-allowed opacity-50'
                            : 'hover:bg-gray-50'
                    }`}
                    preserveScroll
                >
                    <ChevronLeft className="h-4 w-4 text-[#666666]" />
                </Link>
                <span className="font-mono text-sm tabular-nums text-[#1A1A1A]">
                    {drafts.current_page} / {drafts.last_page}
                </span>
                <Link
                    href={buildUrl(status, drafts.current_page + 1)}
                    aria-label="Página siguiente"
                    className={`rounded-lg border border-[#E5E5E5] p-2 ${
                        drafts.current_page === drafts.last_page
                            ? 'pointer-events-none cursor-not-allowed opacity-50'
                            : 'hover:bg-gray-50'
                    }`}
                    preserveScroll
                >
                    <ChevronRight className="h-4 w-4 text-[#666666]" />
                </Link>
            </div>
        </div>
    );
}

export default function SocialPostsIndex() {
    const { drafts, filters: active, pendingCount } = usePage<Props>().props;

    return (
        <AppLayout title="Publicaciones sociales" active="social-posts">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <div className="flex flex-col gap-1">
                    <h1 className="font-[Outfit] text-[28px] font-semibold text-[#1A1A1A]">
                        Publicaciones sociales
                    </h1>
                    <p className="max-w-2xl font-[Outfit] text-sm text-[#666666]">
                        Lo que el agente propone publicar en Facebook e Instagram. Nada se publica solo:
                        Meta no tiene borradores ni deshacer, así que el borrador vive aquí y una persona
                        decide.
                        {pendingCount > 0 && ` ${pendingCount} en revisión.`}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {filters.map((filter) => (
                        <Link
                            key={filter.value || 'all'}
                            href={buildUrl(filter.value)}
                            className={`h-9 rounded-lg border px-4 font-[Outfit] text-sm leading-[2rem] transition-colors ${
                                active.status === filter.value
                                    ? 'border-[#4A5D4A] bg-[#4A5D4A] font-medium text-white'
                                    : 'border-[#E5E5E5] text-[#666666] hover:bg-gray-50'
                            }`}
                            preserveScroll
                        >
                            {filter.label}
                        </Link>
                    ))}
                </div>

                <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
                    {drafts.data.length === 0 ? (
                        <EmptyState filtered={active.status !== ''} />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-[#E5E5E5]">
                                        {['Borrador', 'Estado', 'Revisó', 'Creado', 'Meta'].map((label) => (
                                            <th key={label} className="px-6 py-4 text-left">
                                                <span className="font-[Outfit] text-sm font-medium text-[#666666]">
                                                    {label}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {drafts.data.map((draft) => (
                                        <DraftRow key={draft.id} draft={draft} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {drafts.last_page > 1 && <Pagination drafts={drafts} status={active.status} />}
                </div>
            </div>
        </AppLayout>
    );
}
