import { Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import type { PageProps } from '@/types';
import { formatDate, formatDateShort } from '@/utils/date';

interface BlogPostAdminRow {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    published_at: string | null;
    updated_at: string | null;
    status: 'draft' | 'scheduled' | 'published';
}

interface PaginatedPosts {
    data: BlogPostAdminRow[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    from: number | null;
    to: number | null;
    total: number;
}

interface Props extends PageProps {
    posts: PaginatedPosts;
    filters: {
        search: string;
    };
}

const statusConfig = {
    draft: { label: 'Borrador', className: 'bg-gray-100 text-gray-600' },
    scheduled: { label: 'Programada', className: 'bg-blue-50 text-blue-700' },
    published: { label: 'Publicada', className: 'bg-green-50 text-green-700' },
} as const;

export default function BlogPostsIndex() {
    const { posts, filters, flash } = usePage<Props>().props;
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/blog-posts', { search: searchQuery }, { preserveState: true });
    };

    const deletePost = (post: BlogPostAdminRow) => {
        if (!window.confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        router.delete(`/admin/blog-posts/${post.id}`);
    };

    return (
        <AppLayout title="Blog" active="blog-posts">
            <div className="p-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="font-[Outfit] text-2xl font-bold text-[#1A1A1A]">Blog</h1>
                        <p className="mt-1 font-[Outfit] text-sm text-[#666666]">
                            Crea y administra entradas publicadas en /blog
                        </p>
                    </div>
                    <Link
                        href="/admin/blog-posts/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-[#4A5D4A] px-4 py-2.5 font-[Outfit] text-sm font-medium text-white hover:bg-[#3d4e3d]"
                    >
                        <Plus className="h-4 w-4" />
                        Nueva Entrada
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 font-[Outfit] text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={handleSearch} className="mb-6 flex max-w-md gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#999999]" />
                        <input
                            type="text"
                            placeholder="Buscar por título o slug..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 w-full rounded-xl border border-[#E5E5E5] bg-white pl-10 pr-4 font-[Outfit] text-sm outline-none transition-colors focus:border-[#4A5D4A]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-xl bg-[#4A5D4A] px-5 font-[Outfit] text-sm font-medium text-white hover:bg-[#3d4e3d]"
                    >
                        Buscar
                    </button>
                </form>

                <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
                                <TableHeading>Título</TableHeading>
                                <TableHeading>Estado</TableHeading>
                                <TableHeading>Publicación</TableHeading>
                                <TableHeading>Actualizado</TableHeading>
                                <TableHeading alignRight>Acciones</TableHeading>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5]">
                            {posts.data.map((post) => (
                                <tr key={post.id}>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-[Outfit] text-sm font-medium text-[#1A1A1A]">
                                                {post.title}
                                            </span>
                                            <code className="w-fit rounded bg-[#F5F3F0] px-2 py-1 text-xs text-[#666666]">
                                                /blog/{post.slug}
                                            </code>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex rounded-full px-2 py-1 font-[Outfit] text-xs font-medium ${statusConfig[post.status].className}`}>
                                            {statusConfig[post.status].label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 font-[Outfit] text-xs text-[#666666]">
                                        {post.published_at ? formatDate(post.published_at) : '—'}
                                    </td>
                                    <td className="px-4 py-4 font-[Outfit] text-xs text-[#999999]">
                                        {formatDateShort(post.updated_at)}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                href={`/admin/blog-posts/${post.id}/edit`}
                                                className="inline-flex items-center gap-1.5 font-[Outfit] text-sm font-medium text-[#4A5D4A] hover:underline"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                                Editar
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => deletePost(post)}
                                                className="inline-flex cursor-pointer items-center gap-1.5 font-[Outfit] text-sm font-medium text-red-600 hover:underline"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {posts.data.length === 0 && (
                        <div className="px-6 py-12 text-center font-[Outfit] text-sm text-[#666666]">
                            No hay entradas de blog para mostrar.
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t border-[#E5E5E5] px-6 py-4">
                        <span className="font-[Outfit] text-sm text-[#666666]">
                            Mostrando {posts.from ?? 0} a {posts.to ?? 0} de {posts.total} entradas
                        </span>
                        <div className="flex items-center gap-3">
                            <PaginationButton href={posts.prev_page_url}>Anterior</PaginationButton>
                            <span className="font-[Outfit] text-sm text-[#1A1A1A]">
                                {posts.current_page} / {posts.last_page}
                            </span>
                            <PaginationButton href={posts.next_page_url}>Siguiente</PaginationButton>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function TableHeading({ children, alignRight = false }: { children: React.ReactNode; alignRight?: boolean }) {
    return (
        <th className={`px-4 py-3 font-[Outfit] text-xs font-medium uppercase tracking-wider text-[#999999] ${alignRight ? 'text-right' : 'text-left'}`}>
            {children}
        </th>
    );
}

function PaginationButton({ href, children }: { href: string | null; children: React.ReactNode }) {
    if (!href) {
        return (
            <span className="rounded-lg border border-[#E5E5E5] px-3 py-2 font-[Outfit] text-sm text-[#999999] opacity-50">
                {children}
            </span>
        );
    }

    return (
        <Link
            href={href}
            preserveScroll
            className="rounded-lg border border-[#E5E5E5] px-3 py-2 font-[Outfit] text-sm text-[#666666] hover:bg-gray-50"
        >
            {children}
        </Link>
    );
}
