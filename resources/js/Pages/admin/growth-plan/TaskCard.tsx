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
        <div className="flex flex-col gap-3 rounded-lg border border-[#E4D3B4] bg-[#FAF3E6] p-4">
            <div className="flex flex-col gap-1">
                <p className="font-[Outfit] text-sm font-medium text-[#7A6234]">
                    El agente cree que esta tarea ya está hecha, y no pudo probarlo.
                </p>
                <p className="font-[Outfit] text-sm whitespace-pre-line text-[#7A6234]">
                    {task.closure_proposal_reason}
                </p>
                <p className="font-[Outfit] text-xs text-[#7A6234]">
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
        <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-[#E5E5E5] bg-[#F9F8F6] p-4">
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
                    reopen.post(`/admin/growth-plan/tasks/${task.id}/reopen`, { preserveScroll: true })
                }
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-4 font-[Outfit] text-sm text-[#666666] transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
                <RotateCcw className="h-4 w-4" />
                Reabrir
            </button>
        </div>
    );
}

export function TaskCard({ task }: { task: GrowthTaskItem }) {
    return (
        <div className="flex flex-col gap-3 border-b border-[#E5E5E5] px-6 py-5 last:border-b-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h3 className="font-[Outfit] text-base font-medium text-[#1A1A1A]">{task.name}</h3>
                    <span className="font-[Outfit] text-xs text-[#999999]">
                        {task.source_report
                            ? `Razonada desde el reporte del ${task.source_report}`
                            : 'Sin reporte de origen'}
                    </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <span
                        title={agentDescriptions[task.agent]}
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 font-[Outfit] text-xs font-medium ${agentChipClasses[task.agent]}`}
                    >
                        {agentLabels[task.agent]}
                    </span>
                    <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 font-[Outfit] text-xs font-medium ${statusPillClasses[task.status]}`}
                    >
                        {statusLabels[task.status]}
                    </span>
                </div>
            </div>

            {/*
             * The body is rendered whole and unwrapped. Nobody should pick up work they have not read,
             * and the tagged facts that justify it are in here.
             */}
            <p className="max-w-[75ch] font-[Outfit] text-sm leading-relaxed whitespace-pre-line text-[#666666]">
                {task.body}
            </p>

            {task.closure_proposed && <ClosureProposal task={task} />}
            {task.status !== 'open' && <ClosedNote task={task} />}
        </div>
    );
}
