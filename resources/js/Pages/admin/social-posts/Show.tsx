import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { AlertTriangle, ArrowLeft, CheckCircle2, ExternalLink, Send } from 'lucide-react';
import type { SocialPostDraftDetail, PageProps } from '@/types';
import { formatDateTime, platformLabels, statusDescriptions } from './helpers';
import { StatusPill } from './StatusPill';

interface Props extends PageProps {
    draft: SocialPostDraftDetail;
}

function Flash({ flash }: { flash: NonNullable<PageProps['flash']> }) {
    const message = flash.success ?? flash.error;

    if (message === undefined) {
        return null;
    }

    const isSuccess = flash.success !== undefined;
    const Icon = isSuccess ? CheckCircle2 : AlertTriangle;

    return (
        <div
            className={`flex items-start gap-3 rounded-xl border px-5 py-4 ${
                isSuccess
                    ? 'border-muted bg-muted text-primary'
                    : 'border-destructive/20 bg-destructive/10 text-destructive'
            }`}
        >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-sm">{message}</p>
        </div>
    );
}

/**
 * The caption as the reader will meet it: whole, unwrapped, and in the account's voice.
 *
 * A reviewer approving a public post has to be able to read the exact text that will ship. Nothing
 * here is truncated or summarized, because the one thing that must not happen is a human approving
 * words they did not actually see.
 */
function PostPreview({ draft }: { draft: SocialPostDraftDetail }) {
    return (
        <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">
                La publicación, tal como saldría
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
                {draft.image_url && (
                    <img
                        src={draft.image_url}
                        alt=""
                        className="max-h-[420px] w-full border-b border-border object-cover"
                    />
                )}
                <div className="flex flex-col gap-4 px-8 py-7">
                    <p className="max-w-[65ch] whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
                        {draft.caption}
                    </p>
                    {draft.link && (
                        <a
                            href={draft.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex w-fit items-center gap-1.5 text-sm text-primary hover:underline"
                        >
                            {draft.link}
                            <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                    )}
                </div>
            </div>
            {draft.requires_image && draft.image_url === null && (
                <p className="text-xs text-destructive">
                    Instagram no acepta publicaciones sin imagen. Este borrador no se puede publicar
                    hasta que tenga una.
                </p>
            )}
        </section>
    );
}

function Notes({ draft }: { draft: SocialPostDraftDetail }) {
    if (draft.rationale === null && draft.brand_review === null) {
        return null;
    }

    return (
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card px-8 py-7">
            {draft.rationale && (
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Por qué esta publicación
                    </h3>
                    <p className="max-w-[70ch] whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {draft.rationale}
                    </p>
                </div>
            )}
            {draft.brand_review && (
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Revisión de marca
                    </h3>
                    <p className="max-w-[70ch] whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {draft.brand_review}
                    </p>
                </div>
            )}
        </section>
    );
}

/**
 * Publishing is the only thing on this screen that cannot be undone, so it is the only thing that
 * asks twice. The second step is inline and states the consequence in plain words: a reviewer who
 * clicks through it has been told, in the same breath, that Meta has no undo.
 */
function PublishActions({ draft }: { draft: SocialPostDraftDetail }) {
    const [confirming, setConfirming] = useState(false);
    const [rejecting, setRejecting] = useState(false);

    const publish = useForm({});
    const reject = useForm({ rejection_reason: '' });

    if (!draft.is_publishable && draft.status === 'pending') {
        return (
            <p className="text-sm text-muted-foreground">
                Este borrador todavía no se puede publicar.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {!confirming && !rejecting && (
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() => setConfirming(true)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary"
                    >
                        <Send className="h-4 w-4" />
                        Publicar en {platformLabels[draft.platform]}
                    </button>
                    <button
                        type="button"
                        onClick={() => setRejecting(true)}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm text-muted-foreground transition-colors hover:bg-muted"
                    >
                        Descartar
                    </button>
                </div>
            )}

            {confirming && (
                <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted p-4">
                    <p className="text-sm text-muted-foreground">
                        Esto se publica de inmediato en {platformLabels[draft.platform]} y queda a la
                        vista de cualquiera. Meta no tiene deshacer: para bajarlo tendrás que entrar a
                        la cuenta.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            disabled={publish.processing}
                            onClick={() =>
                                publish.post(`/admin/social-posts/${draft.id}/publish`, {
                                    preserveScroll: true,
                                    onFinish: () => setConfirming(false),
                                })
                            }
                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary disabled:opacity-60"
                        >
                            <Send className="h-4 w-4" />
                            {publish.processing ? 'Publicando...' : 'Sí, publicar ahora'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setConfirming(false)}
                            disabled={publish.processing}
                            className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-4 text-sm text-muted-foreground transition-colors hover:bg-muted"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {rejecting && (
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        reject.post(`/admin/social-posts/${draft.id}/reject`, {
                            preserveScroll: true,
                            onSuccess: () => setRejecting(false),
                        });
                    }}
                    className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4"
                >
                    <label
                        htmlFor="rejection_reason"
                        className="text-sm font-medium text-foreground"
                    >
                        ¿Por qué se descarta?
                    </label>
                    <textarea
                        id="rejection_reason"
                        value={reject.data.rejection_reason}
                        onChange={(event) => reject.setData('rejection_reason', event.target.value)}
                        rows={3}
                        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                        placeholder="Lo que escribas aquí es lo único que le dice al siguiente borrador qué evitar."
                    />
                    {reject.errors.rejection_reason && (
                        <p className="text-xs text-destructive">
                            {reject.errors.rejection_reason}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="submit"
                            disabled={reject.processing}
                            className="inline-flex h-10 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-white transition-colors hover:bg-foreground disabled:opacity-60"
                        >
                            {reject.processing ? 'Descartando...' : 'Descartar borrador'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setRejecting(false)}
                            disabled={reject.processing}
                            className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-4 text-sm text-muted-foreground transition-colors hover:bg-muted"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

function Record({ draft }: { draft: SocialPostDraftDetail }) {
    const rows: Array<{ label: string; value: React.ReactNode }> = [
        { label: 'Plataforma', value: platformLabels[draft.platform] },
        { label: 'Creado', value: formatDateTime(draft.created_at) },
    ];

    if (draft.proposed_for) {
        rows.push({ label: 'Sugerido para', value: formatDateTime(draft.proposed_for) });
    }

    if (draft.reviewer) {
        rows.push({ label: 'Revisó', value: draft.reviewer });
    }

    if (draft.reviewed_at) {
        rows.push({ label: 'Revisado', value: formatDateTime(draft.reviewed_at) });
    }

    if (draft.published_at) {
        rows.push({ label: 'Publicado', value: formatDateTime(draft.published_at) });
    }

    if (draft.remote_post_id) {
        rows.push({
            label: 'ID en Meta',
            value: <span className="font-mono text-xs">{draft.remote_post_id}</span>,
        });
    }

    return (
        <div className="flex flex-col gap-4">
            <dl className="flex flex-col gap-3">
                {rows.map((row) => (
                    <div key={row.label} className="flex flex-col gap-0.5">
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {row.label}
                        </dt>
                        <dd className="text-sm text-foreground">{row.value}</dd>
                    </div>
                ))}
            </dl>

            {draft.remote_permalink && (
                <a
                    href={draft.remote_permalink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit items-center gap-1.5 text-sm text-primary hover:underline"
                >
                    Ver en {platformLabels[draft.platform]}
                    <ExternalLink className="h-3.5 w-3.5" />
                </a>
            )}
        </div>
    );
}

export default function SocialPostShow() {
    const { draft, flash } = usePage<Props>().props;

    return (
        <AppLayout title={`Borrador · ${platformLabels[draft.platform]}`} active="social-posts">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <Link
                    href="/admin/social-posts"
                    className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Publicaciones sociales
                </Link>

                <div className="flex flex-col gap-2">
                    <h1 className="text-[28px] font-semibold text-foreground">
                        Borrador para {platformLabels[draft.platform]}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <StatusPill status={draft.status} />
                        <span className="max-w-2xl text-sm text-muted-foreground">
                            {statusDescriptions[draft.status]}
                        </span>
                    </div>
                </div>

                {flash && <Flash flash={flash} />}

                {draft.publish_error && (
                    <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 px-5 py-4">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-destructive">
                                Meta rechazó la publicación. No hay nada público.
                            </p>
                            <p className="font-mono text-xs leading-relaxed text-destructive/85">
                                {draft.publish_error}
                            </p>
                        </div>
                    </div>
                )}

                {draft.rejection_reason && (
                    <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted px-5 py-4">
                        <p className="text-sm font-medium text-foreground">
                            Descartado
                        </p>
                        <p className="text-sm text-muted-foreground">{draft.rejection_reason}</p>
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="flex flex-col gap-6">
                        <PostPreview draft={draft} />
                        <Notes draft={draft} />
                    </div>

                    <aside className="flex flex-col gap-6 self-start rounded-xl border border-border bg-card p-6">
                        {draft.status === 'pending' && <PublishActions draft={draft} />}
                        <Record draft={draft} />
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
