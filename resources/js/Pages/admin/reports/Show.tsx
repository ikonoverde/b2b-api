import { Link, usePage } from '@inertiajs/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeft, Calendar, FileText, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PageProps, ReportDetail } from '@/types';

interface Props extends PageProps {
    report: ReportDetail;
    task: { id: number; name: string } | null;
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

export default function ReportShow() {
    const { report, task } = usePage<Props>().props;

    const backHref = task === null ? '/admin/growth-plan/board' : `/admin/growth-plan/tasks/${task.id}`;
    const backLabel = task === null ? 'Tablero de tareas' : task.name;

    return (
        <AppLayout title={report.title} active="growth-plan">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <Link
                    href={backHref}
                    className="inline-flex w-fit items-center gap-1.5 font-[Outfit] text-sm text-[#666666] hover:text-[#1A1A1A]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {backLabel}
                </Link>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <h1 className="max-w-[70ch] font-[Outfit] text-[28px] font-semibold text-[#1A1A1A]">
                            {report.title}
                        </h1>
                        <Badge
                            variant="outline"
                            className="font-[Outfit] shrink-0 border-[#C8D3C8] bg-[#EEF2EE] text-[#3D4D3D]"
                        >
                            {report.type_label}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-[Outfit] text-sm text-[#666666]">
                        {report.agent !== null && (
                            <span className="inline-flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-[#999999]" />
                                {report.agent}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#999999]" />
                            {formatDateTime(report.created_at)}
                        </span>
                    </div>
                </div>

                {report.summary !== null && (
                    <div className="rounded-xl border border-[#E5E5E5] bg-[#F9F8F6] px-6 py-4">
                        <p className="max-w-[80ch] font-[Outfit] text-sm leading-relaxed text-[#444444]">
                            {report.summary}
                        </p>
                    </div>
                )}

                <section className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#999999]" />
                        <h2 className="font-[Outfit] text-sm font-semibold text-[#1A1A1A]">El reporte</h2>
                    </div>
                    <div className="rounded-xl border border-[#E5E5E5] bg-white px-8 py-7">
                        <div className="prose prose-sm max-w-[70ch] font-[Outfit] prose-headings:font-[Outfit] prose-headings:text-[#1A1A1A] prose-p:text-[#444444] prose-li:text-[#444444] prose-strong:text-[#1A1A1A] prose-code:font-mono prose-code:text-[#4A5D4A] prose-a:text-[#4A5D4A]">
                            <Markdown remarkPlugins={[remarkGfm]}>{report.body}</Markdown>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
