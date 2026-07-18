import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeft, FileText } from 'lucide-react';
import type { GrowthPlanDetail, GrowthTouchedTask, PageProps } from '@/types';
import { agentLabels, formatDate, paidGateLabels, statusLabels, statusPillClasses } from './helpers';

interface Props extends PageProps {
    plan: GrowthPlanDetail;
    touchedTasks: GrowthTouchedTask[];
}

export default function GrowthPlanShow() {
    const { plan, touchedTasks } = usePage<Props>().props;

    return (
        <AppLayout title={`Plan del ${plan.planned_on}`} active="growth-plan">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <div className="flex flex-col gap-3">
                    <Link
                        href="/admin/growth-plan"
                        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Plan de crecimiento
                    </Link>

                    <h1 className="text-[28px] font-semibold text-foreground">
                        Plan del {formatDate(plan.planned_on)}
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Razonado desde el reporte del{' '}
                        <Link
                            href={`/admin/marketing-reports/${plan.source_report.id}`}
                            className="text-primary hover:underline"
                        >
                            {formatDate(plan.source_report.reported_on)}
                        </Link>
                        . Todo lo que se propone aquí sale de esos números.
                    </p>
                </div>

                <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h2 className="text-sm font-medium text-muted-foreground">
                            La recomendación, como la escribió el agente
                        </h2>
                    </div>

                    {/*
                     * Rendered whole and unwrapped, with the provenance tags left in it. Stripping them
                     * for readability is how an estimate turns into a historical fact.
                     */}
                    <pre className="max-w-[80ch] text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                        {plan.body}
                    </pre>
                </section>

                <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
                    <h2 className="text-sm font-medium text-muted-foreground">
                        Veredicto de pauta: {paidGateLabels[plan.paid_gate]}
                    </h2>
                    <p className="max-w-[75ch] text-sm leading-relaxed whitespace-pre-line text-foreground">
                        {plan.paid_gate_reason}
                    </p>
                    {plan.paid_gate_preconditions.length > 0 && (
                        <ul className="flex flex-col gap-1">
                            {plan.paid_gate_preconditions.map((precondition) => (
                                <li key={precondition} className="text-sm text-muted-foreground">
                                    • {precondition}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {touchedTasks.length > 0 && (
                    <section className="overflow-hidden rounded-xl border border-border bg-card">
                        <header className="border-b border-border px-6 py-4">
                            <h2 className="text-sm font-medium text-muted-foreground">
                                Lo que esta corrida tocó
                            </h2>
                        </header>
                        <ul className="flex flex-col">
                            {touchedTasks.map((task) => (
                                <li
                                    key={task.id}
                                    className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4 last:border-b-0"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm text-foreground">
                                            {task.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {task.action_name} · {agentLabels[task.agent]} ·{' '}
                                            {task.created_here ? 'nueva' : 'actualizada'}
                                        </span>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        {task.closure_proposed && (
                                            <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                                Cierre propuesto
                                            </span>
                                        )}
                                        <span
                                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusPillClasses[task.status]}`}
                                        >
                                            {statusLabels[task.status]}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
