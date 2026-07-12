import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ChevronLeft, ChevronRight, History, ClipboardList } from 'lucide-react';
import type { MarketingReportListItem, PageProps } from '@/types';
import { formatDate, formatDateTime, formatWindow } from './helpers';
import { HeadlineValue } from './Provenance';

interface PaginatedReports {
    data: MarketingReportListItem[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

interface Props extends PageProps {
    reports: PaginatedReports;
    filters: { superseded: boolean };
    supersededCount: number;
}

const columns = [
    { key: 'report', label: 'Reporte', align: 'text-left' },
    { key: 'sessions', label: 'Sesiones', align: 'text-right' },
    { key: 'users', label: 'Usuarios', align: 'text-right' },
    { key: 'purchases', label: 'Compras', align: 'text-right' },
    { key: 'followers', label: 'Seguidores IG', align: 'text-right' },
    { key: 'generated', label: 'Generado', align: 'text-left' },
] as const;

function buildPageUrl(page: number, filters: Props['filters']) {
    const params = new URLSearchParams();

    params.set('page', String(page));

    if (filters.superseded) {
        params.set('superseded', '1');
    }

    return `/admin/marketing-reports?${params.toString()}`;
}

function ReportRow({ report }: { report: MarketingReportListItem }) {
    const window = formatWindow(report.window_start, report.window_end);
    const isSuperseded = report.superseded_at !== null;

    return (
        <tr className={`border-b border-[#E5E5E5] hover:bg-gray-50 ${isSuperseded ? 'bg-[#FBFAF9]' : ''}`}>
            <td className="px-6 py-4">
                <Link href={`/admin/marketing-reports/${report.id}`} className="flex flex-col gap-1">
                    <span className="flex items-center gap-2">
                        <span
                            className={`font-mono text-sm tabular-nums hover:underline ${
                                isSuperseded ? 'text-[#8A8A8A] line-through' : 'font-medium text-[#1A1A1A]'
                            }`}
                        >
                            {formatDate(report.reported_on)}
                        </span>
                        {isSuperseded && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#E5E5E5] bg-[#F5F3F0] px-2 py-0.5 font-[Outfit] text-[11px] font-medium text-[#8A8A8A]">
                                <History className="h-3 w-3" />
                                Reemplazado
                            </span>
                        )}
                    </span>
                    {window && (
                        <span className="font-[Outfit] text-xs text-[#999999]">Ventana: {window}</span>
                    )}
                </Link>
            </td>
            <td className="px-6 py-4 text-right">
                <HeadlineValue value={report.ga4_sessions} />
            </td>
            <td className="px-6 py-4 text-right">
                <HeadlineValue value={report.ga4_total_users} />
            </td>
            <td className="px-6 py-4 text-right">
                <HeadlineValue value={report.ga4_purchase_events} />
            </td>
            <td className="px-6 py-4 text-right">
                <HeadlineValue value={report.ig_followers} />
            </td>
            <td className="px-6 py-4">
                <span className="font-[Outfit] text-sm text-[#666666]">
                    {formatDateTime(report.created_at)}
                </span>
            </td>
        </tr>
    );
}

/**
 * Pre-launch, this table is empty or nearly so, and it will stay that way for a while. An empty
 * state that says "no data" invites the reading that something is broken. It is not: nobody has
 * visited the store yet. Say so, and say when the next report lands.
 */
function EmptyState({ filtered }: { filtered: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <ClipboardList className="h-6 w-6 text-[#C9C5C0]" />
            <p className="font-[Outfit] text-sm font-medium text-[#1A1A1A]">
                {filtered ? 'Ningún reporte fue reemplazado.' : 'Todavía no hay reportes.'}
            </p>
            <p className="max-w-md font-[Outfit] text-sm text-[#666666]">
                {filtered
                    ? 'Cuando una corrida vuelva a escribir un día ya reportado, el reporte anterior se conserva aquí.'
                    : 'El agente de marketing escribe uno cada día a las 07:00, hora de la tienda. Un reporte vacío no significa que algo falle: significa que no hubo nada que observar.'}
            </p>
        </div>
    );
}

function Pagination({ reports, filters }: { reports: PaginatedReports; filters: Props['filters'] }) {
    return (
        <div className="flex items-center justify-between border-t border-[#E5E5E5] px-6 py-4">
            <span className="font-[Outfit] text-sm text-[#666666]">
                Mostrando {reports.from} a {reports.to} de {reports.total} reportes
            </span>
            <div className="flex items-center gap-2">
                <Link
                    href={buildPageUrl(reports.current_page - 1, filters)}
                    aria-label="Página anterior"
                    className={`rounded-lg border border-[#E5E5E5] p-2 ${
                        reports.current_page === 1
                            ? 'pointer-events-none cursor-not-allowed opacity-50'
                            : 'hover:bg-gray-50'
                    }`}
                    preserveScroll
                >
                    <ChevronLeft className="h-4 w-4 text-[#666666]" />
                </Link>
                <span className="font-mono text-sm tabular-nums text-[#1A1A1A]">
                    {reports.current_page} / {reports.last_page}
                </span>
                <Link
                    href={buildPageUrl(reports.current_page + 1, filters)}
                    aria-label="Página siguiente"
                    className={`rounded-lg border border-[#E5E5E5] p-2 ${
                        reports.current_page === reports.last_page
                            ? 'pointer-events-none cursor-not-allowed opacity-50'
                            : 'hover:bg-gray-50'
                    }`}
                    preserveScroll
                >
                    <ChevronRight className="h-4 w-4 text-[#666666]" />
                </Link>
            </div>
        </div>
    );
}

export default function MarketingReportsIndex() {
    const { reports, filters, supersededCount } = usePage<Props>().props;

    return (
        <AppLayout title="Reportes de marketing" active="marketing-reports">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <div className="flex flex-col gap-1">
                    <h1 className="font-[Outfit] text-[28px] font-semibold text-[#1A1A1A]">
                        Reportes de marketing
                    </h1>
                    <p className="max-w-2xl font-[Outfit] text-sm text-[#666666]">
                        Lo que el agente observó cada día en GA4, Meta e Instagram. Un cero es una medición;
                        «sin dato» significa que nadie pudo verlo.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/marketing-reports"
                        className={`h-9 rounded-lg border px-4 font-[Outfit] text-sm leading-[2rem] transition-colors ${
                            filters.superseded
                                ? 'border-[#E5E5E5] text-[#666666] hover:bg-gray-50'
                                : 'border-[#4A5D4A] bg-[#4A5D4A] font-medium text-white'
                        }`}
                        preserveScroll
                    >
                        Vigentes
                    </Link>
                    <Link
                        href="/admin/marketing-reports?superseded=1"
                        className={`h-9 rounded-lg border px-4 font-[Outfit] text-sm leading-[2rem] transition-colors ${
                            filters.superseded
                                ? 'border-[#4A5D4A] bg-[#4A5D4A] font-medium text-white'
                                : 'border-[#E5E5E5] text-[#666666] hover:bg-gray-50'
                        }`}
                        preserveScroll
                    >
                        Incluir reemplazados
                        {supersededCount > 0 && (
                            <span className="ml-2 font-mono text-xs tabular-nums">{supersededCount}</span>
                        )}
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
                    {reports.data.length === 0 ? (
                        <EmptyState filtered={filters.superseded} />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-[#E5E5E5]">
                                        {columns.map((column) => (
                                            <th key={column.key} className={`px-6 py-4 ${column.align}`}>
                                                <span className="font-[Outfit] text-sm font-medium text-[#666666]">
                                                    {column.label}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.data.map((report) => (
                                        <ReportRow key={report.id} report={report} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {reports.last_page > 1 && <Pagination reports={reports} filters={filters} />}
                </div>
            </div>
        </AppLayout>
    );
}
