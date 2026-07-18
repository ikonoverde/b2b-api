import { Link, usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import type { PageProps } from '@/types';
import { formatDate } from '@/utils/date';

interface StaticPageData {
    id: number;
    slug: string;
    title: string;
    is_published: boolean;
    updated_at: string | null;
}

interface Props extends PageProps {
    pages: StaticPageData[];
}

export default function StaticPages({ pages }: Props) {
    const { flash } = usePage<PageProps>().props;

    return (
        <AppLayout title="Páginas Estáticas" active="static-pages">
            <div className="p-8">
                <div className="max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-foreground">
                            Páginas Estáticas
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Administra el contenido de las páginas del sitio
                        </p>
                    </div>

                    {flash?.success && (
                        <div className="mb-6 bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-lg text-sm">
                            {flash.success}
                        </div>
                    )}

                    {/* Pages Table */}
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-background">
                                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Título
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Slug
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Actualizado
                                    </th>
                                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pages.map((page) => (
                                    <tr key={page.id}>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-foreground">
                                                {page.title}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                                /{page.slug}
                                            </code>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                                    page.is_published
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {page.is_published ? 'Publicada' : 'Borrador'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs text-muted-foreground">
                                                {page.updated_at ? formatDate(page.updated_at) : '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/admin/static-pages/${page.id}/edit`}
                                                className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                                Editar
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
