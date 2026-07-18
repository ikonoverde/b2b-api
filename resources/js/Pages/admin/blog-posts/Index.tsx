import { Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
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
    draft: { label: 'Borrador', className: 'bg-muted text-muted-foreground' },
    scheduled: { label: 'Programada', className: 'bg-accent text-accent-foreground' },
    published: { label: 'Publicada', className: 'bg-primary/10 text-primary' },
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
                        <h1 className="text-2xl font-bold text-foreground">Blog</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Crea y administra entradas publicadas en /blog
                        </p>
                    </div>
                    <Link
                        href="/admin/blog-posts/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary"
                    >
                        <Plus className="h-4 w-4" />
                        Nueva Entrada
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={handleSearch} className="mb-6 flex max-w-md gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por título o slug..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-xl bg-primary px-5 text-sm font-medium text-white hover:bg-primary"
                    >
                        Buscar
                    </button>
                </form>

                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-background">
                                <TableHeading>Título</TableHeading>
                                <TableHeading>Estado</TableHeading>
                                <TableHeading>Publicación</TableHeading>
                                <TableHeading>Actualizado</TableHeading>
                                <TableHeading alignRight>Acciones</TableHeading>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {posts.data.map((post) => (
                                <tr key={post.id}>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-medium text-foreground">
                                                {post.title}
                                            </span>
                                            <code className="w-fit rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                                                /blog/{post.slug}
                                            </code>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusConfig[post.status].className}`}>
                                            {statusConfig[post.status].label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-xs text-muted-foreground">
                                        {post.published_at ? formatDate(post.published_at) : '—'}
                                    </td>
                                    <td className="px-4 py-4 text-xs text-muted-foreground">
                                        {formatDateShort(post.updated_at)}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-end gap-3">
                                            <a
                                                href={`/admin/blog-posts/${post.id}/preview`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Vista previa
                                            </a>
                                            <Link
                                                href={`/admin/blog-posts/${post.id}/edit`}
                                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                                Editar
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => deletePost(post)}
                                                className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-destructive hover:underline"
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
                        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                            No hay entradas de blog para mostrar.
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t border-border px-6 py-4">
                        <span className="text-sm text-muted-foreground">
                            Mostrando {posts.from ?? 0} a {posts.to ?? 0} de {posts.total} entradas
                        </span>
                        <div className="flex items-center gap-3">
                            <PaginationButton href={posts.prev_page_url}>Anterior</PaginationButton>
                            <span className="text-sm text-foreground">
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
        <th className={`px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground ${alignRight ? 'text-right' : 'text-left'}`}>
            {children}
        </th>
    );
}

function PaginationButton({ href, children }: { href: string | null; children: React.ReactNode }) {
    if (!href) {
        return (
            <span className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground opacity-50">
                {children}
            </span>
        );
    }

    return (
        <Link
            href={href}
            preserveScroll
            className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
        >
            {children}
        </Link>
    );
}
