import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, Compass, Kanban, TrendingUp } from 'lucide-react';
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
                closed ? 'border-border bg-muted' : 'border-muted bg-muted'
            }`}
        >
            <div className="flex items-center gap-2">
                <TrendingUp className={`h-4 w-4 ${closed ? 'text-muted-foreground' : 'text-primary'}`} />
                <h2
                    className={`text-sm font-semibold ${
                        closed ? 'text-muted-foreground' : 'text-primary'
                    }`}
                >
                    {paidGateLabels[gate.verdict]}
                </h2>
                <span className="text-xs text-muted-foreground">
                    Decidido el {formatDate(gate.decided_on)}
                </span>
            </div>

            <p
                className={`max-w-[75ch] text-sm leading-relaxed whitespace-pre-line ${
                    closed ? 'text-muted-foreground' : 'text-primary'
                }`}
            >
                {gate.reason}
            </p>

            {gate.preconditions.length > 0 && (
                <div className="flex flex-col gap-1.5">
                    <span
                        className={`text-xs font-medium ${
                            closed ? 'text-muted-foreground' : 'text-primary'
                        }`}
                    >
                        {closed ? 'Para abrir la pauta:' : 'Condiciones del gasto:'}
                    </span>
                    <ul className="flex flex-col gap-1">
                        {gate.preconditions.map((precondition) => (
                            <li
                                key={precondition}
                                className={`text-sm ${
                                    closed ? 'text-muted-foreground' : 'text-primary'
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
        <section className="overflow-hidden rounded-xl border border-border bg-card">
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-6 py-5">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-foreground">{action.name}</h2>
                    {action.summary !== null && (
                        <p className="max-w-[75ch] text-sm text-muted-foreground">
                            {action.summary}
                        </p>
                    )}
                </div>
                <span
                    className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusPillClasses[action.status]}`}
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
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-16 text-center">
            <Compass className="h-6 w-6 text-border" />
            <p className="text-sm font-medium text-foreground">Todavía no hay un plan.</p>
            <p className="max-w-md text-sm text-muted-foreground">
                El plan se escribe a partir de un reporte de marketing observado. Genera uno con{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    php artisan growth:plan
                </code>
                , y el agente leerá el último reporte y propondrá el trabajo.
            </p>
        </div>
    );
}

function RunsTable({ runs }: { runs: GrowthPlanRun[] }) {
    return (
        <section className="overflow-hidden rounded-xl border border-border bg-card">
            <header className="border-b border-border px-6 py-4">
                <h2 className="text-sm font-medium text-muted-foreground">
                    Cómo se llegó hasta aquí
                </h2>
            </header>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                    <thead>
                        <tr className="border-b border-border">
                            {['Plan', 'Reporte base', 'Pauta', 'Creó', ''].map((label, index) => (
                                <th key={label || index} className="px-6 py-3 text-left">
                                    <span className="text-xs font-medium text-muted-foreground">
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
                                className="border-b border-border last:border-b-0 hover:bg-muted"
                            >
                                <td className="px-6 py-4">
                                    <span className="text-sm text-foreground">
                                        {formatDate(run.planned_on)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-muted-foreground">
                                        {formatDate(run.source_report)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-muted-foreground">
                                        {paidGateLabels[run.paid_gate]}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-muted-foreground">
                                        {run.created_tasks_count} tareas
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/growth-plan/runs/${run.id}`}
                                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
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
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[28px] font-semibold text-foreground">
                            Plan de crecimiento
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground">
                            El trabajo que el agente propone a partir del último reporte observado. Nada
                            de esto se ejecuta solo: son tareas para que alguien las tome.
                        </p>
                    </div>
                    <Button asChild variant="outline" className="">
                        <Link href="/admin/growth-plan/board">
                            <Kanban data-icon="inline-start" />
                            Tablero de tareas
                        </Link>
                    </Button>
                </div>

                {awaitingDecisionCount > 0 && (
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-6 py-4">
                        <AlertCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
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
