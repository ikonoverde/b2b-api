import { Link, usePage } from '@inertiajs/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeft, CircleSlash, History } from 'lucide-react';
import type {
    MarketingReportDetail,
    MarketingReportMetric,
    MarketingReportPreviousReading,
    PageProps,
} from '@/types';
import {
    delta,
    formatDate,
    formatDateTime,
    formatDelta,
    formatNumber,
    formatWindow,
    metricLabels,
} from './helpers';
import { ProvenancePill } from './Provenance';

interface Props extends PageProps {
    report: MarketingReportDetail;
    previous: MarketingReportPreviousReading | null;
}

function SupersededBanner({ supersededAt }: { supersededAt: string }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-[#E4D3B4] bg-[#FAF3E6] px-5 py-4">
            <History className="mt-0.5 h-4 w-4 shrink-0 text-[#7A6234]" />
            <div className="flex flex-col gap-1">
                <p className="font-[Outfit] text-sm font-medium text-[#7A6234]">
                    Este reporte fue reemplazado el {formatDateTime(supersededAt)}.
                </p>
                <p className="font-[Outfit] text-sm text-[#7A6234]/85">
                    Se conserva como registro de lo que esa corrida observó, pero ya no es la lectura de su
                    día y no debe usarse para calcular cambios.
                </p>
            </div>
        </div>
    );
}

/**
 * The value cell of the metrics table.
 *
 * A metric can hold a number, a text value, or nothing. It is never rendered as a bare number when
 * its provenance is unknown: the row exists precisely to record that nobody could see it, and a
 * blank cell would let a reader supply their own zero.
 */
function MetricValue({ metric }: { metric: MarketingReportMetric }) {
    if (metric.provenance === 'unknown') {
        return (
            <span className="inline-flex items-center gap-1.5 font-[Outfit] text-xs text-[#999999]">
                <CircleSlash className="h-3 w-3" />
                Sin dato
            </span>
        );
    }

    if (metric.numeric_value !== null) {
        return (
            <span className="font-mono text-sm tabular-nums text-[#1A1A1A]">
                {formatNumber(Number(metric.numeric_value))}
            </span>
        );
    }

    if (metric.text_value !== null) {
        return <span className="font-[Outfit] text-sm text-[#1A1A1A]">{metric.text_value}</span>;
    }

    return <span className="font-[Outfit] text-sm text-[#999999]">—</span>;
}

/**
 * Movement against the previous standing report, shown only where both endpoints were observed.
 * Everywhere else the column stays blank: there is no honest number to put in it.
 */
function MetricDelta({
    metric,
    previous,
}: {
    metric: MarketingReportMetric;
    previous: MarketingReportPreviousReading | null;
}) {
    if (previous === null || metric.provenance !== 'observed' || metric.numeric_value === null) {
        return null;
    }

    if (!(metric.key in previous.headlines)) {
        return null;
    }

    const movement = delta(Number(metric.numeric_value), previous.headlines[metric.key]);

    if (movement === null) {
        return (
            <span className="font-[Outfit] text-xs text-[#999999]">
                Sin comparación: el {formatDate(previous.reported_on)} nadie lo observó
            </span>
        );
    }

    return (
        <span className="font-mono text-xs tabular-nums text-[#666666]">{formatDelta(movement)}</span>
    );
}

function MetricsTable({
    metrics,
    previous,
}: {
    metrics: MarketingReportMetric[];
    previous: MarketingReportPreviousReading | null;
}) {
    if (metrics.length === 0) {
        return (
            <div className="px-6 py-12 text-center">
                <p className="font-[Outfit] text-sm text-[#666666]">
                    Esta corrida no registró ninguna métrica.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
                <thead>
                    <tr className="border-b border-[#E5E5E5]">
                        {[
                            { label: 'Métrica', align: 'text-left' },
                            { label: 'Valor', align: 'text-right' },
                            { label: 'Procedencia', align: 'text-left' },
                            { label: 'Cambio', align: 'text-left' },
                            { label: 'Nota', align: 'text-left' },
                        ].map((column) => (
                            <th key={column.label} className={`px-6 py-4 ${column.align}`}>
                                <span className="font-[Outfit] text-sm font-medium text-[#666666]">
                                    {column.label}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {metrics.map((metric) => (
                        <tr key={metric.id} className="border-b border-[#E5E5E5] last:border-b-0">
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-[Outfit] text-sm font-medium text-[#1A1A1A]">
                                        {metricLabels[metric.key] ?? metric.key}
                                    </span>
                                    {metricLabels[metric.key] && (
                                        <span className="font-mono text-xs text-[#999999]">{metric.key}</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <MetricValue metric={metric} />
                            </td>
                            <td className="px-6 py-4">
                                <ProvenancePill provenance={metric.provenance} />
                            </td>
                            <td className="px-6 py-4">
                                <MetricDelta metric={metric} previous={previous} />
                            </td>
                            <td className="px-6 py-4">
                                <span className="font-[Outfit] text-sm text-[#666666]">
                                    {metric.note ?? ''}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function CoverageRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="font-[Outfit] text-[11px] font-medium uppercase tracking-wide text-[#999999]">
                {label}
            </span>
            {children}
        </div>
    );
}

/**
 * What the run could and could not see, rendered verbatim. The reachability strings are written by
 * the agent that made the calls; paraphrasing them here would put this page's guess between the
 * reader and the only record of why a number is missing.
 */
function Coverage({ report }: { report: MarketingReportDetail }) {
    const comparedAgainst = report.compared_against ?? [];
    const reachability = Object.entries(report.reachability ?? {});

    return (
        <aside className="flex flex-col gap-5 self-start rounded-xl border border-[#E5E5E5] bg-white p-6">
            <CoverageRow label="Agentes consultados">
                <div className="flex flex-wrap gap-1.5">
                    {(report.agents_run ?? []).map((agent) => (
                        <span
                            key={agent}
                            className="inline-flex rounded-full border border-[#E5E5E5] bg-[#F5F3F0] px-2.5 py-1 font-mono text-xs text-[#666666]"
                        >
                            {agent}
                        </span>
                    ))}
                </div>
            </CoverageRow>

            <CoverageRow label="Alcance de las fuentes">
                <dl className="flex flex-col gap-2">
                    {reachability.map(([source, state]) => (
                        <div key={source} className="flex flex-col gap-0.5">
                            <dt className="font-mono text-xs text-[#1A1A1A]">{source}</dt>
                            <dd className="font-[Outfit] text-sm text-[#666666]">{state}</dd>
                        </div>
                    ))}
                </dl>
            </CoverageRow>

            {report.ga4_property_id && (
                <CoverageRow label="Propiedad GA4">
                    <span className="font-mono text-sm text-[#1A1A1A]">{report.ga4_property_id}</span>
                </CoverageRow>
            )}

            <CoverageRow label="Comparado contra">
                {comparedAgainst.length === 0 ? (
                    <span className="font-[Outfit] text-sm text-[#999999]">
                        Nada: es la primera lectura.
                    </span>
                ) : (
                    <div className="flex flex-col gap-1">
                        {comparedAgainst.map((date) => (
                            <span key={date} className="font-mono text-sm tabular-nums text-[#1A1A1A]">
                                {formatDate(date)}
                            </span>
                        ))}
                    </div>
                )}
            </CoverageRow>

            <CoverageRow label="Generado">
                <span className="font-[Outfit] text-sm text-[#1A1A1A]">
                    {formatDateTime(report.created_at)}
                </span>
            </CoverageRow>
        </aside>
    );
}

export default function MarketingReportShow() {
    const { report, previous } = usePage<Props>().props;

    const window = formatWindow(report.window_start, report.window_end);
    const isSuperseded = report.superseded_at !== null;

    return (
        <AppLayout title={`Reporte · ${formatDate(report.reported_on)}`} active="marketing-reports">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <Link
                    href="/admin/marketing-reports"
                    className="flex w-fit items-center gap-2 font-[Outfit] text-sm text-[#666666] hover:text-[#1A1A1A]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Reportes de marketing
                </Link>

                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-[Outfit] text-[28px] font-semibold text-[#1A1A1A]">
                            Reporte del {formatDate(report.reported_on)}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2">
                            {isSuperseded ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4D3B4] bg-[#FAF3E6] px-2.5 py-1 font-[Outfit] text-xs font-medium text-[#7A6234]">
                                    <History className="h-3 w-3" />
                                    Reemplazado
                                </span>
                            ) : (
                                <span className="inline-flex rounded-full border border-[#C8D3C8] bg-[#EEF2EE] px-2.5 py-1 font-[Outfit] text-xs font-medium text-[#3D4D3D]">
                                    Vigente
                                </span>
                            )}
                            {window && (
                                <span className="font-[Outfit] text-sm text-[#666666]">Ventana: {window}</span>
                            )}
                        </div>
                    </div>

                    {previous && (
                        <Link
                            href={`/admin/marketing-reports/${previous.id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#E5E5E5] px-4 py-2 font-[Outfit] text-sm text-[#4A5D4A] transition-colors hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Reporte anterior · {formatDate(previous.reported_on)}
                        </Link>
                    )}
                </div>

                {isSuperseded && <SupersededBanner supersededAt={report.superseded_at as string} />}

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="flex flex-col gap-6">
                        <section className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <h2 className="font-[Outfit] text-sm font-semibold text-[#1A1A1A]">
                                    Métricas registradas
                                </h2>
                                <p className="font-[Outfit] text-xs text-[#999999]">
                                    Cada valor lleva su procedencia. Solo se calcula un cambio cuando el valor
                                    de hoy y el del reporte anterior fueron ambos observados.
                                </p>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
                                <MetricsTable metrics={report.metrics} previous={previous} />
                            </div>
                        </section>

                        <section className="flex flex-col gap-3">
                            <h2 className="font-[Outfit] text-sm font-semibold text-[#1A1A1A]">
                                Narrativa del agente
                            </h2>
                            <div className="rounded-xl border border-[#E5E5E5] bg-white px-8 py-7">
                                <div className="prose prose-sm max-w-[70ch] font-[Outfit] prose-headings:font-[Outfit] prose-headings:text-[#1A1A1A] prose-p:text-[#444444] prose-li:text-[#444444] prose-strong:text-[#1A1A1A] prose-code:font-mono prose-code:text-[#4A5D4A] prose-a:text-[#4A5D4A]">
                                    <Markdown remarkPlugins={[remarkGfm]}>{report.body}</Markdown>
                                </div>
                            </div>
                        </section>
                    </div>

                    <Coverage report={report} />
                </div>
            </div>
        </AppLayout>
    );
}
