import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { AlertCircle, ArrowRight, Compass, TrendingUp } from 'lucide-react';
import type {
    GrowthActionItem,
    GrowthPaidGate,
    GrowthPlanRun,
    PageProps,
} from '@/types';
import { formatDate, paidGateLabels, statusLabels, statusPillClasses } from './helpers';
import { TaskCard } from './TaskCard';

interface Props extends PageProps {
    paidGate: GrowthPaidGate | null;
    actions: GrowthActionItem[];
    runs: GrowthPlanRun[];
    awaitingDecisionCount: number;
}

/**
 * The verdict, not a badge. A gate that shut is only meaningful next to the reason it shut and the
 * conditions that would open it, and those are the checklist somebody has to satisfy — so they are on
 * the page, not behind a tooltip.
 */
function PaidGateBanner({ gate }: { gate: GrowthPaidGate }) {
    const closed = gate.verdict === 'closed';

    return (
        <div
            className={`flex flex-col gap-3 rounded-xl border p-6 ${
                closed ? 'border-[#E4D3B4] bg-[#FAF3E6]' : 'border-[#C8D3C8] bg-[#EEF2EE]'
            }`}
        >
            <div className="flex items-center gap-2">
                <TrendingUp className={`h-4 w-4 ${closed ? 'text-[#7A6234]' : 'text-[#3D4D3D]'}`} />
                <h2
                    className={`font-[Outfit] text-sm font-semibold ${
                        closed ? 'text-[#7A6234]' : 'text-[#3D4D3D]'
                    }`}
                >
                    {paidGateLabels[gate.verdict]}
                </h2>
                <span className="font-[Outfit] text-xs text-[#999999]">
                    Decidido el {formatDate(gate.decided_on)}
                </span>
            </div>

            <p
                className={`max-w-[75ch] font-[Outfit] text-sm leading-relaxed whitespace-pre-line ${
                    closed ? 'text-[#7A6234]' : 'text-[#3D4D3D]'
                }`}
            >
                {gate.reason}
            </p>

            {gate.preconditions.length > 0 && (
                <div className="flex flex-col gap-1.5">
                    <span
                        className={`font-[Outfit] text-xs font-medium ${
                            closed ? 'text-[#7A6234]' : 'text-[#3D4D3D]'
                        }`}
                    >
                        {closed ? 'Para abrir la pauta:' : 'Condiciones del gasto:'}
                    </span>
                    <ul className="flex flex-col gap-1">
                        {gate.preconditions.map((precondition) => (
                            <li
                                key={precondition}
                                className={`font-[Outfit] text-sm ${
                                    closed ? 'text-[#7A6234]' : 'text-[#3D4D3D]'
                                }`}
                            >
                                • {precondition}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function ActionCard({ action }: { action: GrowthActionItem }) {
    return (
        <section className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E5E5E5] px-6 py-5">
                <div className="flex flex-col gap-1">
                    <h2 className="font-[Outfit] text-lg font-semibold text-[#1A1A1A]">{action.name}</h2>
                    {action.summary !== null && (
                        <p className="max-w-[75ch] font-[Outfit] text-sm text-[#666666]">
                            {action.summary}
                        </p>
                    )}
                </div>
                <span
                    className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 font-[Outfit] text-xs font-medium ${statusPillClasses[action.status]}`}
                >
                    {statusLabels[action.status]}
                </span>
            </header>

            <div className="flex flex-col">
                {action.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </section>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-6 py-16 text-center">
            <Compass className="h-6 w-6 text-[#C9C5C0]" />
            <p className="font-[Outfit] text-sm font-medium text-[#1A1A1A]">Todavía no hay un plan.</p>
            <p className="max-w-md font-[Outfit] text-sm text-[#666666]">
                El plan se escribe a partir de un reporte de marketing observado. Genera uno con{' '}
                <code className="rounded bg-[#F5F3F0] px-1.5 py-0.5 font-mono text-xs">
                    php artisan growth:plan
                </code>
                , y el agente leerá el último reporte y propondrá el trabajo.
            </p>
        </div>
    );
}

function RunsTable({ runs }: { runs: GrowthPlanRun[] }) {
    return (
        <section className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
            <header className="border-b border-[#E5E5E5] px-6 py-4">
                <h2 className="font-[Outfit] text-sm font-medium text-[#666666]">
                    Cómo se llegó hasta aquí
                </h2>
            </header>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                    <thead>
                        <tr className="border-b border-[#E5E5E5]">
                            {['Plan', 'Reporte base', 'Pauta', 'Creó', ''].map((label, index) => (
                                <th key={label || index} className="px-6 py-3 text-left">
                                    <span className="font-[Outfit] text-xs font-medium text-[#999999]">
                                        {label}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {runs.map((run) => (
                            <tr
                                key={run.id}
                                className="border-b border-[#E5E5E5] last:border-b-0 hover:bg-gray-50"
                            >
                                <td className="px-6 py-4">
                                    <span className="font-[Outfit] text-sm text-[#1A1A1A]">
                                        {formatDate(run.planned_on)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-[Outfit] text-sm text-[#666666]">
                                        {formatDate(run.source_report)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-[Outfit] text-sm text-[#666666]">
                                        {paidGateLabels[run.paid_gate]}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-[Outfit] text-sm text-[#666666]">
                                        {run.created_tasks_count} tareas
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/growth-plan/runs/${run.id}`}
                                        className="inline-flex items-center gap-1.5 font-[Outfit] text-sm text-[#4A5D4A] hover:underline"
                                    >
                                        Leer
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default function GrowthPlanIndex() {
    const { paidGate, actions, runs, awaitingDecisionCount } = usePage<Props>().props;

    return (
        <AppLayout title="Plan de crecimiento" active="growth-plan">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <div className="flex flex-col gap-1">
                    <h1 className="font-[Outfit] text-[28px] font-semibold text-[#1A1A1A]">
                        Plan de crecimiento
                    </h1>
                    <p className="max-w-2xl font-[Outfit] text-sm text-[#666666]">
                        El trabajo que el agente propone a partir del último reporte observado. Nada de
                        esto se ejecuta solo: son tareas para que alguien las tome.
                    </p>
                </div>

                {awaitingDecisionCount > 0 && (
                    <div className="flex items-center gap-2 rounded-xl border border-[#E4D3B4] bg-[#FAF3E6] px-6 py-4">
                        <AlertCircle className="h-4 w-4 shrink-0 text-[#7A6234]" />
                        <p className="font-[Outfit] text-sm text-[#7A6234]">
                            {awaitingDecisionCount === 1
                                ? 'Una tarea espera tu decisión: el agente cree que ya está hecha y no pudo probarlo.'
                                : `${awaitingDecisionCount} tareas esperan tu decisión: el agente cree que ya están hechas y no pudo probarlo.`}
                        </p>
                    </div>
                )}

                {paidGate !== null && <PaidGateBanner gate={paidGate} />}

                {actions.length === 0 ? (
                    <EmptyState />
                ) : (
                    actions.map((action) => <ActionCard key={action.id} action={action} />)
                )}

                {runs.length > 0 && <RunsTable runs={runs} />}
            </div>
        </AppLayout>
    );
}
