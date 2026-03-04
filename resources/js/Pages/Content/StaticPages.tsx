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
                        <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit]">
                            Páginas Estáticas
                        </h1>
                        <p className="text-sm text-[#666666] font-[Outfit] mt-1">
                            Administra el contenido de las páginas del sitio
                        </p>
                    </div>

                    {flash?.success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-[Outfit] text-sm">
                            {flash.success}
                        </div>
                    )}

                    {/* Pages Table */}
                    <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
                                    <th className="text-left px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider">
                                        Título
                                    </th>
                                    <th className="text-left px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider">
                                        Slug
                                    </th>
                                    <th className="text-left px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="text-left px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider">
                                        Actualizado
                                    </th>
                                    <th className="text-right px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E5E5]">
                                {pages.map((page) => (
                                    <tr key={page.id}>
                                        <td className="px-4 py-3">
                                            <span className="font-[Outfit] text-sm font-medium text-[#1A1A1A]">
                                                {page.title}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <code className="text-xs text-[#666666] bg-[#F5F3F0] px-2 py-1 rounded">
                                                /{page.slug}
                                            </code>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium font-[Outfit] ${
                                                    page.is_published
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {page.is_published ? 'Publicada' : 'Borrador'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-[Outfit] text-xs text-[#999999]">
                                                {page.updated_at ? formatDate(page.updated_at) : '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/admin/static-pages/${page.id}/edit`}
                                                className="inline-flex items-center gap-1.5 text-[#4A5D4A] font-[Outfit] text-sm font-medium hover:underline"
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
