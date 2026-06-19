import { Link } from '@inertiajs/react';
import PublicShell from '@/Layouts/PublicShell';
import { formatDateLong } from '@/utils/date';

interface BlogPostSummary {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image_url: string | null;
    published_at: string | null;
}

interface PaginatedPosts {
    data: BlogPostSummary[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    posts: PaginatedPosts;
}

export default function BlogIndex({ posts }: Props) {
    return (
        <PublicShell title="Blog">
            <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
                <p className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                    Ikonoverde · Blog
                </p>
                <h1 className="mt-6 max-w-[22ch] font-display text-[clamp(2.35rem,6vw,4.75rem)] font-normal leading-[0.98] tracking-[-0.025em] text-[var(--iko-stone-ink)]">
                    Notas para comprar, vender y cuidar mejor.
                </h1>
                <p className="mt-8 max-w-[58ch] text-[16px] leading-[1.7] text-[var(--iko-stone-ink)]/75">
                    Guías breves sobre producto profesional, operación de negocio y cuidado corporal con enfoque práctico.
                </p>
            </section>

            {posts.data.length > 0 ? (
                <>
                    <div className="grid gap-px bg-[var(--iko-stone-hairline)] md:grid-cols-2 lg:grid-cols-3">
                        {posts.data.map((post) => (
                            <ArticleCard key={post.id} post={post} />
                        ))}
                    </div>

                    {(posts.prev_page_url || posts.next_page_url) && (
                        <nav className="mt-10 flex items-center justify-between border-t border-[var(--iko-stone-hairline)] pt-6 text-[13px]">
                            <PaginationLink href={posts.prev_page_url} label="Anterior" />
                            <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                                Página {posts.current_page} de {posts.last_page}
                            </span>
                            <PaginationLink href={posts.next_page_url} label="Siguiente" alignRight />
                        </nav>
                    )}
                </>
            ) : (
                <div className="border-y border-[var(--iko-stone-hairline)] py-16">
                    <p className="font-display text-[1.75rem] text-[var(--iko-stone-ink)]">
                        Aún no hay entradas publicadas.
                    </p>
                    <p className="mt-3 max-w-[48ch] text-[15px] leading-6 text-[var(--iko-stone-ink)]/70">
                        Vuelve pronto para leer nuevas guías y notas de Ikonoverde.
                    </p>
                </div>
            )}
        </PublicShell>
    );
}

function ArticleCard({ post }: { post: BlogPostSummary }) {
    return (
        <article className="group bg-[var(--iko-stone-paper)]">
            <Link
                href={`/blog/${post.slug}`}
                className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset"
            >
                <div className="aspect-[4/3] overflow-hidden bg-[var(--iko-stone-mid)]/35">
                    {post.cover_image_url ? (
                        <img
                            src={post.cover_image_url}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                    ) : (
                        <div className="flex h-full items-end p-6">
                            <span className="font-spec text-[11px] tracking-[0.1em] text-[var(--iko-stone-whisper)] uppercase">
                                Ikonoverde
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                    {post.published_at && (
                        <time className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                            {formatDateLong(post.published_at)}
                        </time>
                    )}
                    <h2 className="mt-5 font-display text-[1.55rem] leading-[1.12] tracking-[-0.01em] text-[var(--iko-stone-ink)]">
                        {post.title}
                    </h2>
                    {post.excerpt && (
                        <p className="mt-4 line-clamp-3 text-[14.5px] leading-6 text-[var(--iko-stone-ink)]/70">
                            {post.excerpt}
                        </p>
                    )}
                    <span className="mt-8 font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent)] uppercase">
                        Leer entrada
                    </span>
                </div>
            </Link>
        </article>
    );
}

function PaginationLink({ href, label, alignRight = false }: { href: string | null; label: string; alignRight?: boolean }) {
    if (!href) {
        return <span className="min-w-24" />;
    }

    return (
        <Link
            href={href}
            preserveScroll
            className={`min-w-24 rounded-sm text-[var(--iko-stone-ink)] transition-colors hover:text-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] ${alignRight ? 'text-right' : ''}`}
        >
            {label}
        </Link>
    );
}
