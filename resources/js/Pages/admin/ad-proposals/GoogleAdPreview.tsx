import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import type { GoogleAdCreative } from '@/types';

/**
 * Google rotates responsive search ad assets, so the SERP unit shows a rotating
 * slice of the headline and description pools rather than a fixed combination.
 */
function rotate(items: string[], offset: number, take: number): string[] {
    if (items.length === 0) {
        return [];
    }

    return Array.from({ length: Math.min(take, items.length) }, (_, index) => items[(offset + index) % items.length]);
}

function SerpAd({ creative, offset }: { creative: GoogleAdCreative; offset: number }) {
    const headlines = rotate(creative.headlines, offset, 3);
    const descriptions = rotate(creative.descriptions, offset, 2);
    const path = creative.path ? `/${creative.path.replace(/^\/+/, '')}` : '';

    return (
        <div className="w-full max-w-[652px] font-[Arial,sans-serif]">
            <div className="flex items-center gap-2 text-[14px] leading-tight text-[#202124]">
                <span className="font-bold">Patrocinado</span>
            </div>
            <div className="mt-1 flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DADCE0] bg-white text-[12px] font-semibold text-[#4A5D4A]">
                    {creative.display_url.charAt(0).toUpperCase()}
                </div>
                <div className="flex min-w-0 flex-col">
                    <span className="truncate text-[14px] leading-tight text-[#202124]">
                        {creative.display_url}
                    </span>
                    <span className="truncate text-[12px] leading-tight text-[#4D5156]">
                        https://{creative.display_url}
                        {path}
                    </span>
                </div>
            </div>

            <h3 className="mt-1 text-[20px] leading-[1.3] text-[#1A0DAB] hover:underline">
                {headlines.length > 0 ? headlines.join(' | ') : '—'}
            </h3>

            {descriptions.length > 0 && (
                <p className="mt-1 text-[14px] leading-[1.58] text-[#4D5156]">{descriptions.join(' ')}</p>
            )}

            {creative.sitelinks.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-x-10 gap-y-2">
                    {creative.sitelinks.map((sitelink) => (
                        <span
                            key={sitelink}
                            className="border-t border-[#DADCE0] pt-2 text-[14px] text-[#1A0DAB] hover:underline"
                        >
                            {sitelink}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

function AssetList({ title, items, limit }: { title: string; items: string[]; limit: number }) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
                <span className="font-[Outfit] text-[11px] font-medium uppercase tracking-wide text-[#999999]">
                    {title}
                </span>
                <span className="font-[Outfit] text-[11px] text-[#999999]">
                    {items.length} / {limit}
                </span>
            </div>
            <ul className="flex flex-col gap-1.5">
                {items.map((item) => (
                    <li
                        key={item}
                        className="flex items-baseline justify-between gap-4 rounded-lg border border-[#E5E5E5] bg-white px-3 py-2"
                    >
                        <span className="font-[Outfit] text-sm text-[#1A1A1A]">{item}</span>
                        <span className="shrink-0 font-[Outfit] text-xs text-[#999999]">{item.length}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function GoogleAdCard({ creative }: { creative: GoogleAdCreative }) {
    const [offset, setOffset] = useState(0);

    return (
        <div className="flex flex-col gap-5">
            {creative.ad_group && (
                <span className="font-[Outfit] text-xs font-medium text-[#666666]">
                    Grupo de anuncios: {creative.ad_group}
                </span>
            )}

            <div className="flex flex-col gap-3 rounded-xl border border-[#E5E5E5] bg-white p-6">
                <SerpAd creative={creative} offset={offset} />

                {creative.headlines.length > 3 && (
                    <button
                        type="button"
                        onClick={() => setOffset((current) => current + 1)}
                        className="flex w-fit items-center gap-2 font-[Outfit] text-xs font-medium text-[#4A5D4A] hover:underline"
                    >
                        <RefreshCw className="h-3 w-3" />
                        Ver otra combinación
                    </button>
                )}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <AssetList title="Títulos" items={creative.headlines} limit={15} />
                <AssetList title="Descripciones" items={creative.descriptions} limit={4} />
            </div>

            {creative.keywords.length > 0 && (
                <div className="flex flex-col gap-2">
                    <span className="font-[Outfit] text-[11px] font-medium uppercase tracking-wide text-[#999999]">
                        Palabras clave
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {creative.keywords.map((keyword) => (
                            <span
                                key={keyword}
                                className="rounded-full border border-[#E5E5E5] bg-white px-2.5 py-1 font-[Outfit] text-xs text-[#666666]"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function GoogleAdPreview({ creatives }: { creatives: GoogleAdCreative[] }) {
    return (
        <div className="flex flex-col gap-8 rounded-xl bg-[#F1F3F4] p-6">
            {creatives.map((creative, index) => (
                <GoogleAdCard key={index} creative={creative} />
            ))}
        </div>
    );
}
