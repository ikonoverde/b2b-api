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
                    className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {backLabel}
                </Link>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <h1 className="max-w-[70ch] text-[28px] font-semibold text-foreground">
                            {report.title}
                        </h1>
                        <Badge
                            variant="outline"
                            className="shrink-0 border-muted bg-muted text-primary"
                        >
                            {report.type_label}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                        {report.agent !== null && (
                            <span className="inline-flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                {report.agent}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {formatDateTime(report.created_at)}
                        </span>
                    </div>
                </div>

                {report.summary !== null && (
                    <div className="rounded-xl border border-border bg-background px-6 py-4">
                        <p className="max-w-[80ch] text-sm leading-relaxed text-muted-foreground">
                            {report.summary}
                        </p>
                    </div>
                )}

                <section className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold text-foreground">El reporte</h2>
                    </div>
                    <div className="rounded-xl border border-border bg-card px-8 py-7">
                        <div className="prose prose-sm max-w-[70ch] prose-headings:prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-code:font-mono prose-code:text-primary prose-a:text-primary">
                            <Markdown remarkPlugins={[remarkGfm]}>{report.body}</Markdown>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
