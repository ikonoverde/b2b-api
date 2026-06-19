import { Link } from '@inertiajs/react';
import type { ComponentPropsWithoutRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PublicShell from '@/Layouts/PublicShell';
import { formatDateLong } from '@/utils/date';

interface BlogPostDetail {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image_url: string | null;
    published_at: string | null;
}

interface Props {
    post: BlogPostDetail;
}

export default function BlogShow({ post }: Props) {
    return (
        <PublicShell title={post.title}>
            <article>
                <header className="pt-12 pb-10 sm:pt-20 sm:pb-14">
                    <Link
                        href="/blog"
                        className="font-spec text-[11px] tracking-[0.1em] text-[var(--iko-accent)] uppercase hover:text-[var(--iko-accent-hover)]"
                    >
                        Blog
                    </Link>
                    <h1 className="mt-6 max-w-[24ch] font-display text-[clamp(2.2rem,5.6vw,4.5rem)] font-normal leading-[0.99] tracking-[-0.025em] text-[var(--iko-stone-ink)]">
                        {post.title}
                    </h1>
                    {post.excerpt && (
                        <p className="mt-7 max-w-[58ch] text-[17px] leading-[1.7] text-[var(--iko-stone-ink)]/75">
                            {post.excerpt}
                        </p>
                    )}
                    {post.published_at && (
                        <time className="mt-8 block font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                            Publicado · {formatDateLong(post.published_at)}
                        </time>
                    )}
                </header>

                {post.cover_image_url && (
                    <div className="border-y border-[var(--iko-stone-hairline)] py-8">
                        <img
                            src={post.cover_image_url}
                            alt=""
                            className="aspect-[16/8] w-full object-cover"
                        />
                    </div>
                )}

                <div className="border-b border-[var(--iko-stone-hairline)] py-12 sm:py-16">
                    <Markdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
                        {post.content}
                    </Markdown>
                </div>
            </article>
        </PublicShell>
    );
}

const MARKDOWN_COMPONENTS = {
    h1: ({ children }: ComponentPropsWithoutRef<'h1'>) => (
        <h2 className="mt-14 mb-6 border-t border-[var(--iko-stone-hairline)] pt-10 font-display text-[2rem] leading-[1.15] tracking-[-0.01em] text-[var(--iko-stone-ink)] first:mt-0 first:border-t-0 first:pt-0">
            {children}
        </h2>
    ),
    h2: ({ children }: ComponentPropsWithoutRef<'h2'>) => (
        <h2 className="mt-14 mb-6 border-t border-[var(--iko-stone-hairline)] pt-10 font-display text-[1.75rem] leading-[1.15] tracking-[-0.01em] text-[var(--iko-stone-ink)] first:mt-0 first:border-t-0 first:pt-0">
            {children}
        </h2>
    ),
    h3: ({ children }: ComponentPropsWithoutRef<'h3'>) => (
        <h3 className="mt-10 mb-3 font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]">
            {children}
        </h3>
    ),
    p: ({ children }: ComponentPropsWithoutRef<'p'>) => (
        <p className="mb-5 max-w-[66ch] text-[16px] leading-[1.72] text-[var(--iko-stone-ink)]/85">
            {children}
        </p>
    ),
    ul: ({ children }: ComponentPropsWithoutRef<'ul'>) => (
        <ul className="mb-6 flex max-w-[65ch] flex-col gap-2 pl-0">{children}</ul>
    ),
    ol: ({ children }: ComponentPropsWithoutRef<'ol'>) => (
        <ol className="mb-6 flex max-w-[65ch] flex-col gap-2 pl-0">{children}</ol>
    ),
    li: ({ children }: ComponentPropsWithoutRef<'li'>) => (
        <li className="relative list-none pl-6 text-[15.5px] leading-[1.65] text-[var(--iko-stone-ink)]/85 before:absolute before:left-0 before:top-[0.5em] before:h-px before:w-3 before:bg-[var(--iko-accent)]">
            {children}
        </li>
    ),
    a: ({ children, href, ...rest }: ComponentPropsWithoutRef<'a'>) => (
        <a
            {...rest}
            href={href}
            className="rounded-sm text-[var(--iko-accent)] underline decoration-[var(--iko-stone-mid)] underline-offset-4 transition-colors hover:decoration-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)]"
        >
            {children}
        </a>
    ),
    blockquote: ({ children }: ComponentPropsWithoutRef<'blockquote'>) => (
        <blockquote className="my-8 max-w-[60ch] border-t border-[var(--iko-stone-hairline)] pt-6 font-display text-[1.25rem] leading-[1.45] text-[var(--iko-stone-ink)]">
            {children}
        </blockquote>
    ),
    hr: () => <hr className="my-12 border-0 border-t border-[var(--iko-stone-hairline)]" />,
};
