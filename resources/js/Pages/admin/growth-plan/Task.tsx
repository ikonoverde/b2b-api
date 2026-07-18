import { Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ArrowLeft,
    CheckCircle2,
    CircleSlash,
    ExternalLink,
    FileText,
    Package,
    RotateCcw,
    User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { GrowthTaskArtifact, GrowthTaskDetail, PageProps } from '@/types';
import {
    agentChipClasses,
    agentDescriptions,
    agentLabels,
    boardColumnLabels,
    closedByDescriptions,
    closedByLabels,
    statusLabels,
    statusPillClasses,
} from './helpers';

interface Props extends PageProps {
    task: GrowthTaskDetail;
}

function formatDateTime(value: string | null): string {
    if (value === null) {
        return '—';
    }

    return new Date(value).toLocaleString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
            <dd className="text-sm text-foreground">{children}</dd>
        </div>
    );
}

function ClosureProposal({ task }: { task: GrowthTaskDetail }) {
    const confirm = useForm({});
    const reject = useForm({});

    return (
        <Card className="border-border bg-muted shadow-none">
            <CardHeader className="gap-1.5">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    El agente cree que esta tarea ya está hecha, y no pudo probarlo.
                </CardTitle>
                {task.closure_proposal_reason !== null && (
                    <CardDescription className="text-sm whitespace-pre-line text-muted-foreground">
                        {task.closure_proposal_reason}
                    </CardDescription>
                )}
                <p className="text-xs text-muted-foreground">
                    La tarea sigue abierta. Solo una persona puede cerrarla desde aquí.
                </p>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    disabled={confirm.processing}
                    onClick={() =>
                        confirm.post(`/admin/growth-plan/tasks/${task.id}/confirm-closure`, {
                            preserveScroll: true,
                        })
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary disabled:opacity-50"
                >
                    <CheckCircle2 className="h-4 w-4" />
                    Sí, ya se hizo
                </button>
                <button
                    type="button"
                    disabled={reject.processing}
                    onClick={() =>
                        reject.post(`/admin/growth-plan/tasks/${task.id}/reject-closure`, {
                            preserveScroll: true,
                        })
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                >
                    <CircleSlash className="h-4 w-4" />
                    No, sigue pendiente
                </button>
            </CardContent>
        </Card>
    );
}

function ClosedNote({ task }: { task: GrowthTaskDetail }) {
    const reopen = useForm({});

    const evidence =
        task.status === 'dropped'
            ? task.drop_reason
            : (task.close_evidence ?? 'Sin evidencia registrada.');

    return (
        <Card className="border-border bg-background shadow-none">
            <CardContent className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    {task.closed_by !== null && (
                        <span
                            title={closedByDescriptions[task.closed_by]}
                            className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground"
                        >
                            {task.closed_by === 'human' ? (
                                <User className="h-3.5 w-3.5" />
                            ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            {closedByLabels[task.closed_by]}
                        </span>
                    )}
                    <p className="text-sm text-muted-foreground">{evidence}</p>
                </div>
                <button
                    type="button"
                    disabled={reopen.processing}
                    onClick={() =>
                        reopen.post(`/admin/growth-plan/tasks/${task.id}/reopen`, {
                            preserveScroll: true,
                        })
                    }
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                >
                    <RotateCcw className="h-4 w-4" />
                    Reabrir
                </button>
            </CardContent>
        </Card>
    );
}

function ArtifactRow({ artifact }: { artifact: GrowthTaskArtifact }) {
    const content = (
        <>
            <div className="flex flex-col gap-0.5">
                <span className="text-sm text-foreground">{artifact.title}</span>
                <span className="text-xs text-muted-foreground">
                    {formatDateTime(artifact.created_at)}
                </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                <Badge
                    variant="outline"
                    className="border-muted bg-muted text-primary"
                >
                    {artifact.label}
                </Badge>
                {artifact.url !== null && (
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                )}
            </div>
        </>
    );

    if (artifact.url !== null) {
        return (
            <Link
                href={artifact.url}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-background"
            >
                {content}
            </Link>
        );
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
            {content}
        </div>
    );
}

function ArtifactsCard({ artifacts }: { artifacts: GrowthTaskArtifact[] }) {
    return (
        <Card className="border-border bg-card shadow-none">
            <CardHeader className="gap-2">
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Artefactos generados
                    </CardTitle>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                    Lo que el agente filó al ejecutar esta tarea. Cada uno sigue siendo un borrador o
                    propuesta hasta que una persona lo apruebe.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {artifacts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Este run todavía no ha generado nada.
                    </p>
                ) : (
                    artifacts.map((artifact) => (
                        <ArtifactRow key={`${artifact.type}-${artifact.title}-${artifact.created_at}`} artifact={artifact} />
                    ))
                )}
            </CardContent>
        </Card>
    );
}

export default function GrowthTaskShow() {
    const { task } = usePage<Props>().props;

    return (
        <AppLayout title={task.name} active="growth-plan">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <div className="flex flex-col gap-3">
                    <Link
                        href="/admin/growth-plan/board"
                        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Tablero de tareas
                    </Link>

                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-[28px] font-semibold text-foreground">
                                {task.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">{task.action}</p>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <Badge
                                variant="outline"
                                title={agentDescriptions[task.agent]}
                                className={`${agentChipClasses[task.agent]}`}
                            >
                                {agentLabels[task.agent]}
                            </Badge>
                            <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusPillClasses[task.status]}`}
                            >
                                {statusLabels[task.status]}
                            </span>
                        </div>
                    </div>
                </div>

                <Card className="border-border bg-card shadow-none">
                    <CardHeader className="gap-2">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                La tarea, como la escribió el agente
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                        {/*
                         * Rendered whole and unwrapped, with the tagged facts that justify it left in.
                         * Nobody should pick up work they have not read.
                         */}
                        <p className="max-w-[80ch] text-sm leading-relaxed whitespace-pre-line text-foreground">
                            {task.body}
                        </p>

                        <Separator className="bg-border" />

                        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                            <MetaRow label="Columna">
                                {task.column !== null ? boardColumnLabels[task.column] : 'Descartada'}
                            </MetaRow>
                            <MetaRow label="Reporte de origen">
                                {task.source_report ?? 'Sin reporte'}
                            </MetaRow>
                            <MetaRow label="Tomada">{formatDateTime(task.started_at)}</MetaRow>
                            {task.closed_at !== null && (
                                <MetaRow label="Cerrada">{formatDateTime(task.closed_at)}</MetaRow>
                            )}
                        </dl>
                    </CardContent>
                </Card>

                <ArtifactsCard artifacts={task.artifacts} />

                {task.closure_proposed && <ClosureProposal task={task} />}
                {task.status !== 'open' && <ClosedNote task={task} />}
            </div>
        </AppLayout>
    );
}
