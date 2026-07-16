import { Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ArrowLeft,
    CheckCircle2,
    CircleSlash,
    FileText,
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
import type { GrowthTaskDetail, PageProps } from '@/types';
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
            <dt className="font-[Outfit] text-xs tracking-wide text-[#999999] uppercase">{label}</dt>
            <dd className="font-[Outfit] text-sm text-[#1A1A1A]">{children}</dd>
        </div>
    );
}

function ClosureProposal({ task }: { task: GrowthTaskDetail }) {
    const confirm = useForm({});
    const reject = useForm({});

    return (
        <Card className="border-[#E4D3B4] bg-[#FAF3E6] shadow-none">
            <CardHeader className="gap-1.5">
                <CardTitle className="font-[Outfit] text-sm font-medium text-[#7A6234]">
                    El agente cree que esta tarea ya está hecha, y no pudo probarlo.
                </CardTitle>
                {task.closure_proposal_reason !== null && (
                    <CardDescription className="font-[Outfit] text-sm whitespace-pre-line text-[#7A6234]">
                        {task.closure_proposal_reason}
                    </CardDescription>
                )}
                <p className="font-[Outfit] text-xs text-[#7A6234]">
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
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#4A5D4A] px-4 font-[Outfit] text-sm font-medium text-white transition-colors hover:bg-[#3D4D3D] disabled:opacity-50"
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
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-4 font-[Outfit] text-sm text-[#666666] transition-colors hover:bg-gray-50 disabled:opacity-50"
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
        <Card className="border-[#E5E5E5] bg-[#F9F8F6] shadow-none">
            <CardContent className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    {task.closed_by !== null && (
                        <span
                            title={closedByDescriptions[task.closed_by]}
                            className="inline-flex w-fit items-center gap-1.5 font-[Outfit] text-xs font-medium text-[#666666]"
                        >
                            {task.closed_by === 'human' ? (
                                <User className="h-3.5 w-3.5" />
                            ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            {closedByLabels[task.closed_by]}
                        </span>
                    )}
                    <p className="font-[Outfit] text-sm text-[#666666]">{evidence}</p>
                </div>
                <button
                    type="button"
                    disabled={reopen.processing}
                    onClick={() =>
                        reopen.post(`/admin/growth-plan/tasks/${task.id}/reopen`, {
                            preserveScroll: true,
                        })
                    }
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-4 font-[Outfit] text-sm text-[#666666] transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                    <RotateCcw className="h-4 w-4" />
                    Reabrir
                </button>
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
                        className="inline-flex w-fit items-center gap-1.5 font-[Outfit] text-sm text-[#666666] hover:text-[#1A1A1A]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Tablero de tareas
                    </Link>

                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex flex-col gap-1">
                            <h1 className="font-[Outfit] text-[28px] font-semibold text-[#1A1A1A]">
                                {task.name}
                            </h1>
                            <p className="font-[Outfit] text-sm text-[#666666]">{task.action}</p>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <Badge
                                variant="outline"
                                title={agentDescriptions[task.agent]}
                                className={`font-[Outfit] ${agentChipClasses[task.agent]}`}
                            >
                                {agentLabels[task.agent]}
                            </Badge>
                            <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-1 font-[Outfit] text-xs font-medium ${statusPillClasses[task.status]}`}
                            >
                                {statusLabels[task.status]}
                            </span>
                        </div>
                    </div>
                </div>

                <Card className="border-[#E5E5E5] bg-white shadow-none">
                    <CardHeader className="gap-2">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[#999999]" />
                            <CardTitle className="font-[Outfit] text-sm font-medium text-[#666666]">
                                La tarea, como la escribió el agente
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                        {/*
                         * Rendered whole and unwrapped, with the tagged facts that justify it left in.
                         * Nobody should pick up work they have not read.
                         */}
                        <p className="max-w-[80ch] font-[Outfit] text-sm leading-relaxed whitespace-pre-line text-[#1A1A1A]">
                            {task.body}
                        </p>

                        <Separator className="bg-[#E5E5E5]" />

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

                {task.closure_proposed && <ClosureProposal task={task} />}
                {task.status !== 'open' && <ClosedNote task={task} />}
            </div>
        </AppLayout>
    );
}
