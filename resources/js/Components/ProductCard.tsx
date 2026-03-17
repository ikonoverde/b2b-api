import { Link } from '@inertiajs/react';

interface ProductCardProps {
    slug: string;
    name: string;
    price: string;
    image: string | null;
    imageHeight?: string;
}

export default function ProductCard({ slug, name, price, image, imageHeight = 'h-32 lg:h-40' }: ProductCardProps) {
    return (
        <Link
            href={`/products/${slug}`}
            className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden flex flex-col hover:shadow-md transition-shadow"
        >
            <div className={`${imageHeight} bg-[#F5F3F0]`}>
                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-10 h-10 bg-[#E8E8E8] rounded-full" />
                    </div>
                )}
            </div>
            <div className="p-3 flex flex-col gap-1">
                <span className="font-[Outfit] font-semibold text-[#1A1A1A] text-sm leading-snug line-clamp-2">
                    {name}
                </span>
                <span className="font-[Outfit] font-bold text-[#8B6F47] text-sm">
                    {price}
                </span>
            </div>
        </Link>
    );
}
