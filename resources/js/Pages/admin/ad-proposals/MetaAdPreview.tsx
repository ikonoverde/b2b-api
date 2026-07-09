import {
    Bookmark,
    ChevronRight,
    Globe,
    Heart,
    ImageIcon,
    MessageCircle,
    MoreHorizontal,
    Send,
    Share2,
    ThumbsUp,
} from 'lucide-react';
import { useState } from 'react';
import type { AdProposalBrand, MetaAdCreative } from '@/types';

type Placement = 'facebook' | 'instagram';

function BrandAvatar({ brand, size = 40 }: { brand: AdProposalBrand; size?: number }) {
    return (
        <div
            className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4A5D4A] to-[#2f3d2f] font-semibold text-white"
            style={{ width: size, height: size, fontSize: size * 0.42 }}
        >
            {brand.initial}
        </div>
    );
}

function CreativeMedia({
    creative,
    aspect,
}: {
    creative: MetaAdCreative;
    aspect: string;
}) {
    if (creative.image_url) {
        return (
            <img
                src={creative.image_url}
                alt={creative.headline ?? 'Creativo del anuncio'}
                className="w-full object-cover"
                style={{ aspectRatio: aspect }}
            />
        );
    }

    return (
        <div
            className="flex w-full flex-col items-center justify-center gap-2 bg-[#E4E6EB] px-6 text-center"
            style={{ aspectRatio: aspect }}
        >
            <ImageIcon className="h-8 w-8 text-[#8A8D91]" />
            <p className="max-w-sm text-[13px] leading-snug text-[#65676B]">
                {creative.media_note ?? 'Sin imagen definida'}
            </p>
        </div>
    );
}

function FacebookAd({ creative, brand }: { creative: MetaAdCreative; brand: AdProposalBrand }) {
    return (
        <div className="w-full max-w-[500px] overflow-hidden rounded-lg bg-white font-[system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            <div className="flex items-start gap-2 px-3 pb-2 pt-3">
                <BrandAvatar brand={brand} />
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[15px] font-semibold leading-tight text-[#050505]">
                        {brand.name}
                    </span>
                    <span className="flex items-center gap-1 text-[13px] leading-tight text-[#65676B]">
                        Patrocinado <span aria-hidden>·</span> <Globe className="h-3 w-3" />
                    </span>
                </div>
                <MoreHorizontal className="h-5 w-5 shrink-0 text-[#65676B]" />
            </div>

            {creative.primary_text && (
                <p className="whitespace-pre-line px-3 pb-3 text-[15px] leading-[1.35] text-[#050505]">
                    {creative.primary_text}
                </p>
            )}

            <CreativeMedia creative={creative} aspect="1.91 / 1" />

            <div className="flex items-center gap-3 border-b border-[#CED0D4] bg-[#F7F8FA] px-3 py-2">
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[12px] uppercase tracking-wide text-[#65676B]">
                        {brand.display_url}
                    </span>
                    <span className="truncate text-[16px] font-semibold leading-tight text-[#050505]">
                        {creative.headline ?? '—'}
                    </span>
                    {creative.description && (
                        <span className="truncate text-[13px] text-[#65676B]">{creative.description}</span>
                    )}
                </div>
                <button
                    type="button"
                    className="shrink-0 cursor-default rounded-md bg-[#E4E6EB] px-3 py-2 text-[14px] font-semibold text-[#050505]"
                >
                    {creative.cta}
                </button>
            </div>

            <div className="flex items-center justify-around px-3 py-1">
                {[
                    { icon: ThumbsUp, label: 'Me gusta' },
                    { icon: MessageCircle, label: 'Comentar' },
                    { icon: Share2, label: 'Compartir' },
                ].map(({ icon: Icon, label }) => (
                    <span
                        key={label}
                        className="flex flex-1 items-center justify-center gap-2 py-2 text-[15px] font-semibold text-[#65676B]"
                    >
                        <Icon className="h-[18px] w-[18px]" />
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}

function InstagramAd({ creative, brand }: { creative: MetaAdCreative; brand: AdProposalBrand }) {
    const handle = brand.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    return (
        <div className="w-full max-w-[420px] overflow-hidden rounded-lg border border-[#DBDBDB] bg-white font-[system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif]">
            <div className="flex items-center gap-3 px-3 py-2.5">
                <div className="rounded-full bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5] p-[2px]">
                    <div className="rounded-full bg-white p-[2px]">
                        <BrandAvatar brand={brand} size={30} />
                    </div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[14px] font-semibold leading-tight text-[#262626]">
                        {handle}
                    </span>
                    <span className="text-[12px] leading-tight text-[#262626]">Patrocinado</span>
                </div>
                <MoreHorizontal className="h-5 w-5 shrink-0 text-[#262626]" />
            </div>

            <CreativeMedia creative={creative} aspect="1 / 1" />

            <div className="flex items-center justify-between border-b border-[#EFEFEF] px-3 py-3">
                <span className="text-[14px] font-semibold text-[#262626]">{creative.cta}</span>
                <ChevronRight className="h-4 w-4 text-[#262626]" />
            </div>

            <div className="flex items-center gap-4 px-3 pb-1 pt-3">
                <Heart className="h-6 w-6 text-[#262626]" />
                <MessageCircle className="h-6 w-6 -scale-x-100 text-[#262626]" />
                <Send className="h-6 w-6 text-[#262626]" />
                <Bookmark className="ml-auto h-6 w-6 text-[#262626]" />
            </div>

            {(creative.primary_text || creative.headline) && (
                <p className="whitespace-pre-line px-3 pb-4 pt-2 text-[14px] leading-[1.4] text-[#262626]">
                    <span className="font-semibold">{handle}</span>{' '}
                    {creative.primary_text ?? creative.headline}
                </p>
            )}
        </div>
    );
}

export default function MetaAdPreview({
    creatives,
    brand,
}: {
    creatives: MetaAdCreative[];
    brand: AdProposalBrand;
}) {
    const [placement, setPlacement] = useState<Placement>('facebook');

    return (
        <div className="flex flex-col gap-5">
            <div className="flex w-fit gap-1 rounded-lg border border-[#E5E5E5] bg-[#FBF9F7] p-1">
                {(
                    [
                        ['facebook', 'Facebook feed'],
                        ['instagram', 'Instagram feed'],
                    ] as const
                ).map(([value, label]) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setPlacement(value)}
                        className={`rounded-md px-3 py-1.5 font-[Outfit] text-sm font-medium transition-colors ${
                            placement === value
                                ? 'bg-white text-[#1A1A1A] shadow-sm'
                                : 'text-[#666666] hover:text-[#1A1A1A]'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-6 rounded-xl bg-[#F0F2F5] p-6">
                {creatives.map((creative, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        {creatives.length > 1 && (
                            <span className="font-[Outfit] text-xs font-medium text-[#666666]">
                                Creativo {index + 1}
                            </span>
                        )}
                        {placement === 'facebook' ? (
                            <FacebookAd creative={creative} brand={brand} />
                        ) : (
                            <InstagramAd creative={creative} brand={brand} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
