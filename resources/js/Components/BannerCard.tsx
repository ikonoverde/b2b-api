import { Link } from '@inertiajs/react';

export interface BannerData {
    id: number;
    title: string;
    subtitle: string | null;
    image_url: string;
    link_type: 'product' | 'category' | 'url' | null;
    link_value: string | null;
    link_text: string | null;
}

export default function BannerCard({ banner, className }: { banner: BannerData; className?: string }) {
    return (
        <div className={`relative rounded-2xl overflow-hidden ${className ?? 'h-48'}`}>
            <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                <h3 className="font-[Outfit] font-bold text-xl text-white">
                    {banner.title}
                </h3>
                {banner.subtitle && (
                    <p className="font-[Outfit] text-sm text-white/80 mt-1">
                        {banner.subtitle}
                    </p>
                )}
                {banner.link_type && banner.link_value && banner.link_text && (
                    <BannerLink banner={banner}>
                        {banner.link_text}
                    </BannerLink>
                )}
            </div>
        </div>
    );
}

function BannerLink({ banner, children }: { banner: BannerData; children: React.ReactNode }) {
    const className = "inline-flex mt-3 bg-white text-[#5E7052] px-4 py-2 rounded-lg font-[Outfit] font-semibold text-sm hover:bg-white/90 transition-colors w-fit";

    if (banner.link_type === 'url') {
        return (
            <a href={banner.link_value!} target="_blank" rel="noopener noreferrer" className={className}>
                {children}
            </a>
        );
    }

    const href = banner.link_type === 'product'
        ? `/products/${banner.link_value}`
        : `/catalog?category_id=${banner.link_value}`;

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    );
}
