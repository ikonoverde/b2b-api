import { useForm } from '@inertiajs/react';
import { CheckCircle2, CircleSlash, RotateCcw, User } from 'lucide-react';
import type { GrowthTaskItem } from '@/types';
import {
    agentChipClasses,
    agentDescriptions,
    agentLabels,
    closedByDescriptions,
    closedByLabels,
    statusLabels,
    statusPillClasses,
} from './helpers';

function ClosureProposal({ task }: { task: GrowthTaskItem }) {
    const confirm = useForm({});
    const reject = useForm({});

    return (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted p-4">
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-muted-foreground">
                    El agente cree que esta tarea ya está hecha, y no pudo probarlo.
                </p>
                <p className="text-sm whitespace-pre-line text-muted-foreground">
                    {task.closure_proposal_reason}
                </p>
                <p className="text-xs text-muted-foreground">
                    La tarea sigue abierta. Solo una persona puede cerrarla desde aquí.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
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
            </div>
        </div>
    );
}

function ClosedNote({ task }: { task: GrowthTaskItem }) {
    const reopen = useForm({});

    const evidence =
        task.status === 'dropped'
            ? task.drop_reason
            : (task.close_evidence ?? 'Sin evidencia registrada.');

    return (
        <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border bg-background p-4">
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
                    reopen.post(`/admin/growth-plan/tasks/${task.id}/reopen`, { preserveScroll: true })
                }
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
                <RotateCcw className="h-4 w-4" />
                Reabrir
            </button>
        </div>
    );
}

export function TaskCard({ task }: { task: GrowthTaskItem }) {
    return (
        <div className="flex flex-col gap-3 border-b border-border px-6 py-5 last:border-b-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h3 className="text-base font-medium text-foreground">{task.name}</h3>
                    <span className="text-xs text-muted-foreground">
                        {task.source_report
                            ? `Razonada desde el reporte del ${task.source_report}`
                            : 'Sin reporte de origen'}
                    </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <span
                        title={agentDescriptions[task.agent]}
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${agentChipClasses[task.agent]}`}
                    >
                        {agentLabels[task.agent]}
                    </span>
                    <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusPillClasses[task.status]}`}
                    >
                        {statusLabels[task.status]}
                    </span>
                </div>
            </div>

            {/*
             * The body is rendered whole and unwrapped. Nobody should pick up work they have not read,
             * and the tagged facts that justify it are in here.
             */}
            <p className="max-w-[75ch] text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                {task.body}
            </p>

            {task.closure_proposed && <ClosureProposal task={task} />}
            {task.status !== 'open' && <ClosedNote task={task} />}
        </div>
    );
}
