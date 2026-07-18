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
        <tr className="border-b border-border last:border-b-0 hover:bg-muted">
            <td className="px-6 py-4">
                <Link href={`/admin/social-posts/${draft.id}`} className="flex items-start gap-3">
                    {draft.image_url ? (
                        <img
                            src={draft.image_url}
                            alt=""
                            className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover"
                        />
                    ) : (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-[10px] text-muted-foreground">
                            Sin imagen
                        </span>
                    )}
                    <span className="flex flex-col gap-1">
                        <span className="text-sm text-foreground hover:underline">
                            {truncate(draft.caption)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {platformLabels[draft.platform]}
                        </span>
                    </span>
                </Link>
            </td>
            <td className="px-6 py-4">
                <StatusPill status={draft.status} />
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground">{draft.reviewer ?? ''}</span>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground">
                    {formatDateTime(draft.created_at)}
                </span>
            </td>
            <td className="px-6 py-4">
                {draft.remote_permalink ? (
                    <a
                        href={draft.remote_permalink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                        Ver publicación
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                ) : (
                    <span className="text-sm text-muted-foreground">—</span>
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
            <Send className="h-6 w-6 text-border" />
            <p className="text-sm font-medium text-foreground">
                {filtered ? 'Ningún borrador en este estado.' : 'Todavía no hay borradores.'}
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
                El agente de redes propone publicaciones aquí. Nada llega a Facebook o Instagram hasta
                que una persona lo aprueba en esta pantalla.
            </p>
        </div>
    );
}

function Pagination({ drafts, status }: { drafts: PaginatedDrafts; status: string }) {
    return (
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <span className="text-sm text-muted-foreground">
                Mostrando {drafts.from} a {drafts.to} de {drafts.total} borradores
            </span>
            <div className="flex items-center gap-2">
                <Link
                    href={buildUrl(status, drafts.current_page - 1)}
                    aria-label="Página anterior"
                    className={`rounded-lg border border-border p-2 ${
                        drafts.current_page === 1
                            ? 'pointer-events-none cursor-not-allowed opacity-50'
                            : 'hover:bg-muted'
                    }`}
                    preserveScroll
                >
                    <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                </Link>
                <span className="font-mono text-sm tabular-nums text-foreground">
                    {drafts.current_page} / {drafts.last_page}
                </span>
                <Link
                    href={buildUrl(status, drafts.current_page + 1)}
                    aria-label="Página siguiente"
                    className={`rounded-lg border border-border p-2 ${
                        drafts.current_page === drafts.last_page
                            ? 'pointer-events-none cursor-not-allowed opacity-50'
                            : 'hover:bg-muted'
                    }`}
                    preserveScroll
                >
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
                    <h1 className="text-[28px] font-semibold text-foreground">
                        Publicaciones sociales
                    </h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
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
                            className={`h-9 rounded-lg border px-4 text-sm leading-[2rem] transition-colors ${
                                active.status === filter.value
                                    ? 'border-primary bg-primary font-medium text-white'
                                    : 'border-border text-muted-foreground hover:bg-muted'
                            }`}
                            preserveScroll
                        >
                            {filter.label}
                        </Link>
                    ))}
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    {drafts.data.length === 0 ? (
                        <EmptyState filtered={active.status !== ''} />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-border">
                                        {['Borrador', 'Estado', 'Revisó', 'Creado', 'Meta'].map((label) => (
                                            <th key={label} className="px-6 py-4 text-left">
                                                <span className="text-sm font-medium text-muted-foreground">
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
