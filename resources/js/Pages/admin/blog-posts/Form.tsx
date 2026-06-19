import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { lazy, Suspense } from 'react';
import AppLayout from '@/Layouts/AppLayout';

const MDEditor = lazy(() => import('@uiw/react-md-editor'));

export interface BlogPostAdminData {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image_url: string | null;
    is_published: boolean;
    published_at: string | null;
}

type BlogPostFormData = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: File | null;
    is_published: boolean;
    published_at: string;
};

interface Props {
    post?: BlogPostAdminData;
}

export default function BlogPostForm({ post }: Props) {
    const form = useForm<BlogPostFormData>({
        title: post?.title ?? '',
        slug: post?.slug ?? '',
        excerpt: post?.excerpt ?? '',
        content: post?.content ?? '',
        cover_image: null,
        is_published: post?.is_published ?? false,
        published_at: post?.published_at ? post.published_at.slice(0, 16) : '',
    });

    const isEditing = Boolean(post);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (post) {
            form.transform((data) => ({ ...data, _method: 'PUT' }));
            form.post(`/admin/blog-posts/${post.id}`, { forceFormData: true });
            return;
        }

        form.post('/admin/blog-posts', { forceFormData: true });
    };

    return (
        <AppLayout title={isEditing ? `Editar: ${post?.title}` : 'Nueva entrada'} active="blog-posts">
            <div className="p-8">
                <div className="max-w-4xl">
                    <Link
                        href="/admin/blog-posts"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#4A5D4A] hover:underline font-[Outfit]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Blog
                    </Link>

                    <div className="mb-8">
                        <h1 className="font-[Outfit] text-2xl font-bold text-[#1A1A1A]">
                            {isEditing ? 'Editar Entrada' : 'Nueva Entrada'}
                        </h1>
                        <p className="mt-1 font-[Outfit] text-sm text-[#666666]">
                            Administra el contenido, portada y publicación de la entrada.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid gap-5 md:grid-cols-2">
                            <Field label="Título" error={form.errors.title}>
                                <input
                                    type="text"
                                    value={form.data.title}
                                    onChange={(e) => form.setData('title', e.target.value)}
                                    className="w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 font-[Outfit] text-sm"
                                    required
                                />
                            </Field>

                            <Field label="Slug" error={form.errors.slug}>
                                <input
                                    type="text"
                                    value={form.data.slug}
                                    onChange={(e) => form.setData('slug', e.target.value)}
                                    placeholder="se-genera-si-lo-dejas-vacio"
                                    className="w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 font-[Outfit] text-sm"
                                />
                            </Field>
                        </div>

                        <Field label="Extracto" error={form.errors.excerpt}>
                            <textarea
                                value={form.data.excerpt}
                                onChange={(e) => form.setData('excerpt', e.target.value)}
                                rows={3}
                                maxLength={500}
                                className="w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 font-[Outfit] text-sm"
                            />
                        </Field>

                        <Field label="Imagen de portada" error={form.errors.cover_image}>
                            {post?.cover_image_url && (
                                <img
                                    src={post.cover_image_url}
                                    alt=""
                                    className="mb-3 aspect-[16/7] w-full rounded-lg object-cover"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={(e) => form.setData('cover_image', e.target.files?.[0] ?? null)}
                                className="w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 font-[Outfit] text-sm"
                            />
                        </Field>

                        <Field label="Contenido (Markdown)" error={form.errors.content}>
                            <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-[#F5F3F0]" />}>
                                <div data-color-mode="light">
                                    <MDEditor
                                        value={form.data.content}
                                        onChange={(value) => form.setData('content', value ?? '')}
                                        height={520}
                                    />
                                </div>
                            </Suspense>
                        </Field>

                        <div className="grid gap-5 rounded-xl border border-[#E5E5E5] bg-white p-5 md:grid-cols-2">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_published}
                                    onChange={(e) => form.setData('is_published', e.target.checked)}
                                    className="rounded border-[#E5E5E5]"
                                />
                                <span className="font-[Outfit] text-sm text-[#1A1A1A]">Publicada</span>
                            </label>

                            <Field label="Fecha de publicación" error={form.errors.published_at} compact>
                                <input
                                    type="datetime-local"
                                    value={form.data.published_at}
                                    onChange={(e) => form.setData('published_at', e.target.value)}
                                    className="w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 font-[Outfit] text-sm"
                                />
                            </Field>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link
                                href="/admin/blog-posts"
                                className="px-4 py-2.5 font-[Outfit] text-sm font-medium text-[#666666] hover:text-[#1A1A1A]"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="cursor-pointer rounded-lg bg-[#4A5D4A] px-8 py-2.5 font-[Outfit] text-sm font-medium text-white hover:bg-[#3d4e3d] disabled:opacity-50"
                            >
                                {form.processing ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

function Field({
    label,
    error,
    children,
    compact = false,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
    compact?: boolean;
}) {
    return (
        <div>
            <label className={`block font-[Outfit] text-sm font-medium text-[#1A1A1A] ${compact ? 'mb-1' : 'mb-2'}`}>
                {label}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
