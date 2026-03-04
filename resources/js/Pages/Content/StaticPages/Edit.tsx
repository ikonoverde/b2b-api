import { useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import type { PageProps } from '@/types';

const MDEditor = lazy(() => import('@uiw/react-md-editor'));

interface StaticPageData {
    id: number;
    slug: string;
    title: string;
    content: string;
    is_published: boolean;
}

interface Props extends PageProps {
    page: StaticPageData;
}

export default function EditStaticPage({ page }: Props) {
    const form = useForm({
        title: page.title,
        content: page.content,
        is_published: page.is_published,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/admin/static-pages/${page.id}`);
    };

    return (
        <AppLayout title={`Editar: ${page.title}`} active="static-pages">
            <div className="p-8">
                <div className="max-w-4xl">
                    {/* Back Link */}
                    <Link
                        href="/admin/static-pages"
                        className="inline-flex items-center gap-2 text-[#4A5D4A] font-[Outfit] font-medium text-sm hover:underline mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a Páginas
                    </Link>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit]">
                                Editar Página
                            </h1>
                            <p className="text-sm text-[#666666] font-[Outfit] mt-1">
                                /{page.slug}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Title */}
                        <div>
                            <label className="block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1">
                                Título
                            </label>
                            <input
                                type="text"
                                value={form.data.title}
                                onChange={(e) => form.setData('title', e.target.value)}
                                className="w-full border border-[#E5E5E5] rounded-lg px-4 py-2.5 font-[Outfit] text-sm"
                                required
                            />
                            {form.errors.title && (
                                <p className="text-red-500 text-xs mt-1">{form.errors.title}</p>
                            )}
                        </div>

                        {/* Markdown Editor */}
                        <div>
                            <label className="block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1">
                                Contenido (Markdown)
                            </label>
                            <Suspense
                                fallback={
                                    <div className="h-96 bg-[#F5F3F0] rounded-lg animate-pulse" />
                                }
                            >
                                <div data-color-mode="light">
                                    <MDEditor
                                        value={form.data.content}
                                        onChange={(val) => form.setData('content', val || '')}
                                        height={500}
                                    />
                                </div>
                            </Suspense>
                            {form.errors.content && (
                                <p className="text-red-500 text-xs mt-1">{form.errors.content}</p>
                            )}
                        </div>

                        {/* Published Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.data.is_published}
                                onChange={(e) => form.setData('is_published', e.target.checked)}
                                className="rounded border-[#E5E5E5]"
                            />
                            <span className="font-[Outfit] text-sm text-[#1A1A1A]">Publicada</span>
                        </label>

                        {/* Submit */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="bg-[#4A5D4A] text-white px-8 py-2.5 rounded-lg font-[Outfit] font-medium text-sm hover:bg-[#3d4e3d] disabled:opacity-50 cursor-pointer"
                            >
                                {form.processing ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
