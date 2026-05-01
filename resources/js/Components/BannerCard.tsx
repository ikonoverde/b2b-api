import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

export interface BannerData {
    id: number;
    title: string;
    subtitle: string | null;
    image_url: string;
    link_type: 'product' | 'category' | 'url' | null;
    link_value: string | null;
    link_text: string | null;
}

/**
 * Editorial banner — image as a quiet companion to typography, not a
 * lifestyle-photo gradient overlay (an explicit anti-reference in
 * PRODUCT.md). On larger viewports the banner is split image-left /
 * text-right; on narrow viewports it stacks.
 */
export default function BannerCard({
    banner,
    className,
}: {
    banner: BannerData;
    className?: string;
}) {
    const inner = (
        <article
            className={`grid h-full grid-cols-1 overflow-hidden border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] sm:grid-cols-[40%_1fr] ${
                className ?? ''
            }`}
        >
            <div className="bg-[var(--iko-stone-mid)]/40">
                <img
                    src={banner.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            </div>
            <div className="flex flex-col gap-3 p-6 sm:p-8">
                <h3 className="font-display text-[1.5rem] leading-tight text-[var(--iko-stone-ink)]">
                    {banner.title}
                </h3>
                {banner.subtitle && (
                    <p className="text-[14px] leading-[1.55] text-[var(--iko-stone-ink)]/75">
                        {banner.subtitle}
                    </p>
                )}
                {banner.link_text && (
                    <span className="mt-2 inline-flex items-baseline gap-2 font-spec text-[12px] tracking-[0.04em] text-[var(--iko-accent)] uppercase">
                        {banner.link_text}
                        <span aria-hidden="true">→</span>
                    </span>
                )}
            </div>
        </article>
    );

    return <BannerLinkWrapper banner={banner}>{inner}</BannerLinkWrapper>;
}

function BannerLinkWrapper({ banner, children }: { banner: BannerData; children: ReactNode }) {
    if (!banner.link_type || !banner.link_value) {
        return <>{children}</>;
    }

    const linkClass =
        'block transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset';

    if (banner.link_type === 'url') {
        return (
            <a href={banner.link_value} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {children}
            </a>
        );
    }

    const href =
        banner.link_type === 'product'
            ? `/products/${banner.link_value}`
            : `/catalog?category_id=${banner.link_value}`;

    return (
        <Link href={href} className={linkClass}>
            {children}
        </Link>
    );
}
